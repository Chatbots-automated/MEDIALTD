import React from 'react';

const HeroSlider: React.FC = () => {
  // Using just one hero image instead of a slideshow
  const heroImage = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-black/40 z-10"
          style={{ mixBlendMode: 'multiply' }}
        ></div>
        <img
          src={heroImage}
          alt="Hero image"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default HeroSlider;