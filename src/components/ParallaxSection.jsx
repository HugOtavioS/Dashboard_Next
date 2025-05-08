'use client';

import { useEffect, useRef, useState } from 'react';

export function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.1, // Higher means faster parallax effect
  offset = 100, // How much the element will move
  fullHeight = true, // Whether the section should take up the full viewport height
  minOpacity = 0.6 // Minimum opacity for elements leaving viewport (higher means more visible)
}) {
  const sectionRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate visibility percentage (1 when fully in view, 0 when fully out of view)
      const visiblePercentage = Math.min(
        Math.max(
          (windowHeight - Math.max(0, rect.top)) / rect.height, 
          0
        ), 1
      );
      
      // Check if section is visible or close to viewport
      const threshold = windowHeight * 0.5; // Consider elements within half a screen
      if (rect.top < windowHeight + threshold && rect.bottom > -threshold) {
        // Calculate how far the section is from the center of the viewport
        const distanceFromCenter = rect.top - windowHeight / 2;
        // Apply reduced parallax effect
        const newTranslateY = distanceFromCenter * speed * 0.8;
        
        // Limit the translation to the offset
        const limitedTranslate = Math.max(Math.min(newTranslateY, offset), -offset);
        setTranslateY(limitedTranslate);
        
        // Apply fade effect based on visibility, but maintain higher minimum opacity
        const newOpacity = Math.min(
          Math.max(
            1 - Math.abs(distanceFromCenter) / (windowHeight * 1.2),
            minOpacity
          ),
          1
        );
        setOpacity(newOpacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, offset, minOpacity]);

  // Calculate a dynamic padding to keep elements more visible
  const paddingY = fullHeight ? 'py-12 md:py-16' : '';

  return (
    <div 
      ref={sectionRef}
      className={`relative ${fullHeight ? 'min-h-[85vh] flex items-center' : ''} ${paddingY} ${className}`}
    >
      <div 
        className="w-full"
        style={{ 
          transform: `translateY(${translateY}px)`,
          opacity,
          transition: 'transform 0.3s ease-out, opacity 0.4s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}