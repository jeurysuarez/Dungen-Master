import React from 'react';

const SpellCastEffect: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none animate-spell-flash"
      style={{
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(168, 85, 247, 0) 75%)',
      }}
      aria-hidden="true"
    />
  );
};

export default SpellCastEffect;