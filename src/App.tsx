import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Users, Video, Film, Bone as Drone, Instagram, Facebook, Twitter, Mail, Sparkles, ArrowRight, CheckCircle, Clock, Users as UsersIcon, Camera, Play, Share2, Calendar, Star, Zap, Award } from 'lucide-react';
import ContactForm from './components/ContactForm';
import HeroSection from './components/HeroSection';
import PortfolioGrid from './components/PortfolioGrid';
import Logo from './components/Logo';
import { Link } from 'react-router-dom';

function App() {
  const heroImage = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Initialize video playback
  useEffect(() => {
    if (videoRef.current) {
      // Add event listeners to track video state
      videoRef.current.addEventListener('play', () => setIsVideoPlaying(true));
      videoRef.current.addEventListener('pause', () => setIsVideoPlaying(false));
      
      // Attempt to play the video initially, but don't worry if it fails
      // (browsers often block autoplay until user interaction)
      videoRef.current.play().catch(e => {
        console.log("Auto-play prevented:", e);
        setIsVideoPlaying(false);
      });
    }
    
    return () => {
      // Clean up event listeners
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', () => setIsVideoPlaying(true));
        videoRef.current.removeEventListener('pause', () => setIsVideoPlaying(false));
      }
    };
  }, []);
  
  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // If video is paused, play it
        videoRef.current.play()
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(error => {
            console.error("Error playing video:", error);
          });
      } else {
        // If video is playing, pause it
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Function to send webhook when a service is clicked
  const handleServiceClick = async (serviceId: string) => {
    // Don't send webhook for Touch+
    if (serviceId === 'touchplus') {
      return;
    }
    
    try {
      // Get service name from ID
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      
      // Prepare webhook data
      const webhookData = {
        selectedService: service.name,
        timestamp: new Date().toISOString(),
        source: 'Touch Media Website - Homepage Service Click',
        sessionId: Math.random().toString(36).substring(2, 15)
      };
      
      // Send webhook
      await fetch('https://hook.eu2.make.com/pnog5ikfptipkgbg15nyy4zr8jni4ax4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
      
      console.log('Service click webhook sent successfully');
    } catch (error) {
      console.error('Error sending service click webhook:', error);
    }
  };
  
  // Define services for the homepage
  const services = [
    { id: '360-booth', name: '360 Booth', icon: <ShoppingBag size={28} className="text-white" />, description: 'Immersive 360° photo experience for events and brand activations', price: '€100/hr' },
    { id: 'photography', name: 'Photography', icon: <ShoppingBag size={28} className="text-white" />, description: 'Professional photography for products, fashion, and portraits', price: '€100' },
    { id: 'videography', name: 'Videography', icon: <ShoppingBag size={28} className="text-white" />, description: 'High-quality video production for events and brand content', price: '€100' },
    { id: 'touchplus', name: 'Touch+', icon: <Sparkles size={28} className="text-yellow-400" />, description: 'Premium subscription service for monthly content creation', isPremium: true, price: '€250/mo' }
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-black/90 backdrop-blur-sm py-3' : 'bg-transparent py-5'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#services" className="text-white hover:text-gray-300 transition-colors relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#portfolio" className="text-white hover:text-gray-300 transition-colors relative group">
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
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
          <button 
            className="md:hidden text-white px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors"
            onClick={toggleMobileMenu}
          >
            Menu
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm py-4 px-4 absolute w-full">
            <div className="flex flex-col space-y-4">
              <a 
                href="#services" 
                className="text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#portfolio" 
                className="text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </a>
              <Link 
                to="/about" 
                className="text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/touchplus" 
                className="text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="inline-flex items-center">
                  <Sparkles size={16} className="mr-1 text-yellow-400" />
                  Touch+
                </span>
              </Link>
              <Link 
                to="/booking" 
                className="text-white bg-black hover:bg-gray-900 transition-colors px-4 py-2 rounded-md border border-white/30 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="h-screen">
        <HeroSection 
          imageUrl={heroImage}
          fallbackColor="#121212"
        />
      </section>

      {/* Touch+ Premium Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('./ASSETS/touch+.png')` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Sparkles size={18} className="text-yellow-400 mr-2" />
                  <span className="text-yellow-400 font-medium">Exclusive Membership</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide">
                  ELEVATE YOUR <span className="font-bold relative inline-block">
                    BRAND
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400"></span>
                  </span> WITH TOUCH+
                </h2>
                
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  Join our premium subscription service and receive professionally crafted content every month, designed to boost your social media engagement and elevate your brand presence.
                </p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-start">
                    <div className="p-2 bg-yellow-400/20 rounded-lg mr-4 flex-shrink-0">
                      <CheckCircle size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Consistent Content Delivery</h3>
                      <p className="text-gray-300">Never worry about content gaps again with monthly professional photo and video packages.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 bg-yellow-400/20 rounded-lg mr-4 flex-shrink-0">
                      <UsersIcon size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Stand Out From Competitors</h3>
                      <p className="text-gray-300">Join the elite 12% of brands that maintain consistent, professional content across all platforms.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 bg-yellow-400/20 rounded-lg mr-4 flex-shrink-0">
                      <Clock size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Save Time & Resources</h3>
                      <p className="text-gray-300">Focus on your business while we handle your content creation needs.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/touchplus" 
                    className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium text-lg"
                  >
                    Unlock Touch+ <ArrowRight className="ml-2" size={20} />
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Stats & Testimonial */}
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 animate-fade-in">
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="text-center p-6 bg-black/30 rounded-lg border border-gray-800">
                    <h3 className="text-4xl font-bold text-yellow-400 mb-2">87%</h3>
                    <p className="text-gray-300">Increase in engagement with professional content</p>
                  </div>
                  
                  <div className="text-center p-6 bg-black/30 rounded-lg border border-gray-800">
                    <h3 className="text-4xl font-bold text-yellow-400 mb-2">3x</h3>
                    <p className="text-gray-300">Higher conversion rates compared to DIY content</p>
                  </div>
                </div>
                
                {/* Testimonial removed as requested */}
                
                <div className="flex items-center justify-between bg-yellow-400/10 rounded-lg p-4 border border-yellow-400/30">
                  <div>
                    <p className="text-yellow-400 font-medium mb-1">Limited Time Offer</p>
                    <p className="text-white text-sm">Only 5 membership spots remaining this month</p>
                  </div>
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    Act Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">OUR PORTFOLIO</h2>
          <div className="w-20 h-1 bg-white mb-12"></div>
          
          <PortfolioGrid />
          
          <div className="mt-16 text-center">
            <Link to="/booking" className="inline-flex items-center px-8 py-4 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium text-lg">
              Book Your Session
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">OUR SERVICES</h2>
          <div className="w-20 h-1 bg-white mb-12"></div>
          
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-8 max-w-3xl mx-auto">
            <p className="text-white text-sm text-center">
              The service price excludes travel fees, content production time, studio rental and any other additional charges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Photography */}
            <div 
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white group relative flex flex-col"
              onClick={() => handleServiceClick('photography')}
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/20 rounded-lg">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <div className="text-white font-medium">
                  <span className="text-sm">From</span>
                  <div className="text-xl">€100</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-3">Photography</h3>
              <p className="text-gray-300 mb-6 text-sm">Showcase your fashion line with editorial-quality photography that highlights the beauty and detail of your designs.</p>
              
              <ul className="mb-8 space-y-2">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Professional models
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Studio or location shoots
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Editorial styling
                </li>
              </ul>
              
              <div className="mt-auto">
                <Link to="/booking" className="block text-center py-3 px-4 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium">
                  Book Now
                </Link>
              </div>
            </div>
            
            {/* Videography */}
            <div 
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white group relative flex flex-col"
              onClick={() => handleServiceClick('videography')}
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/20 rounded-lg">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <div className="text-white font-medium">
                  <span className="text-sm">From</span>
                  <div className="text-xl">€100</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-3">Videography</h3>
              <p className="text-gray-300 mb-6 text-sm">Capture the essence of individuals with our videography services, perfect for branded content.</p>
              
              <ul className="mb-8 space-y-2">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Video optimisation and colour grading
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Multiple outfit changes
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Digital delivery
                </li>
              </ul>
              
              <div className="mt-auto">
                <Link to="/booking" className="block text-center py-3 px-4 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium">
                  Book Now
                </Link>
              </div>
            </div>
            
            {/* Touch+ | Members Only */}
            <div 
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-400 group relative flex flex-col"
              onClick={() => handleServiceClick('touchplus')}
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium">Premium</span>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-yellow-400/20 rounded-lg">
                  <Sparkles size={28} className="text-yellow-400" />
                </div>
                <div className="text-yellow-400 font-medium">
                  <span className="text-sm">From</span>
                  <div className="text-xl">€250/mo</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-3 flex items-center">
                Touch+ <span className="ml-2 text-yellow-400 text-sm font-normal">| Members Only</span>
              </h3>
              <p className="text-gray-300 mb-6 text-sm">Subscribe to our premium content service for a monthly package of professional photos and videos tailored for your brand.</p>
              
              <ul className="mb-8 space-y-2">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Professional content creation
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Monthly delivery
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Social media optimization
                </li>
              </ul>
              
              <div className="mt-auto">
                <Link to="/touchplus" className="block text-center py-3 px-4 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium">
                  Learn More
                </Link>
              </div>
            </div>
            
            {/* 360 Booth */}
            <div 
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white group relative flex flex-col"
              onClick={() => handleServiceClick('360-booth')}
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/20 rounded-lg">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <div className="text-white font-medium">
                  <span className="text-sm">From</span>
                  <div className="text-xl">€100/hr</div>
                  <div className="text-xs text-yellow-400">5hr+ is discounted</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-3">360 Booth</h3>
              <p className="text-gray-300 mb-6 text-sm">360 booth is a game-changer for content creation, offering cinematic, professional-grade footage in a compact, easy-to-use system.</p>
              
              <ul className="mb-8 space-y-2">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  360-Degree Spinning Arm captures a whole view of the subject
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Professional retouching
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Commercial usage rights
                </li>
              </ul>
              
              <div className="mt-auto">
                <Link to="/booking" className="block text-center py-3 px-4 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            {/* Get Custom Quote button removed as requested */}
          </div>
        </div>
      </section>

      {/* 360 Booth Section */}
      <section id="360booth" className="py-20 bg-black relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Camera size={16} className="text-white mr-2" />
              <span className="text-white text-sm font-medium">Exclusive Experience</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-light text-center mb-4">
              GET IN THE <span className="font-bold text-white">360 BOOTH</span>
            </h2>
            <div className="w-40 h-0.5 bg-white mb-4"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side - Video */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden group">
                <video 
                  ref={videoRef}
                  src="./ASSETS/booth360vid.webm" 
                  className="w-full h-auto rounded-xl transform transition-all duration-700 group-hover:scale-105"
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-center">
                  <div className="p-4 w-full">
                    <div className="flex justify-between items-center">
                      <button 
                        className={`text-sm ${isVideoPlaying ? 'bg-gray-800 text-white' : 'bg-white text-black'} hover:bg-gray-200 hover:text-black px-4 py-1.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1.5 font-medium`} 
                        onClick={handlePlayButtonClick}
                      >
                        {isVideoPlaying ? (
                          <>
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play size={14} className={isVideoPlaying ? "text-white" : "text-black"} />
                            See it in action
                          </>
                        )}
                      </button>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-white">98%</span>
                  <p className="text-sm text-gray-300 mt-1">Guest participation rate</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-white">5x</span>
                  <p className="text-sm text-gray-300 mt-1">More social shares</p>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="lg:col-span-5">
              <p className="text-lg text-gray-300 mb-8">
                Create unforgettable, shareable moments with our state-of-the-art 360° video booth.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border-l-2 border-white">
                  <div className="mr-4">
                    <Play size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cinematic Quality</h3>
                    <p className="text-sm text-gray-400">Professional-grade slow-motion footage</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border-l-2 border-white">
                  <div className="mr-4">
                    <Share2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Instant Sharing</h3>
                    <p className="text-sm text-gray-400">Direct to guests' phones for social media</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border-l-2 border-white">
                  <div className="mr-4">
                    <Award size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fully Managed</h3>
                    <p className="text-sm text-gray-400">We handle setup, operation, and assistance</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/booking" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => handleServiceClick('360-booth')}
                >
                  Book Your 360 Booth <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">GET IN TOUCH</h2>
            <div className="w-20 h-1 bg-white mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-300 mb-8">
                  For any other queries, service requests, booking changes or special requests please do not hesitate to contact us via our email or Instagram DM linked below, our team will contact you back within several hours.
                </p>
                
                <div className="mb-8">
                  <p className="text-white mb-2">Email</p>
                  <a href="mailto:info@touchmedialtd.com" className="text-gray-300 hover:text-white">info@touchmedialtd.com</a>
                </div>
                
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/touch_medialtd/" className="text-gray-300 hover:text-white transition-colors">
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} Touch Media Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;