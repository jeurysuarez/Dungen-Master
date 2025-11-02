import React from 'react';
import type { Skill } from '../types';

interface SkillActionsProps {
  skills: Skill[];
  onUse: (skillName: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const SkillActions: React.FC<SkillActionsProps> = ({ skills, onUse, onBack, isLoading }) => {
  if (skills.length === 0) {
    return (
       <div className="flex flex-col items-center gap-4 p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
        <p className="text-gray-400">No tienes habilidades de clase.</p>
        <button onClick={onBack} disabled={isLoading} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700">Volver</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {skills.map(skill => {
          const onCooldown = skill.turnsUntilReady > 0;
          return (
            <button
              key={skill.name}
              onClick={() => onUse(skill.name)}
              disabled={isLoading || onCooldown}
              title={skill.description}
              className="px-4 py-3 text-white font-bold rounded-md bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 disabled:bg-gray-600/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-md text-left flex justify-between items-center"
            >
              <span>{skill.name}</span>
              {onCooldown ? (
                <span className="flex items-center text-sm font-mono text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {skill.turnsUntilReady}
                </span>
              ) : (
                <span className="text-sm font-mono text-amber-300">LISTO</span>
              )}
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

export default SkillActions;
