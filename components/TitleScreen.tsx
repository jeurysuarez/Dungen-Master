import React from 'react';

interface TitleScreenProps {
  onStartNewGame: () => void;
  onLoadGame: () => void;
  hasSaveData: boolean;
}

const RACE_IMAGE_URLS: { [key: string]: string } = {
  Humano: 'https://i.ibb.co/CK43cCd/human.png',
  Elfo: 'https://i.ibb.co/M6L7M3p/elf.png',
  Enano: 'https://i.ibb.co/Wc7sYc8/dwarf.png',
  Mediano: 'https://i.ibb.co/tLW04TM/halfling.png',
  Dracónido: 'https://i.ibb.co/hK5MSkX/dragonborn.png',
  Gnomo: 'https://i.ibb.co/G2CgX9N/gnome.png',
  Semielfo: 'https://i.ibb.co/vYyT9gP/half-elf.png',
  Semiorco: 'https://i.ibb.co/3k5fTzC/half-orc.png',
  Tiflin: 'https://i.ibb.co/yQfQ9yY/tiefling.png',
};

const RACE_IMAGES = Object.entries(RACE_IMAGE_URLS).map(([name, imageUrl]) => ({
    name,
    imageUrl,
}));


const TitleScreen: React.FC<TitleScreenProps> = ({ onStartNewGame, onLoadGame, hasSaveData }) => {
  
  const buttonClasses = "w-full px-6 py-3 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors text-lg";

  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto flex items-center justify-center h-full text-center">
      <div className="bg-gray-800/50 border border-amber-600/30 rounded-lg p-8 shadow-2xl backdrop-blur-sm w-full">
        <h1 className="text-6xl font-bold text-amber-400 font-serif-dnd drop-shadow-[0_4px_4px_rgba(0,0,0,0.7)] mb-4">
          Dungeon Master IA
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Una aventura de texto generada por IA.
        </p>

        <div className="mb-8">
            <h3 className="text-amber-300 font-serif-dnd text-xl mb-4">Forja tu leyenda como...</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {RACE_IMAGES.map(race => (
                    <div key={race.name} className="flex-shrink-0 flex flex-col items-center group">
                        <img 
                            src={race.imageUrl} 
                            alt={race.name} 
                            className="w-20 h-20 rounded-full border-2 border-amber-800 object-cover bg-gray-900/50 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 shadow-lg"
                        />
                        <span className="mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">{race.name}</span>
                    </div>
                ))}
            </div>
        </div>
        
        {hasSaveData ? (
          <div className="space-y-4">
            <button 
              onClick={onLoadGame} 
              className={`${buttonClasses} bg-green-600 hover:bg-green-700 focus:ring-green-500`}
            >
              Continuar Aventura
            </button>
            <button 
              onClick={onStartNewGame} 
              className={`${buttonClasses} bg-amber-700 hover:bg-amber-800 focus:ring-amber-500`}
            >
              Nueva Partida
            </button>
          </div>
        ) : (
          <button 
            onClick={onStartNewGame} 
            className={`${buttonClasses} bg-amber-600 hover:bg-amber-700 focus:ring-amber-500`}
          >
            Empezar Aventura
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;