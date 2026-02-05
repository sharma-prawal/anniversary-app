import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Welcome from './components/Welcome';
import Puzzle from './components/Puzzle';
import Progress from './components/Progress';
import FinalReveal from './components/FinalReveal';
import { memories } from './data/memories';

// Game states
const GAME_STATES = {
  WELCOME: 'welcome',
  PLAYING: 'playing',
  ALMOST_THERE: 'almost_there',
  COMPLETE: 'complete',
};

export default function App() {
  const [gameState, setGameState] = useState(GAME_STATES.WELCOME);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const audioRef = useRef(null);

  // Handle audio autoplay with user interaction
  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsAudioPlaying(true);
          setShowAudioPrompt(false);
        })
        .catch((err) => {
          console.log('Audio autoplay blocked:', err);
          setShowAudioPrompt(true);
        });
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
        setShowAudioPrompt(false);
      }
    }
  };

  const handleUnlock = () => {
    setGameState(GAME_STATES.PLAYING);
    startAudio();
  };

  const handlePuzzleComplete = () => {
    if (currentPuzzle < memories.length - 1) {
      setCurrentPuzzle((prev) => prev + 1);
    } else {
      // Show suspense screen before final reveal
      setGameState(GAME_STATES.ALMOST_THERE);
      setTimeout(() => {
        setGameState(GAME_STATES.COMPLETE);
      }, 2500);
    }
  };

  // Page variants for transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-50 via-romantic-100 to-pink-100">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/music/background.mp3"
        loop
        preload="auto"
      />

      {/* Audio Control Button */}
      {gameState !== GAME_STATES.WELCOME && (
        <motion.button
          onClick={toggleAudio}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-romantic-500 hover:bg-white transition-all"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isAudioPlaying ? 'Pause music' : 'Play music'}
        >
          {isAudioPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M12 12h.01M15 12h.01" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </motion.button>
      )}

      {/* Audio Prompt Toast */}
      <AnimatePresence>
        {showAudioPrompt && gameState !== GAME_STATES.WELCOME && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 z-50 bg-white rounded-xl shadow-xl p-4 max-w-xs"
          >
            <p className="text-romantic-600 text-sm mb-2">🎵 Enable music for the full experience?</p>
            <button
              onClick={toggleAudio}
              className="w-full py-2 bg-romantic-500 text-white rounded-lg text-sm hover:bg-romantic-600 transition-colors"
            >
              Play Music
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar (during game) */}
      <AnimatePresence>
        {gameState === GAME_STATES.PLAYING && (
          <Progress current={currentPuzzle + 1} total={memories.length} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {gameState === GAME_STATES.WELCOME && (
          <motion.div
            key="welcome"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Welcome onUnlock={handleUnlock} />
          </motion.div>
        )}

        {gameState === GAME_STATES.PLAYING && (
          <motion.div
            key={`puzzle-${currentPuzzle}`}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="pt-20" // Space for progress bar
          >
            <Puzzle
              memory={memories[currentPuzzle]}
              onComplete={handlePuzzleComplete}
              puzzleNumber={currentPuzzle + 1}
              totalPuzzles={memories.length}
            />
          </motion.div>
        )}

        {gameState === GAME_STATES.ALMOST_THERE && (
          <motion.div
            key="almost-there"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <motion.div 
              className="backdrop-blur-md bg-white/80 shadow-xl rounded-3xl p-10 text-center max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl mb-6"
              >
                💕
              </motion.div>
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-romantic-gradient"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                One last thing…
              </motion.h2>
            </motion.div>
          </motion.div>
        )}

        {gameState === GAME_STATES.COMPLETE && (
          <motion.div
            key="complete"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <FinalReveal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
