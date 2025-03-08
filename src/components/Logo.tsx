import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img 
        src="./ASSETS/Touch Media ltd.png" 
        alt="Touch Media Logo" 
        className="mr-3 h-20 md:h-24" 
      />
      <span className="text-xl md:text-2xl font-light tracking-wider"></span>
    </div>
  );
};

export default Logo;