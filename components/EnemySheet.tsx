import React, { useState, useEffect } from 'react';
import type { Enemy } from '../types';

interface EnemySheetProps {
  enemy: Enemy;
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

const EnemySheet: React.FC<EnemySheetProps> = ({ enemy, damageTrigger }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (damageTrigger > 0) {
      setAnimationClass('damage-flash');
      const timer = setTimeout(() => setAnimationClass(''), 600);
      return () => clearTimeout(timer);
    }
  }, [damageTrigger]);

  return (
    <div className={`bg-gray-800/50 border border-red-600/30 rounded-lg p-6 shadow-lg h-fit backdrop-blur-sm animate-fade-in transition-shadow ${animationClass}`}>
      <h2 className="text-2xl font-bold font-serif-dnd text-red-400 border-b-2 border-red-600/50 pb-2 mb-4">
        {enemy.name}
      </h2>
      <div className="space-y-4 text-lg">
        <p className="text-gray-300 italic text-base">"{enemy.description}"</p>
         <div>
            <div className="flex justify-between font-bold mb-1">
                <span className="text-gray-400">PS:</span>
                <span className="text-red-400">{enemy.currentHp} / {enemy.maxHp}</span>
            </div>
            <StatBar value={enemy.currentHp} max={enemy.maxHp} color="bg-red-500" />
        </div>
      </div>
    </div>
  );
};

export default EnemySheet;