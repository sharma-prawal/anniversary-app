import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANNIVERSARY_PASSWORD } from '../data/memories';

const HeartIcon = () => (
  <svg className="w-8 h-8 text-romantic-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default function Welcome({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalize the password (handle different date formats)
    const normalizedInput = password.trim().replace(/[\/\.]/g, '-');
    const normalizedPassword = ANNIVERSARY_PASSWORD.trim().replace(/[\/\.]/g, '-');
    
    if (normalizedInput.toLowerCase() === normalizedPassword.toLowerCase()) {
      onUnlock();
    } else {
      setError('That\'s not our special date... Try again! 💔');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const floatingHearts = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Hearts Background */}
      {floatingHearts.map((i) => (
        <motion.div
          key={i}
          className="absolute text-romantic-200 pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 50,
            opacity: 0.3,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{ 
            y: -100,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear"
          }}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="backdrop-blur-md bg-white/80 shadow-xl rounded-3xl p-8 max-w-md w-full text-center relative z-10"
      >
        {/* Decorative Hearts */}
        <div className="flex justify-center gap-2 mb-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <HeartIcon />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            <HeartIcon />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >
            <HeartIcon />
          </motion.div>
        </div>

        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-romantic-gradient mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          A Special Surprise
        </motion.h1>
        
        <motion.p 
          className="text-romantic-600 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Enter our anniversary date to unlock something magical...
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="DD-MM-YYYY"
              className="input-romantic"
              autoComplete="off"
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-romantic-500 text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="btn-romantic w-full min-h-[48px] text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Our Journey ❤️
          </motion.button>
        </form>

        <motion.p 
          className="mt-6 text-romantic-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Hint: The day we became "us" 💕
        </motion.p>
      </motion.div>
    </div>
  );
}
