import React from 'react';
import type { Item } from '../types';

interface InventoryActionsProps {
  inventory: Item[];
  onUse: (itemName: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const InventoryActions: React.FC<InventoryActionsProps> = ({ inventory, onUse, onBack, isLoading }) => {
    if (inventory.length === 0) {
    return (
       <div className="flex flex-col items-center gap-4 p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
        <p className="text-gray-400">Tu inventario está vacío.</p>
        <button onClick={onBack} disabled={isLoading} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700">Volver</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900/80 border-t border-gray-700 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {inventory.map(item => (
          <button
            key={item.name}
            onClick={() => onUse(item.name)}
            disabled={isLoading}
            title={item.description}
            className="px-4 py-3 text-white font-bold rounded-md bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors text-md text-left flex justify-between items-center"
          >
            <span>{item.name}</span>
            <span className="text-sm font-mono">x{item.quantity}</span>
          </button>
        ))}
      </div>
       <div className="text-center mt-4">
        <button onClick={onBack} disabled={isLoading} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700">Volver</button>
      </div>
    </div>
  );
};

export default InventoryActions;