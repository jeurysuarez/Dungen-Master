import React, { useState } from 'react';
import type { Character, Item, Spell, Skill } from '../types';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const RACES = ['Humano', 'Elfo', 'Enano', 'Mediano', 'Dracónido', 'Gnomo', 'Semielfo', 'Semiorco', 'Tiflin'];
const CLASSES = ['Guerrero', 'Pícaro', 'Mago', 'Clérigo', 'Explorador', 'Bárbaro', 'Bardo', 'Druida', 'Monje', 'Paladín', 'Hechicero', 'Brujo'];

const CLASS_DEFAULTS: { [key: string]: { attack: number, defense: number, maxHp: number, maxMp: number, spells: Spell[], inventory: Item[], skills: Skill[] } } = {
    Guerrero: { attack: 4, defense: 4, maxHp: 15, maxMp: 0, spells: [], inventory: [{ name: 'Poción de Salud', description: 'Restaura 10 PS.', quantity: 1 }], skills: [{ name: 'Golpe Poderoso', description: 'Un ataque devastador que inflige daño adicional.', cooldown: 3, turnsUntilReady: 0 }] },
    Pícaro: { attack: 3, defense: 2, maxHp: 12, maxMp: 5, spells: [], inventory: [{ name: 'Poción de Salud', description: 'Restaura 10 PS.', quantity: 2 }], skills: [{ name: 'Ataque Furtivo', description: 'Un ataque preciso que ignora la defensa del enemigo.', cooldown: 4, turnsUntilReady: 0 }] },
    Mago: { attack: 1, defense: 1, maxHp: 8, maxMp: 20, spells: [{ name: 'Rayo de Fuego', description: 'Lanza una mota de fuego que inflige daño.', cost: 5 }, { name: 'Misil Mágico', description: 'Dispara dardos de fuerza infalibles.', cost: 8 }], inventory: [], skills: [{ name: 'Meditación Arcana', description: 'Recupera 10 PM.', cooldown: 2, turnsUntilReady: 0 }] },
    Clérigo: { attack: 3, defense: 3, maxHp: 12, maxMp: 15, spells: [{ name: 'Curar', description: 'Restaura 8 PS.', cost: 8 }], inventory: [{ name: 'Poción de Salud', description: 'Restaura 10 PS.', quantity: 1 }], skills: [{ name: 'Protección Divina', description: 'Aumenta tu defensa durante 2 turnos.', cooldown: 4, turnsUntilReady: 0 }] },
    Explorador: { attack: 3, defense: 2, maxHp: 12, maxMp: 5, spells: [], inventory: [{ name: 'Poción de Salud', description: 'Restaura 10 PS.', quantity: 1 }], skills: [{ name: 'Disparo Preciso', description: 'Un disparo certero que nunca falla e inflige daño extra.', cooldown: 3, turnsUntilReady: 0 }] },
    Bárbaro: { attack: 5, defense: 2, maxHp: 18, maxMp: 0, spells: [], inventory: [{ name: 'Poción de Salud', description: 'Restaura 10 PS.', quantity: 1 }], skills: [{ name: 'Furia Incontrolable', description: 'Aumenta tu ataque durante 2 turnos.', cooldown: 3, turnsUntilReady: 0 }] },
    Bardo: { attack: 2, defense: 2, maxHp: 10, maxMp: 12, spells: [{ name: 'Burla Hiriente', description: 'Insulta a un enemigo, causando daño psíquico.', cost: 4 }], inventory: [], skills: [{ name: 'Canción de Cuna', description: 'El enemigo pierde su próximo turno.', cooldown: 5, turnsUntilReady: 0 }] },
    Druida: { attack: 2, defense: 3, maxHp: 12, maxMp: 15, spells: [{ name: 'Enmarañar', description: 'Lianas brotan del suelo para sujetar a un enemigo.', cost: 7 }], inventory: [], skills: [{ name: 'Piel de Corteza', description: 'Aumenta mucho tu defensa para el próximo ataque.', cooldown: 3, turnsUntilReady: 0 }] },
    Monje: { attack: 3, defense: 3, maxHp: 12, maxMp: 10, spells: [], inventory: [], skills: [{ name: 'Ráfaga de Golpes', description: 'Realiza dos ataques rápidos en un turno.', cooldown: 3, turnsUntilReady: 0 }] },
    Paladín: { attack: 4, defense: 5, maxHp: 15, maxMp: 10, spells: [{ name: 'Castigo Divino', description: 'Canaliza energía divina en un golpe poderoso.', cost: 6 }], inventory: [], skills: [{ name: 'Imposición de Manos', description: 'Restaura una cantidad moderada de tus PS.', cooldown: 5, turnsUntilReady: 0 }] },
    Hechicero: { attack: 1, defense: 1, maxHp: 8, maxMp: 20, spells: [{ name: 'Toque Eléctrico', description: 'Un relámpago brota de tu mano.', cost: 5 }], inventory: [], skills: [{ name: 'Potenciar Magia', description: 'Tu próximo hechizo inflige el doble de daño.', cooldown: 4, turnsUntilReady: 0 }] },
    Brujo: { attack: 2, defense: 2, maxHp: 10, maxMp: 15, spells: [{ name: 'Explosión Sobrenatural', description: 'Un rayo de energía crepitante.', cost: 0 }], inventory: [], skills: [{ name: 'Maldición Debilitadora', description: 'Reduce el ataque del enemigo durante 2 turnos.', cooldown: 3, turnsUntilReady: 0 }] },
};

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState(RACES[0]);
  const [charClass, setCharClass] = useState(CLASSES[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        setError('Un héroe debe tener un nombre.');
        return;
    }
    setError('');
    const defaults = CLASS_DEFAULTS[charClass];
    onCharacterCreate({
      name: name.trim(),
      race,
      class: charClass,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      maxHp: defaults.maxHp,
      currentHp: defaults.maxHp,
      maxMp: defaults.maxMp,
      currentMp: defaults.maxMp,
      attack: defaults.attack,
      defense: defaults.defense,
      spells: defaults.spells,
      inventory: defaults.inventory,
      skills: defaults.skills,
    });
  };
  
  const FormInput: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="block mb-2 text-sm font-bold text-gray-400">{label}</label>
        {children}
    </div>
  );

  const sharedInputClass = "w-full bg-gray-900/80 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all";
  const selectedClassStats = CLASS_DEFAULTS[charClass];

  return (
    <div className="relative z-20 w-full max-w-md mx-auto flex items-center justify-center h-full">
        <div className="bg-gray-800/50 border border-amber-600/30 rounded-lg p-8 shadow-lg backdrop-blur-sm w-full">
            <h1 className="text-4xl font-bold text-center text-amber-400 font-serif-dnd drop-shadow-lg mb-6">
                Forja a tu Héroe
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput label="Nombre">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ej., Alistair el Valiente"
                        className={sharedInputClass}
                        required
                    />
                </FormInput>

                <FormInput label="Raza">
                    <select value={race} onChange={(e) => setRace(e.target.value)} className={sharedInputClass}>
                        {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </FormInput>

                <FormInput label="Clase">
                     <select value={charClass} onChange={(e) => setCharClass(e.target.value)} className={sharedInputClass}>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="text-xs text-gray-400 grid grid-cols-2 gap-x-4 gap-y-1 mt-2 p-2 bg-black/20 rounded-md">
                        <p>PS: <span className="font-bold text-gray-300">{selectedClassStats.maxHp}</span></p>
                        <p>PM: <span className="font-bold text-gray-300">{selectedClassStats.maxMp}</span></p>
                        <p>Ataque: <span className="font-bold text-gray-300">{selectedClassStats.attack}</span></p>
                        <p>Defensa: <span className="font-bold text-gray-300">{selectedClassStats.defense}</span></p>
                    </div>
                </FormInput>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full mt-4 px-6 py-3 bg-amber-600 text-white font-bold rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-colors text-lg"
                >
                    Comenzar Aventura
                </button>
            </form>
        </div>
    </div>
  );
};

export default CharacterCreation;