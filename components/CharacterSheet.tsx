import React, { useState, useEffect } from 'react';
import type { Character } from '../types';

interface CharacterSheetProps {
  character: Character;
  damageTrigger: number;
}

const StatBar: React.FC<{ value: number, max: number, color: string }> = ({ value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    )
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, damageTrigger }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (damageTrigger > 0) {
      setAnimationClass('damage-flash');
      const timer = setTimeout(() => setAnimationClass(''), 600);
      return () => clearTimeout(timer);
    }
  }, [damageTrigger]);

  return (
    <div className={`bg-gray-800/50 border border-amber-600/30 rounded-lg p-6 shadow-lg h-fit backdrop-blur-sm transition-shadow ${animationClass}`}>
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold font-serif-dnd text-amber-400 border-b-2 border-amber-600/50 pb-2 mb-4 flex-1">
          {character.name}
        </h2>
        <div className="ml-4 text-center bg-gray-900/50 px-3 py-1 rounded-md border border-gray-600">
            <span className="font-bold text-gray-400 text-xs">NIVEL</span>
            <p className="font-bold text-2xl text-amber-300 leading-none">{character.level}</p>
        </div>
      </div>
      <div className="space-y-4 text-lg">
        <div className="flex justify-between">
          <span className="font-bold text-gray-400">Raza:</span>
          <span className="text-gray-100">{character.race}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-gray-400">Clase:</span>
          <span className="text-gray-100">{character.class}</span>
        </div>
        <div>
            <div className="flex justify-between font-bold mb-1">
                <span className="text-gray-400">PS:</span>
                <span className="text-green-400">{character.currentHp} / {character.maxHp}</span>
            </div>
            <StatBar value={character.currentHp} max={character.maxHp} color="bg-green-500" />
        </div>
        <div>
            <div className="flex justify-between font-bold mb-1">
                <span className="text-gray-400">PM:</span>
                <span className="text-blue-400">{character.currentMp} / {character.maxMp}</span>
            </div>
            <StatBar value={character.currentMp} max={character.maxMp} color="bg-blue-500" />
        </div>
        <div>
            <div className="flex justify-between font-bold mb-1 text-sm">
                <span className="text-gray-400">XP:</span>
                <span className="text-purple-400">{character.xp} / {character.xpToNextLevel}</span>
            </div>
            <StatBar value={character.xp} max={character.xpToNextLevel} color="bg-purple-500" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center bg-gray-700/50 p-2 rounded-md">
                <span className="font-bold text-gray-400 text-sm">Ataque</span>
                <p className="font-bold text-xl text-amber-300">{character.attack}</p>
            </div>
            <div className="text-center bg-gray-700/50 p-2 rounded-md">
                <span className="font-bold text-gray-400 text-sm">Defensa</span>
                <p className="font-bold text-xl text-sky-300">{character.defense}</p>
            </div>
        </div>
        <div className="pt-4 space-y-4">
            {character.skills.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-400 border-b border-amber-600/30 pb-1 mb-2 text-base">Habilidades</h3>
                    <ul className="space-y-1 text-sm max-h-24 overflow-y-auto">
                        {character.skills.map(skill => (
                            <li key={skill.name} className="flex justify-between pr-2">
                                <span title={skill.description}>{skill.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {character.spells.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-400 border-b border-amber-600/30 pb-1 mb-2 text-base">Hechizos</h3>
                    <ul className="space-y-1 text-sm max-h-24 overflow-y-auto">
                        {character.spells.map(spell => (
                            <li key={spell.name} className="flex justify-between pr-2">
                                <span title={spell.description}>{spell.name}</span>
                                <span className="text-blue-400 font-mono">{spell.cost} PM</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {character.inventory.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-400 border-b border-amber-600/30 pb-1 mb-2 text-base">Inventario</h3>
                    <ul className="space-y-1 text-sm max-h-24 overflow-y-auto">
                        {character.inventory.map(item => (
                            <li key={item.name} className="flex justify-between pr-2">
                                <span title={item.description}>{item.name}</span>
                                <span className="font-mono">x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;