import React, { useState, useEffect } from 'react';

interface TitleScreenProps {
  onStartNewGame: () => void;
  onLoadGame: () => void;
  hasSaveData: boolean;
}

const RACE_IMAGE_URLS: { [key: string]: string } = {
  Humano: 'https://i.postimg.cc/nrZzV833/human-paladin.png',
  Elfo: 'https://i.postimg.cc/J0Bv4tVb/elf-ranger.png',
  Enano: 'https://i.postimg.cc/cLDyG6Vf/dwarf-warrior.png',
  Mediano: 'https://i.postimg.cc/YCwL7yN6/halfling-rogue.png',
  Dracónido: 'https://i.postimg.cc/x8P5G14G/dragonborn-sorcerer.png',
  Gnomo: 'https://i.postimg.cc/j2y2Ljgq/gnome-artificer.png',
  Semielfo: 'https://i.postimg.cc/W3dKwyv6/half-elf-bard.png',
  Semiorco: 'https://i.postimg.cc/kXF12B9d/half-orc-barbarian.png',
  Tiflin: 'https://i.postimg.cc/NfK7pSjV/tiefling-warlock.png',
};

const RACE_DESCRIPTIONS: { [key: string]: string } = {
  Humano: "Versátiles y ambiciosos, los humanos son la raza más joven, pero su ímpetu por dejar una marca en el mundo es inigualable.",
  Elfo: "Elegantes y longevos, los elfos viven en perfecta armonía con la naturaleza, poseedores de una gracia y una visión que trascienden el tiempo.",
  Enano: "Robustos y leales, los enanos son maestros artesanos de la piedra y el metal, con un amor por la tradición y un coraje tan sólido como las montañas que llaman hogar.",
  Mediano: "Amantes de la comodidad y la buena vida, los medianos poseen una suerte increíble y un valor que a menudo sorprende a las razas más grandes.",
  Dracónido: "Forjados por los dioses dragón, los dracónidos caminan con orgullo y honor, llevando la herencia de su poder elemental en sus venas.",
  Gnomo: "Curiosos e inventivos, los gnomos son un torbellino de energía y buenas intenciones, siempre explorando nuevas ideas y maravillas.",
  Semielfo: "Atrapados entre dos mundos, los semielfos combinan la gracia élfica con la ambición humana, creando individuos carismáticos y de gran habilidad.",
  Semiorco: "Intensos y resilientes, los semiorcos canalizan su furia en una fuerza formidable, luchando por encontrar su lugar en un mundo que a menudo los rechaza.",
  Tiflin: "Con una herencia infernal, los tiflin son astutos y autosuficientes, caminando por un sendero oscuro mientras forjan su propio destino.",
};

const RACE_IMAGES = Object.entries(RACE_IMAGE_URLS).map(([name, imageUrl]) => ({
    name,
    imageUrl,
}));


const TitleScreen: React.FC<TitleScreenProps> = ({ onStartNewGame, onLoadGame, hasSaveData }) => {
  const [activeTooltip, setActiveTooltip] = useState<{ race: string; top: number; left: number } | null>(null);

  const handleRaceClick = (event: React.MouseEvent, raceName: string) => {
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      setActiveTooltip({
          race: raceName,
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
      });
  };

  useEffect(() => {
    const handleClickOutside = () => {
        setActiveTooltip(null);
    };

    if (activeTooltip) {
        document.addEventListener('click', handleClickOutside);
    }

    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
  }, [activeTooltip]);

  const buttonClasses = "w-full px-6 py-3 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors text-lg";

  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto flex items-center justify-center h-full text-center">
      {activeTooltip && (
        <div
            className="fixed z-50 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg max-w-xs border border-amber-700 animate-fade-in-fast"
            style={{ 
              top: activeTooltip.top, 
              left: activeTooltip.left, 
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
            }}
        >
            <h4 className="font-bold text-amber-400 font-serif-dnd mb-1">{activeTooltip.race}</h4>
            <p className="text-gray-300">{RACE_DESCRIPTIONS[activeTooltip.race]}</p>
            <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0"
                style={{
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #451a03',
                    transform: 'translateY(100%)'
                }}
            />
        </div>
      )}

      <div className="bg-gray-800/50 border border-amber-600/30 rounded-lg p-8 shadow-2xl backdrop-blur-sm w-full">
        <h1 className="text-6xl font-bold text-amber-400 font-serif-dnd drop-shadow-[0_4px_4px_rgba(0,0,0,0.7)] mb-4">
          Dungeon Master IA
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Una aventura de texto generada por IA.
        </p>

        <div className="mb-8">
            <h3 className="text-amber-300 font-serif-dnd text-xl mb-4">Forja tu leyenda como...</h3>
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                {RACE_IMAGES.map(race => (
                    <div 
                        key={race.name} 
                        className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
                        onClick={(e) => handleRaceClick(e, race.name)}
                    >
                        <img 
                            src={race.imageUrl} 
                            alt={race.name} 
                            className="w-36 h-36 rounded-full border-4 border-amber-800 object-contain group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 shadow-lg"
                        />
                        <span className="mt-4 text-sm text-gray-400 group-hover:text-white transition-colors">{race.name}</span>
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