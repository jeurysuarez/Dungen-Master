import React from 'react';
import type { Spell } from '../types';

interface MagicActionsProps {
  spells: Spell[];
  characterMp: number;
  onCast: (spellName: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const MagicActions: React.FC<MagicActionsProps> = ({ spells, characterMp, onCast, onBack, isLoading }) => {
  if (spells.length === 0) {
    return (
       <div className="flex flex-col items-center gap-4 p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
        <p className="text-gray-400">No conoces hechizos.</p>
        <button onClick={onBack} disabled={isLoading} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700">Volver</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {spells.map(spell => {
          const canCast = characterMp >= spell.cost;
          return (
            <button
              key={spell.name}
              onClick={() => onCast(spell.name)}
              disabled={isLoading || !canCast}
              title={spell.description}
              className="px-4 py-3 text-white font-bold rounded-md bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-md text-left flex justify-between items-center"
            >
              <span>{spell.name}</span>
              <span className="text-sm font-mono text-blue-300">{spell.cost} PM</span>
            </button>
          )
        })}
      </div>
      <div className="text-center mt-4">
        <button onClick={onBack} disabled={isLoading} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700">Volver</button>
      </div>
    </div>
  );
};

export default MagicActions;
