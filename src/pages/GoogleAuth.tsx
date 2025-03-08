import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const GoogleAuth: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Replace these with your actual Google OAuth credentials
  const clientId = "YOUR_GOOGLE_CLIENT_ID";
  const redirectUri = window.location.origin + "/auth/google/callback";
  const scope = "email profile"; // Add more scopes as needed
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/touchplus" className="text-white hover:text-gray-300 transition-colors relative group">
              <span className="inline-flex items-center">
                <Sparkles size={16} className="mr-1 text-yellow-400" />
                Touch+
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/booking" className="text-white bg-black hover:bg-gray-900 transition-colors px-4 py-2 rounded-md">
              Book Now
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Link to="/" className="md:hidden text-white px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content Section */}
      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">GOOGLE AUTHORIZATION</h2>
            <div className="w-20 h-1 bg-white mb-12"></div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
              <h3 className="text-2xl font-medium mb-6">Connect with Google</h3>
              
              <p className="text-gray-300 mb-8">
                To continue, you'll need to authorize our application to access your Google account. This allows us to provide you with a seamless experience.
              </p>
              
              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-8 text-left">
                <h4 className="text-lg font-medium mb-2">We'll request access to:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-2"></span>
                    <span>Your basic profile information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-2"></span>
                    <span>Your email address</span>
                  </li>
                </ul>
              </div>
              
              <a 
                href={authUrl}
                className="inline-flex items-center px-8 py-4 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Authorize with Google <ArrowRight className="ml-2" size={20} />
              </a>
              
              <p className="text-gray-400 mt-6 text-sm">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
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

export default GoogleAuth;