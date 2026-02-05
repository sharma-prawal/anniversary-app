import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { finalMessage } from '../data/memories';

export default function FinalReveal() {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Initial confetti burst
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Multiple confetti bursts
    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3', '#ff6b6b', '#ff8787'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3', '#ff6b6b', '#ff8787'],
      });
    }, 250);

    // Heart-shaped confetti
    const heartShape = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    });

    // Initial big burst with hearts
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        shapes: [heartShape, 'circle'],
        colors: ['#ec4899', '#f472b6', '#f9a8d4', '#ff6b6b'],
        scalar: 1.5,
      });
    }, 500);

    // Show content with delays
    setTimeout(() => setShowContent(true), 800);
    setTimeout(() => setShowButton(true), 2000);

    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3'],
    });
  };

  const handleLetterClick = () => {
    triggerConfetti();
    // Small delay before opening link
    setTimeout(() => {
      window.open(finalMessage.letterLink, '_blank');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Hearts */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-romantic-200 pointer-events-none"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400), 
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
            rotate: Math.random() * 360,
            opacity: 0.3 + Math.random() * 0.4,
            scale: 0.3 + Math.random() * 0.7
          }}
          animate={{ 
            y: -100,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="backdrop-blur-md bg-white/80 shadow-xl rounded-3xl p-8 max-w-lg w-full text-center relative z-10"
      >
        {/* Sparkle decorations */}
        <motion.div 
          className="absolute -top-4 -left-4 text-3xl"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div 
          className="absolute -top-4 -right-4 text-3xl"
          animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          ✨
        </motion.div>

        {/* Main Heart Animation */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <span className="text-6xl md:text-8xl">💖</span>
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-romantic-gradient mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {finalMessage.heading}
            </motion.h1>

            <motion.p 
              className="text-romantic-600 text-lg md:text-xl mb-8 italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {finalMessage.subheading}
            </motion.p>

            {/* Decorative Line */}
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-romantic-300" />
              <span className="text-romantic-400">❤️</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-romantic-300" />
            </motion.div>

            {/* Completion Message */}
            <motion.p 
              className="text-romantic-500 mb-6 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              You completed every memory…<br />
              just like we complete each other. 💕
            </motion.p>
          </motion.div>
        )}

        {/* Letter Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={handleLetterClick}
              className="btn-romantic text-lg md:text-xl px-10 py-5 min-h-[56px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                  "0 0 40px rgba(236, 72, 153, 0.5)",
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📜 {finalMessage.letterButtonText}
            </motion.button>

            <motion.p 
              className="mt-6 text-romantic-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              I love you more than words can say ❤️
            </motion.p>
          </motion.div>
        )}

        {/* Bottom decorations */}
        <motion.div 
          className="absolute -bottom-4 -left-4 text-3xl"
          animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          💕
        </motion.div>
        <motion.div 
          className="absolute -bottom-4 -right-4 text-3xl"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        >
          💕
        </motion.div>
      </motion.div>
    </div>
  );
}
