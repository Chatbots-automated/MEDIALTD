import React, { useEffect, useRef } from 'react';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Touch Media Team" 
              className="w-full h-auto rounded-md"
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-light mb-6">Our Vision</h3>
            <p className="text-gray-300 mb-6">
              At Touch Media Ltd., we believe in the power of visual storytelling. Our mission is to create compelling imagery that captures the essence of your brand and connects with your audience on a deeper level.
            </p>
            <p className="text-gray-300 mb-6">
              Founded in 2015, our team of passionate photographers and videographers brings a wealth of experience and creativity to every project. We pride ourselves on our attention to detail, technical expertise, and commitment to exceeding client expectations.
            </p>
            <p className="text-gray-300">
              Whether you're looking for stunning commercial photography, captivating brand films, or striking portraits, we have the skills and vision to bring your ideas to life.
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
  );
};

export default AboutSection;