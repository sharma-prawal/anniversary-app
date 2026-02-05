import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const HeartIcon = ({ filled }) => (
  <svg 
    className={`w-6 h-6 md:w-8 md:h-8 ${filled ? 'text-romantic-500' : 'text-romantic-200'}`} 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default function Progress({ current, total }) {
  const hearts = Array.from({ length: total }, (_, i) => i);
  const prevCurrentRef = useRef(current);
  const [newlyFilled, setNewlyFilled] = useState(-1);
  
  useEffect(() => {
    if (current > prevCurrentRef.current) {
      // A new heart was filled
      setNewlyFilled(current - 1);
      const timer = setTimeout(() => setNewlyFilled(-1), 600);
      prevCurrentRef.current = current;
      return () => clearTimeout(timer);
    }
    prevCurrentRef.current = current;
  }, [current]);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        {/* Heart Progress */}
        <div className="flex justify-center items-center gap-2">
          {hearts.map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ 
                scale: i === newlyFilled ? [0.9, 1.3, 1] : 1,
              }}
              transition={{ 
                delay: i * 0.05,
                duration: i === newlyFilled ? 0.5 : 0.3,
                type: i === newlyFilled ? 'spring' : 'tween',
                stiffness: 300,
                damping: 10,
              }}
            >
              <HeartIcon filled={i < current} />
            </motion.div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 h-1.5 bg-romantic-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-romantic-400 to-romantic-500"
            initial={{ width: 0 }}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Text Progress */}
        <p className="text-center text-romantic-400 text-xs mt-1">
          Memory {current} of {total}
        </p>
      </div>
    </div>
  );
}
