import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Facebook, Twitter, Mail, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-black/90 backdrop-blur-sm py-3' : 'bg-transparent py-5'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/#services" className="text-white hover:text-gray-300 transition-colors relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/#portfolio" className="text-white hover:text-gray-300 transition-colors relative group">
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300 transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </Link>
            <Link to="/touchplus" className="text-white hover:text-gray-300 transition-colors relative group">
              <span className="inline-flex items-center">
                <Sparkles size={16} className="mr-1 text-yellow-400" />
                Touch+
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/#contact" className="text-white bg-black hover:bg-gray-900 transition-colors px-4 py-2 rounded-md">
              Book Now
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Link to="/" className="md:hidden text-white px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* About Section */}
      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-4">
          <div 
            ref={sectionRef}
            className="max-w-4xl mx-auto opacity-0 transition-opacity duration-1000"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">ABOUT US</h2>
            <div className="w-20 h-1 bg-white mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="./ASSETS/Touch Media ltd.png" 
                  alt="Touch Media Logo" 
                  className="w-full h-auto rounded-md"
                />
              </div>
              
              <div>
                <h3 className="text-2xl font-light mb-6">Our Vision</h3>
                <p className="text-gray-300 mb-6">
                  At Touch Media We are dedicated to capturing your most cherished moments with precision and creativity.
                </p>
                <p className="text-gray-300 mb-6">
                  Our expertise in both photography and videography ensures that every detail is beautifully preserved, whether it's for weddings, corporate events, or personal projects.
                </p>
                <p className="text-gray-300">
                  Discover how we can bring your stories to life through our lens.
                </p>
              </div>
            </div>
            
            <div className="mt-20">
              <h3 className="text-2xl font-light mb-8 text-center">Our Approach</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-light">01</span>
                  </div>
                  <h4 className="text-xl font-light mb-4">Discover</h4>
                  <p className="text-gray-300">
                    We begin by understanding your brand, goals, and vision to create a tailored approach for your project.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-light">02</span>
                  </div>
                  <h4 className="text-xl font-light mb-4">Create</h4>
                  <p className="text-gray-300">
                    Our team works meticulously to capture stunning imagery that aligns with your brand identity and objectives.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-light">03</span>
                  </div>
                  <h4 className="text-xl font-light mb-4">Deliver</h4>
                  <p className="text-gray-300">
                    We provide polished, high-quality deliverables that exceed expectations and help achieve your goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} Touch Media Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;