import React from 'react';

interface CombatActionsProps {
  onAction: (action: 'ATACAR' | 'DEFENDER' | 'HUIR') => void;
  onModeChange: (mode: 'magic' | 'inventory' | 'skills') => void;
  isLoading: boolean;
}

const CombatActions: React.FC<CombatActionsProps> = ({ onAction, onModeChange, isLoading }) => {
  const ActionButton: React.FC<{ onClick: () => void, label: string, color: string }> = ({ onClick, label, color }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex-1 px-4 py-3 text-white font-bold rounded-md ${color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors text-md`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2 md:gap-4 p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
      <ActionButton onClick={() => onAction('ATACAR')} label="Atacar" color="bg-red-700 hover:bg-red-800" />
      <ActionButton onClick={() => onAction('DEFENDER')} label="Defender" color="bg-sky-700 hover:bg-sky-800" />
      <ActionButton onClick={() => onModeChange('skills')} label="Habilidades" color="bg-orange-700 hover:bg-orange-800" />
      <ActionButton onClick={() => onModeChange('magic')} label="Magia" color="bg-purple-700 hover:bg-purple-800" />
      <ActionButton onClick={() => onModeChange('inventory')} label="Objetos" color="bg-green-700 hover:bg-green-800" />
      <ActionButton onClick={() => onAction('HUIR')} label="Huir" color="bg-yellow-700 hover:bg-yellow-800" />
    </div>
  );
};

export default CombatActions;
