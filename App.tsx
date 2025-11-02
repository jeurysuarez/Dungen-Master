import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Message, Character, Enemy, DMResponse } from './types';
import type { Chat } from '@google/genai';
import { createGameSession, getInitialStory, sendPlayerAction, generateSpeech } from './services/geminiService';
import CharacterSheet from './components/CharacterSheet';
import StoryLog from './components/StoryLog';
import PlayerInput from './components/PlayerInput';
import CharacterCreation from './components/CharacterCreation';
import EnemySheet from './components/EnemySheet';
import CombatActions from './components/CombatActions';
import MagicActions from './components/MagicActions';
import InventoryActions from './components/InventoryActions';
import SpellCastEffect from './components/SpellCastEffect';
import SkillActions from './components/SkillActions';
import TitleScreen from './components/TitleScreen';

interface GameState {
    character: Character;
    storyLog: Message[];
    isInCombat: boolean;
    enemy: Enemy | null;
}

const SAVE_GAME_KEY = 'dnd_ai_dm_savegame';

// Funciones de decodificación de audio
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const App: React.FC = () => {
  const [storyLog, setStoryLog] = useState<Message[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [gamePhase, setGamePhase] = useState<'title' | 'creation' | 'playing'>('title');
  const [isInCombat, setIsInCombat] = useState<boolean>(false);
  const [combatView, setCombatView] = useState<'main' | 'magic' | 'inventory' | 'skills'>('main');
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);
  const [isCastingSpell, setIsCastingSpell] = useState<boolean>(false);
  const [saveDataExists, setSaveDataExists] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(false);
  const [playerDamageTrigger, setPlayerDamageTrigger] = useState(0);
  const [enemyDamageTrigger, setEnemyDamageTrigger] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(SAVE_GAME_KEY);
      if (savedData) {
        setSaveDataExists(true);
      }
    } catch (e) {
      console.error("No se pudo acceder a localStorage:", e);
    }
  }, []);
  
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    if (gamePhase === 'playing' && character) {
        saveGame();
    }
  }, [character, storyLog, isInCombat, enemy]);

  useEffect(() => {
    if (levelUpMessage) {
      setStoryLog(prev => [...prev, { speaker: 'DM', text: levelUpMessage }]);
      setLevelUpMessage(null); 
    }
  }, [levelUpMessage]);

  const saveGame = useCallback(() => {
    if (!character) return;
    try {
      const gameState: GameState = { character, storyLog, isInCombat, enemy };
      localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error("Error al guardar la partida:", e);
      setError("No se pudo guardar la partida.");
    }
  }, [character, storyLog, isInCombat, enemy]);

  const handleManualSave = () => {
    saveGame();
    setSaveMessage('Partida guardada.');
    setTimeout(() => setSaveMessage(''), 2000); 
  };

  const loadGame = useCallback(() => {
    setIsLoading(true);
    try {
        const savedData = localStorage.getItem(SAVE_GAME_KEY);
        if (savedData) {
            const gameState: GameState = JSON.parse(savedData);
            setCharacter(gameState.character);
            setStoryLog(gameState.storyLog);
            setIsInCombat(gameState.isInCombat);
            setEnemy(gameState.enemy);
            
            const session = createGameSession(gameState.character);
            setChatSession(session);
            
            setGamePhase('playing');
        } else {
            setError("No se encontró ninguna partida guardada.");
        }
    } catch (e) {
        console.error("Error al cargar la partida:", e);
        setError("La partida guardada está corrupta y no se pudo cargar. Por favor, empieza una nueva partida.");
        localStorage.removeItem(SAVE_GAME_KEY);
        setSaveDataExists(false);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleStartNewGameRequest = useCallback(() => {
    if (saveDataExists) {
        if (window.confirm('¿Estás seguro de que quieres empezar una nueva partida? Se borrará todo tu progreso guardado.')) {
            try {
                localStorage.removeItem(SAVE_GAME_KEY);
                setSaveDataExists(false);
            } catch (e) {
                console.error("No se pudo borrar la partida guardada:", e);
            }
            setGamePhase('creation');
        }
    } else {
        setGamePhase('creation');
    }
  }, [saveDataExists]);

  const playAudio = useCallback(async (base64Audio: string) => {
    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
    }
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    try {
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        audioSourceRef.current = source;
    } catch(e) {
        console.error("Error al reproducir audio:", e);
    }
  }, []);

  const progressCooldowns = (char: Character): Character => {
      const newSkills = char.skills.map(skill => ({
          ...skill,
          turnsUntilReady: Math.max(0, skill.turnsUntilReady - 1)
      }));
      return { ...char, skills: newSkills };
  };

  const handleDMResponse = useCallback(async (response: DMResponse) => {
    setStoryLog(prev => [...prev, { speaker: 'DM', text: response.storyText }]);
    
    if (isTtsEnabled && response.storyText) {
        try {
            const audioData = await generateSpeech(response.storyText);
            if (audioData) {
                await playAudio(audioData);
            }
        } catch (e) {
            console.error("Error en TTS:", e);
        }
    }

    if (response.encounter) {
        setIsInCombat(true);
        setEnemy({
            name: response.encounter.name,
            description: response.encounter.description,
            maxHp: response.encounter.hp,
            currentHp: response.encounter.hp,
            attack: response.encounter.attack,
            defense: response.encounter.defense,
        });
    }

    if (response.enemyUpdate) {
        setEnemy(e => {
            if (!e) return null;
            const newHp = response.enemyUpdate?.currentHp ?? e.currentHp;
            if (newHp < e.currentHp) {
                setEnemyDamageTrigger(prev => prev + 1);
            }
            return { ...e, currentHp: newHp };
        });
    }

    if (response.playerUpdate || response.xpAward || isInCombat) {
        setCharacter(c => {
            if (!c) return null;

            let newChar = { ...c };

            if (response.playerUpdate) {
                const newHp = response.playerUpdate.currentHp ?? newChar.currentHp;
                if (newHp < newChar.currentHp) {
                    setPlayerDamageTrigger(prev => prev + 1);
                }
                newChar.currentHp = newHp;
                newChar.currentMp = response.playerUpdate.currentMp ?? newChar.currentMp;
            }

            if (response.xpAward) {
                newChar.xp += response.xpAward;
                if (newChar.xp >= newChar.xpToNextLevel) {
                    const excessXp = newChar.xp - newChar.xpToNextLevel;
                    newChar.level += 1;
                    newChar.xp = excessXp;
                    newChar.xpToNextLevel = Math.floor(newChar.xpToNextLevel * 1.5);
                    newChar.maxHp += 5;
                    newChar.maxMp += 3;
                    newChar.attack += 1;
                    newChar.defense += 1;
                    newChar.currentHp = newChar.maxHp;
                    newChar.currentMp = newChar.maxMp;
                    setLevelUpMessage(`¡Has subido de nivel! Ahora eres nivel ${newChar.level}. Tus estadísticas han mejorado.`);
                }
            }
            
            if(isInCombat) {
              return progressCooldowns(newChar);
            }
            return newChar;
        });
    }

    if (response.loot && character) {
        setCharacter(c => {
            if (!c) return null;
            const newInventory = [...c.inventory];
            response.loot!.items.forEach(newItem => {
                const existingItem = newInventory.find(i => i.name === newItem.name);
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    newInventory.push(newItem);
                }
            });
            return {...c, inventory: newInventory};
        });
    }

    if (response.combatOver) {
        setIsInCombat(false);
        setEnemy(null);
        setCombatView('main');
    }
  }, [character, isInCombat, isTtsEnabled, playAudio]);

  const beginAdventure = useCallback(async (char: Character) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = createGameSession(char);
      setChatSession(session);
      const initialResponse = await getInitialStory(session);
      await handleDMResponse(initialResponse);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
      setError(`No se pudo iniciar el juego. Detalles: ${errorMessage}`);
      setStoryLog([{ speaker: 'DM', text: 'El mundo no logra materializarse...' }]);
    } finally {
      setIsLoading(false);
    }
  }, [handleDMResponse]);


  const handleCharacterCreation = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setGamePhase('playing');
    beginAdventure(newCharacter);
  };

  const handlePlayerAction = async (action: string) => {
    if (!chatSession || !character) {
        setError("La sesión de juego no ha sido inicializada.");
        return;
    }
    
    if (action.startsWith('LANZAR ')) {
        setIsCastingSpell(true);
        setTimeout(() => setIsCastingSpell(false), 500);
    }

    setStoryLog(prev => [...prev, { speaker: 'Player', text: action }]);
    setIsLoading(true);
    setError(null);

    if (action.startsWith('USAR ')) {
        const itemName = action.substring(5);
        setCharacter(c => {
            if (!c) return null;
            const newInventory = c.inventory.map(item => 
                item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
            ).filter(item => item.quantity > 0);
            return { ...c, inventory: newInventory };
        });
    }
    
    if (action.startsWith('USAR HABILIDAD ')) {
        const skillName = action.substring(15);
        setCharacter(c => {
            if (!c) return null;
            const skillToUse = c.skills.find(s => s.name === skillName);
            if (!skillToUse) return c;
            const newSkills = c.skills.map(s =>
                s.name === skillName ? { ...s, turnsUntilReady: s.cooldown + 1 } : s 
            );
            return { ...c, skills: newSkills };
        });
    }

    try {
      const response = await sendPlayerAction(chatSession, action, character, enemy);
      await handleDMResponse(response);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
      setError(`El Dungeon Master está confundido. Detalles: ${errorMessage}`);
      setStoryLog(prev => [...prev, { speaker: 'DM', text: 'Una fuerza extraña interrumpe tu acción...' }]);
    } finally {
      setIsLoading(false);
      if(isInCombat) {
        setCombatView('main');
      }
    }
  };

  const renderContent = () => {
    switch (gamePhase) {
        case 'title':
            return <TitleScreen 
                onStartNewGame={handleStartNewGameRequest}
                onLoadGame={loadGame}
                hasSaveData={saveDataExists}
            />;
        case 'creation':
            return <CharacterCreation onCharacterCreate={handleCharacterCreation} />;
        case 'playing':
            if (!character) {
                // This should not happen if logic is correct, but as a fallback
                return <TitleScreen onStartNewGame={handleStartNewGameRequest} onLoadGame={loadGame} hasSaveData={saveDataExists} />;
            }

            const renderFooter = () => {
                if (!isInCombat) {
                  return <PlayerInput onSubmit={handlePlayerAction} isLoading={isLoading} />;
                }
            
                switch (combatView) {
                  case 'magic': return <MagicActions spells={character.spells} characterMp={character.currentMp} onCast={(spellName) => handlePlayerAction(`LANZAR ${spellName}`)} onBack={() => setCombatView('main')} isLoading={isLoading}/>;
                  case 'inventory': return <InventoryActions inventory={character.inventory} onUse={(itemName) => handlePlayerAction(`USAR ${itemName}`)} onBack={() => setCombatView('main')} isLoading={isLoading}/>;
                  case 'skills': return <SkillActions skills={character.skills} onUse={(skillName) => handlePlayerAction(`USAR HABILIDAD ${skillName}`)} onBack={() => setCombatView('main')} isLoading={isLoading}/>;
                  case 'main': default: return <CombatActions onAction={handlePlayerAction} onModeChange={setCombatView} isLoading={isLoading}/>;
                }
            };

            return (
                 <>
                    {isCastingSpell && <SpellCastEffect />}
                    <main className="relative z-10 container mx-auto p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
                        <div className="flex flex-col flex-1 lg:flex-[2] h-full">
                        <header className="mb-4 flex justify-between items-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-center text-amber-500 font-serif-dnd drop-shadow-lg">Dungeon Master IA</h1>
                            <button 
                                onClick={() => setIsTtsEnabled(prev => !prev)}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors border ${isTtsEnabled ? 'bg-amber-600 border-amber-500 text-white' : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'}`}
                            >
                                {isTtsEnabled ? '🔊 Narrador ON' : '🔈 Narrador OFF'}
                            </button>
                        </header>
                        <div className="flex-1 flex flex-col overflow-hidden relative">
                            <StoryLog messages={storyLog} isLoading={isLoading} />
                        </div>
                        </div>
                        
                        <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 space-y-6">
                        <CharacterSheet character={character} damageTrigger={playerDamageTrigger} />
                        {isInCombat && enemy && <EnemySheet enemy={enemy} damageTrigger={enemyDamageTrigger} />}
                        <div className="bg-gray-800/50 border border-amber-600/30 rounded-lg p-4 shadow-lg h-fit backdrop-blur-sm text-center">
                            <div className="flex gap-2">
                                <button onClick={handleManualSave} disabled={isLoading} className="flex-1 text-sm px-4 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">Guardar</button>
                                <button onClick={() => handleStartNewGameRequest()} className="flex-1 text-sm px-4 py-2 bg-red-800 text-white font-bold rounded-md hover:bg-red-900 transition-colors">Nueva Partida</button>
                            </div>
                            {saveMessage && <p className="text-green-400 text-xs mt-2 animate-pulse">{saveMessage}</p>}
                        </div>
                        {error && (
                            <div className="bg-red-900/70 border border-red-500 text-red-200 p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Error del Sistema</h3>
                            <p className="text-sm">{error}</p>
                            </div>
                        )}
                        </aside>
                    </main>
                    
                    <footer className="relative z-10">
                        <div className="container mx-auto">
                        {renderFooter()}
                        </div>
                    </footer>
                </>
            );
        default:
            return null;
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat" 
      style={{backgroundImage: "url('https://picsum.photos/seed/dndbg/1920/1080')", position: 'relative'}}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      {renderContent()}
    </div>
  );
};

export default App;