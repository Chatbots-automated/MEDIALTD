import React, { useState, useRef, useEffect } from 'react';

// Portfolio items using local images from ASSETS directory
const portfolioItems = [
  {
    id: 1,
    title: 'Fashion Video',
    category: 'Videography',
    image: './ASSETS/0228.webm',
    type: 'video'
  },
  {
    id: 2,
    title: 'Professional Headshot',
    category: 'Portrait',
    image: './ASSETS/9.jpeg',
    type: 'image'
  },
  {
    id: 3,
    title: 'Fashion Editorial',
    category: 'Videography',
    image: './ASSETS/vid3.webm',
    type: 'video'
  },
  {
    id: 4,
    title: 'Product Photography',
    category: 'Photography',
    image: './ASSETS/4.jpeg',
    type: 'image'
  },
  {
    id: 5,
    title: 'Beauty Editorial',
    category: 'Portrait',
    image: './ASSETS/15.jpeg',
    type: 'image'
  },
  {
    id: 6,
    title: 'Jewelry Collection',
    category: 'Photography',
    image: './ASSETS/6.jpeg',
    type: 'image'
  },
  {
    id: 7,
    title: 'Street Fashion',
    category: 'Videography',
    image: './ASSETS/0229.webm',
    type: 'video'
  },
  {
    id: 8,
    title: 'Cosmetics Campaign',
    category: 'Photography',
    image: './ASSETS/10.jpeg',
    type: 'image'
  },
  {
    id: 9,
    title: 'Urban Portrait',
    category: 'Portrait',
    image: './ASSETS/12.jpeg', // Changed from duplicate 9.jpeg to 12.jpeg
    type: 'image'
  },
  {
    id: 10,
    title: 'Fashion Accessories',
    category: 'Photography', // Changed from Videography to Photography
    image: './ASSETS/11.jpeg', // Changed from duplicate vid3.webm to 11.jpeg
    type: 'image' // Changed from video to image
  },
  {
    id: 11,
    title: 'Corporate Team',
    category: 'Photography',
    image: './ASSETS/13.jpeg', // Changed from 12.jpeg to 13.jpeg
    type: 'image'
  },
  {
    id: 12,
    title: 'Food Photography',
    category: 'Photography',
    image: './ASSETS/14.jpeg', // Changed from 13.jpeg to 14.jpeg
    type: 'image'
  },
  {
    id: 13,
    title: 'Luxury Timepiece',
    category: 'Photography',
    image: './ASSETS/8.png', // Changed from 14.jpeg to 8.png
    type: 'image'
  },
  {
    id: 14,
    title: 'Beauty Portrait',
    category: 'Portrait',
    image: './ASSETS/7.jpeg', // Changed from duplicate 15.jpeg to 7.jpeg
    type: 'image'
  },
  {
    id: 15,
    title: 'Fashion Flatlay',
    category: 'Photography', // Changed from Videography to Photography
    image: './ASSETS/16.jpeg', // Changed from vid4.webm to 16.jpeg
    type: 'image' // Changed from video to image
  },
  {
    id: 16,
    title: 'Fashion Showcase',
    category: 'Videography',
    image: './ASSETS/vid4.webm',
    type: 'video'
  }
];

const categories = ['All', 'Photography', 'Videography'];

const PortfolioGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const filteredItems = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);
  
  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, filteredItems.filter(item => item.type === 'video').length);
  }, [filteredItems]);
  
  // Play all videos immediately when they're mounted
  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (video) {
        // Force autoplay with both play() and autoplay attribute
        video.autoplay = true;
        video.muted = true; // Must be muted for autoplay to work in most browsers
        video.play().catch(e => {
          console.log("Auto-play prevented:", e);
        });
      }
    });
    
    // Set up intersection observer to play videos when they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(e => console.log("Play prevented:", e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all video elements
    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });
    
    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [filteredItems]);

  // Handle video click to play/pause
  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>, index: number) => {
    event.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play().catch(e => console.log("Play prevented:", e));
      } else {
        video.pause();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center mb-12 space-x-2 md:space-x-6">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 mb-2 transition-colors duration-300 ${
              activeCategory === category
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => {
          // Calculate different heights for visual interest
          const getHeight = () => {
            // Create a pattern of different heights
            const pattern = index % 4;
            // For video items, use a square aspect ratio
            if (item.type === 'video') {
              return 'h-64 md:h-72'; // Square-ish for videos
            }
            
            switch(pattern) {
              case 0: return 'h-72'; // Tall
              case 1: return 'h-64'; // Medium
              case 2: return 'h-80'; // Extra tall
              case 3: return 'h-auto min-h-56'; // Changed to auto height with min-height
              default: return 'h-64';
            }
          };
          
          return (
            <div 
              key={item.id} 
              className={`relative overflow-hidden rounded-md shadow-md ${
                // Make some images span 2 columns for visual interest
                index % 8 === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className={`relative w-full ${getHeight()}`}>
                {item.type === 'video' ? (
                  <video
                    ref={el => {
                      if (item.type === 'video') {
                        videoRefs.current[index] = el;
                      }
                    }}
                    src={item.image}
                    className="w-full h-full object-contain"
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="auto"
                    onClick={(e) => handleVideoClick(e, index)}
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain" 
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioGrid;