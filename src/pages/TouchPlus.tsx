import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, Calendar, Link as LinkIcon, Zap } from 'lucide-react';
import Logo from '../components/Logo';
import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';

const TouchPlus: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const packageRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  
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
    
    packageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      
      packageRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
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
            <a href="/">
              <Logo />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="/#360booth" className="text-white hover:text-gray-300 transition-colors relative group">
              360 Booth
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors relative group">
              <span className="inline-flex items-center">
                <Sparkles size={16} className="mr-1 text-yellow-400" />
                Touch+
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></span>
            </a>
            <a href="/#portfolio" className="text-white hover:text-gray-300 transition-colors relative group">
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link to="/booking" className="text-white bg-black text-white hover:bg-gray-900 transition-colors px-4 py-2 rounded-md">Book Now</Link>
          </div>
          
          {/* Mobile Menu Button */}
          <a 
            href="/"
            className="md:hidden text-white px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('./ASSETS/touch+.png')`,
            backgroundColor: '#121212',
          }}
          aria-hidden="true"
        >
          {/* Overlay for better text readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 z-10"
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-medium">Premium Subscription</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-wider">
              Elevate Your Brand with <span className="font-bold relative">
                Touch+
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-8 text-gray-200">
              Your monthly premium content subscription designed to boost your social media engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#packages" 
                className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-md"
              >
                View Packages
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center px-6 py-3 bg-black/50 backdrop-blur-sm border border-white text-white hover:bg-white/10 transition-colors duration-300 rounded-md"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Touch+ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div 
            ref={sectionRef}
            className="max-w-4xl mx-auto text-center opacity-0 transition-opacity duration-1000"
          >
            <div className="inline-flex items-center mb-4">
              <Sparkles size={20} className="text-yellow-400 mr-2" />
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">ABOUT TOUCH+</h2>
            </div>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mb-12"></div>
            
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Touch+ is our premium subscription service that provides monthly packages of professionally crafted photos and videos tailored to enhance the online presence of businesses and content creators.
            </p>
            
            <p className="text-xl text-gray-200 mb-12 leading-relaxed">
              Receive fresh, engaging content each month—perfectly capturing your brand's unique style and elevating your social media presence to new heights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-6">
                  <Zap size={28} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-medium mb-4">Consistent Content</h3>
                <p className="text-gray-300">
                  Never worry about content gaps again. Receive a steady stream of high-quality visuals every month.
                </p>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={28} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-medium mb-4">Professional Quality</h3>
                <p className="text-gray-300">
                  Every piece of content is crafted to the highest standards by our team of expert photographers and videographers.
                </p>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-6">
                  <ArrowRight size={28} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-medium mb-4">Brand Consistency</h3>
                <p className="text-gray-300">
                  We ensure all content aligns perfectly with your brand identity, creating a cohesive online presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Overview Section */}
      <section id="packages" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4">
              <Sparkles size={20} className="text-yellow-400 mr-2" />
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">CHOOSE YOUR PACKAGE</h2>
            </div>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the perfect Touch+ package to elevate your social media presence and engage your audience with stunning visual content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Package */}
            <div 
              ref={el => packageRefs.current[0] = el}
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-400 group opacity-0 flex flex-col"
            >
              <div className="mb-6">
                <span className="text-sm text-gray-400 uppercase tracking-wider">Basic</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="text-2xl font-medium mb-0">Essential Content</h3>
                  <div className="text-yellow-400 font-bold text-2xl">€250<span className="text-sm font-normal">/mo</span></div>
                </div>
                <div className="w-full h-px bg-gray-800 mb-6 mt-4"></div>
              </div>
              
              <ul className="mb-8 space-y-4 flex-grow">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">3 professional reels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">4 high-quality posts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Basic editing and color grading</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">1 revision per content piece</span>
                </li>
              </ul>
              
              <a 
                href="https://www.instagram.com/touch_medialtd/" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 px-4 bg-black border border-yellow-400 text-yellow-400 rounded-md hover:bg-yellow-400 hover:text-black transition-colors font-medium mt-auto"
              >
                Enquire Now
              </a>
            </div>
            
            {/* Standard Package */}
            <div 
              ref={el => packageRefs.current[1] = el}
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-400/50 group opacity-0 transform scale-105 z-10 flex flex-col"
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              
              <div className="mb-6 pt-2">
                <span className="text-sm text-gray-400 uppercase tracking-wider">Standard</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="text-2xl font-medium mb-0">Enhanced Presence</h3>
                  <div className="text-yellow-400 font-bold text-2xl">€350<span className="text-sm font-normal">/mo</span></div>
                </div>
                <div className="w-full h-px bg-gray-800 mb-6 mt-4"></div>
              </div>
              
              <ul className="mb-8 space-y-4 flex-grow">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">3 professional reels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">6 high-quality posts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">4 marketing-focused posts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Advanced editing and color grading</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">2 revisions per content piece</span>
                </li>
              </ul>
              
              <a 
                href="https://www.instagram.com/touch_medialtd/" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 px-4 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium mt-auto"
              >
                Enquire Now
              </a>
            </div>
            
            {/* Premium Package */}
            <div 
              ref={el => packageRefs.current[2] = el}
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-400 group opacity-0 flex flex-col"
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium">Best Value</span>
              </div>
              
              <div className="mb-6 pt-2">
                <span className="text-sm text-gray-400 uppercase tracking-wider">Premium</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="text-2xl font-medium mb-0">Complete Solution</h3>
                  <div className="text-yellow-400 font-bold text-2xl">€500<span className="text-sm font-normal">/mo</span></div>
                </div>
                <div className="w-full h-px bg-gray-800 mb-6 mt-4"></div>
              </div>
              
              <ul className="mb-8 space-y-4 flex-grow">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">4 professional reels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">9 high-quality posts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">6 marketing-focused posts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">2 story-specific images</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Premium editing and color grading</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Unlimited revisions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Content strategy consultation</span>
                </li>
              </ul>
              
              <a 
                href="https://www.instagram.com/touch_medialtd/" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 px-4 bg-black border border-yellow-400 text-yellow-400 rounded-md hover:bg-yellow-400 hover:text-black transition-colors font-medium mt-auto"
              >
                Enquire Now
              </a>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">All packages include professional equipment, lighting setup, and digital delivery.</p>
            <p className="text-gray-300">Need a custom solution? <a href="https://www.instagram.com/touch_medialtd/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Contact us</a> for a tailored package.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4">
              <Sparkles size={20} className="text-yellow-400 mr-2" />
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">HOW TOUCH+ WORKS</h2>
            </div>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process ensures you receive exceptional content with minimal effort on your part.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute top-0 left-6 bottom-0 w-px bg-yellow-400/30 hidden md:block"></div>
                <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center absolute -top-6 left-0 text-black font-bold">1</div>
                  <div className="pt-4">
                    <div className="p-4 bg-yellow-400/10 rounded-lg mb-6">
                      <Calendar size={28} className="text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-4">Schedule Your Content Day</h3>
                    <p className="text-gray-300">
                      We come to you! Book a convenient date for our team to capture your content at your location or our studio.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute top-0 left-6 bottom-0 w-px bg-yellow-400/30 hidden md:block"></div>
                <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center absolute -top-6 left-0 text-black font-bold">2</div>
                  <div className="pt-4">
                    <div className="p-4 bg-yellow-400/10 rounded-lg mb-6">
                      <LinkIcon size={28} className="text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-4">Receive Your Content Link</h3>
                    <p className="text-gray-300">
                      Access your professionally edited photos and videos within 24-72 hours through a secure digital delivery link.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center absolute -top-6 left-0 text-black font-bold">3</div>
                  <div className="pt-4">
                    <div className="p-4 bg-yellow-400/10 rounded-lg mb-6">
                      <Zap size={28} className="text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-4">Unleash the Magic</h3>
                    <p className="text-gray-300">
                      Publish your new content and watch engagement grow. We'll help you plan the optimal posting schedule for maximum impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-xl text-gray-300 mb-8">
                The Touch+ subscription renews monthly, ensuring you always have fresh, engaging content to share with your audience.
              </p>
              <a 
                href="https://www.instagram.com/touch_medialtd/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium text-lg"
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4">
              <Sparkles size={20} className="text-yellow-400 mr-2" />
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">FREQUENTLY ASKED QUESTIONS</h2>
            </div>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mb-8"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-4">What is included in a Touch+ subscription?</h3>
              <p className="text-gray-300">
                A Touch+ subscription includes a monthly package of professionally created photos and videos tailored to your brand. The exact number of content pieces depends on your chosen package, but all include professional photography, videography, editing, and digital delivery.
              </p>
            </div>
            
            <div className="mb-8 border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-4">How long does the content creation process take?</h3>
              <p className="text-gray-300">
                The content creation day typically takes 3-5 hours, depending on your package. After the shoot, you'll receive your edited content within 24-72 hours through a secure digital link.
              </p>
            </div>
            
            <div className="mb-8 border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-4">Can I request specific types of content?</h3>
              <p className="text-gray-300">
                Absolutely! We work closely with you to understand your brand and content needs. Before each shoot, we'll discuss your vision and any specific content requirements you have to ensure we capture exactly what you need.
              </p>
            </div>
            
            <div className="mb-8 border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-4">What is the minimum subscription period?</h3>
              <p className="text-gray-300">
                Touch+ subscriptions have a minimum term of 3 months to ensure we can develop a consistent content strategy for your brand. After the initial period, you can continue on a month-to-month basis.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Do you provide content strategy advice?</h3>
              <p className="text-gray-300">
                Yes! All packages include basic content strategy guidance. Our Premium package includes comprehensive content strategy consultation to help you maximize the impact of your social media presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center mb-4">
                <Sparkles size={20} className="text-yellow-400 mr-2" />
                <h2 className="text-3xl md:text-4xl font-light tracking-wide">GET STARTED WITH TOUCH+</h2>
              </div>
              <div className="w-20 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-xl text-gray-300">
                Ready to elevate your social media presence? Contact us today to subscribe to Touch+ or request more information.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-300 mb-8">
                  Fill out the form to get started with Touch+ or to request more information about our premium content subscription service.
                </p>
                
                <div className="mb-8">
                  <p className="text-white mb-2">Email</p>
                  <a href="mailto:info@touchmedialtd.com" className="text-yellow-400 hover:underline">info@touchmedialtd.com</a>
                </div>
                
                <div className="p-6 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                  <h3 className="text-xl font-medium mb-4 text-yellow-400">Not sure which package is right for you?</h3>
                  <p className="text-gray-300 mb-4">
                    Our team can provide a personalized consultation to help you choose the perfect Touch+ package for your specific needs and goals.
                  </p>
                  <a 
                    href="https://www.instagram.com/touch_medialtd/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-yellow-400 hover:underline"
                  >
                    Schedule a consultation <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              </div>
              
              <ContactForm />
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

export default TouchPlus;