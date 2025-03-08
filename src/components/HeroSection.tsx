import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  imageUrl: string;
  fallbackColor?: string;
  headingRef?: React.RefObject<HTMLHeadingElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  imageUrl, 
  fallbackColor = '#121212',
  headingRef
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: fallbackColor, // Fallback if image fails to load
        }}
        aria-hidden="true"
      >
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-black/40 z-10"
          style={{ mixBlendMode: 'multiply' }}
        ></div>
      </div>

      {/* Content */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20"
        style={{ 
          backgroundImage: `url('./ASSETS/Beige Minimalist Ask Question Instagram Post (2).jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#121212' // Add background color to prevent flash of default image
        }}
      >
        <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-wider">
          YOUR <span className="font-bold">VISION</span> OUR LENS
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-200">
          Photography and Videography services for brands that demand excellence
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="#portfolio" 
            className="inline-flex items-center px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors duration-300 rounded-md"
          >
            View Portfolio
          </a>
          <Link 
            to="/touchplus" 
            className="inline-flex items-center px-6 py-3 bg-black/50 backdrop-blur-sm border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-300 rounded-md"
          >
            Unlock Touch+ <Sparkles className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;