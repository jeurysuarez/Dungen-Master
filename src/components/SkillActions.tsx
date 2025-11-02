import React from 'react';
import type { Skill } from '../types';

interface SkillActionsProps {
  skills: Skill[];
  onUse: (skillName: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const SKILL_ICONS: { [key: string]: React.ReactNode } = {
  'Golpe Poderoso': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2.5 16 9l-6.5 6.5" />
      <path d="M3.5 13.5 10 20l6.5-6.5" />
    </svg>
  ),
  'Ataque Furtivo': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 2 20 20" /><path d="M12.5 12.5 22 3" /><path d="M3 22 11.5 13.5" /><path d="M14 10 9 5" />
    </svg>
  ),
  'Meditación Arcana': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 18a6 6 0 1 0 0-12" />
    </svg>
  ),
  'Protección Divina': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  'Disparo Preciso': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  'Furia Incontrolable': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4.5c3 3 1.5 9-1.5 12-3-2.5-2.5-9-1.5-12 1.5-3 6.5-2.5 3 0z" /><path d="M12 12c-2-2.5-1-6.5 1-8.5 2 2 2.5 6 1 8.5z" /><path d="M8.5 16.5c-3-3-1.5-9 1.5-12 3 2.5 2.5 9 1.5 12-1.5 3-6.5 2.5-3 0z" />
    </svg>
  ),
  'Canción de Cuna': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  'Piel de Corteza': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c0-5 2-9 5-10 2 0 4 1 5 3 1-2 3-3 5-3 3 1 5 5 5 10s-2 9-5 10c-2 0-4-1-5-3-1 2-3 3-5 3-3-1-5-5-5-10z" />
    </svg>
  ),
  'Ráfaga de Golpes': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 7a5 5 0 1 0 5-5" /><path d="M3 17a13 13 0 1 0 13-13" />
    </svg>
  ),
  'Imposición de Manos': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2.5a4 4 0 0 1-4-4 4 4 0 0 1-4-4h-1.5A2.5 2.5 0 0 1 2 15.5V14a2 2 0 0 1 2-2h1" />
    </svg>
  ),
  'Potenciar Magia': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  'Maldición Debilitadora': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <path d="M8 20v2h8v-2" /><path d="M12.5 17.5c-.7-.7-1.5-1-2.5-1s-1.8.3-2.5 1" />
      <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
    </svg>
  ),
  'Default': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

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
          const Icon = SKILL_ICONS[skill.name] || SKILL_ICONS['Default'];
          return (
            <button
              key={skill.name}
              onClick={() => onUse(skill.name)}
              disabled={isLoading || onCooldown}
              title={skill.description}
              className="p-3 text-white font-bold rounded-md bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 disabled:bg-gray-600/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-center flex flex-col justify-center items-center gap-2"
            >
              {Icon}
              <span className="text-sm leading-tight">{skill.name}</span>
              {onCooldown ? (
                <div className="mt-1 text-xs font-mono text-gray-300 bg-gray-800/60 px-2 py-1 rounded-full flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{skill.turnsUntilReady} Turnos</span>
                </div>
              ) : (
                <div className="mt-1 text-xs font-mono font-bold text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                  LISTO
                </div>
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
