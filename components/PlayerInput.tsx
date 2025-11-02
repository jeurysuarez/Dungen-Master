import React, { useState } from 'react';

interface PlayerInputProps {
  onSubmit: (action: string) => void;
  isLoading: boolean;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ onSubmit, isLoading }) => {
  const [action, setAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action.trim() && !isLoading) {
      onSubmit(action.trim());
      setAction('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
      <input
        type="text"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="¿Qué haces?"
        disabled={isLoading}
        className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition-all"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-amber-600 text-white font-bold rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        Actuar
      </button>
    </form>
  );
};

export default PlayerInput;