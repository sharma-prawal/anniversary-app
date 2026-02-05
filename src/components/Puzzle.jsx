import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as headbreaker from 'headbreaker';

export default function Puzzle({ memory, onComplete, puzzleNumber, totalPuzzles }) {
  const containerRef = useRef(null);
  const puzzleRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMemory, setShowMemory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Calculate grid dimensions based on piece count
  const getGridSize = (pieces) => {
    if (pieces <= 9) return { rows: 3, cols: 3 };
    if (pieces <= 12) return { rows: 3, cols: 4 };
    if (pieces <= 16) return { rows: 4, cols: 4 };
    if (pieces <= 20) return { rows: 4, cols: 5 };
    return { rows: 5, cols: 5 };
  };

  const initializePuzzle = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Reset progress when initializing
    setProgress(0);
    
    // Clear any existing puzzle
    container.innerHTML = '';
    
    // Get responsive dimensions - fit within viewport without scrolling
    const isMobile = window.innerWidth < 768;
    const parentWidth = container.parentElement?.clientWidth || 600;
    
    // Calculate available height accounting for all UI elements
    const topProgressHeight = 70;
    const cardHeaderHeight = 80;
    const footerHeight = 80;
    const paddingMargins = 40;
    const totalUIHeight = topProgressHeight + cardHeaderHeight + footerHeight + paddingMargins;
    const availableHeight = window.innerHeight - totalUIHeight;
    
    // Better max dimensions
    const maxWidth = isMobile ? Math.min(parentWidth - 16, 340) : Math.min(parentWidth - 32, 480);
    const maxHeight = isMobile ? Math.min(availableHeight, 320) : Math.min(availableHeight, 400);
    
    const { rows, cols } = getGridSize(memory.pieces);
    
    // Calculate piece sizes
    const pieceWidth = Math.floor(maxWidth / cols);
    const pieceHeight = Math.floor(maxHeight / rows);
    const pieceSize = Math.min(pieceWidth, pieceHeight, isMobile ? 85 : 100);
    
    const canvasWidth = pieceSize * cols;
    const canvasHeight = pieceSize * rows;

    // Load the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setIsLoading(false);
      setImageError(false);
      createPuzzle(img, container, rows, cols, pieceSize, canvasWidth, canvasHeight);
    };
    
    img.onerror = () => {
      // Create a gradient placeholder image
      setIsLoading(false);
      setImageError(true);
      createPlaceholderPuzzle(container, rows, cols, pieceSize, canvasWidth, canvasHeight, puzzleNumber);
    };
    
    img.src = memory.image;
  }, [memory, puzzleNumber]);

  const createPlaceholderPuzzle = (container, rows, cols, pieceSize, canvasWidth, canvasHeight, num) => {
    // Create a beautiful gradient placeholder
    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = canvasWidth;
    placeholderCanvas.height = canvasHeight;
    const ctx = placeholderCanvas.getContext('2d');
    
    // Create romantic gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    const colors = [
      ['#fce7f3', '#f9a8d4', '#f472b6'],
      ['#fdf2f8', '#fbcfe8', '#ec4899'],
      ['#fff1f2', '#fecdd3', '#fb7185'],
      ['#fef2f2', '#fecaca', '#f87171'],
      ['#fce7f3', '#f5d0fe', '#e879f9'],
    ];
    const colorSet = colors[num % colors.length];
    gradient.addColorStop(0, colorSet[0]);
    gradient.addColorStop(0.5, colorSet[1]);
    gradient.addColorStop(1, colorSet[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add heart pattern
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `${pieceSize * 0.8}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', canvasWidth / 2, canvasHeight / 2);
    
    // Add puzzle number
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = `bold ${pieceSize * 0.4}px sans-serif`;
    ctx.fillText(`Memory #${num}`, canvasWidth / 2, canvasHeight / 2 + pieceSize * 0.6);

    // Create image from canvas for headbreaker
    const placeholderImg = new Image();
    placeholderImg.onload = () => {
      createPuzzleWithImage(placeholderImg, container, rows, cols, pieceSize, canvasWidth, canvasHeight);
    };
    placeholderImg.src = placeholderCanvas.toDataURL();
  };

  const createPuzzle = (img, container, rows, cols, pieceSize, canvasWidth, canvasHeight) => {
    // Scale the image to fit (contain) the puzzle dimensions while maintaining aspect ratio
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill with a light background first
    tempCtx.fillStyle = '#fdf2f8';
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate scale to contain (fit) the image while maintaining aspect ratio
    const imgAspect = img.width / img.height;
    const canvasAspect = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspect > canvasAspect) {
      // Image is wider - fit to width
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Image is taller - fit to height
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }
    
    // Draw image centered and scaled to fit
    tempCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // Create a new image from the scaled canvas
    const scaledImg = new Image();
    scaledImg.onload = () => {
      createPuzzleWithImage(scaledImg, container, rows, cols, pieceSize, canvasWidth, canvasHeight);
    };
    scaledImg.src = tempCanvas.toDataURL();
  };

  const createPuzzleWithImage = (img, container, rows, cols, pieceSize, canvasWidth, canvasHeight) => {
    try {
      // Create a unique ID for the container
      const containerId = `puzzle-container-${memory.id}-${Date.now()}`;
      container.id = containerId;
      
      // Make the canvas slightly larger than the puzzle to give room for shuffled pieces
      // But not too much to avoid pieces going off-screen
      const canvasPadding = pieceSize * 0.8;
      const fullCanvasWidth = canvasWidth + canvasPadding * 2;
      const fullCanvasHeight = canvasHeight + canvasPadding * 2;
      
      const puzzle = new headbreaker.Canvas(containerId, {
        width: fullCanvasWidth,
        height: fullCanvasHeight,
        pieceSize: pieceSize,
        proximity: pieceSize * 0.3,
        borderFill: pieceSize * 0.1,
        strokeWidth: 2.5,
        strokeColor: '#ec4899',
        lineSoftness: 0.15,
        image: img,
        fixed: false,
        painter: new headbreaker.painters.Konva(),
      });

      puzzle.adjustImagesToPuzzleHeight();
      
      puzzle.autogenerate({
        horizontalPiecesCount: cols,
        verticalPiecesCount: rows,
        insertsGenerator: headbreaker.generators.random,
      });

      // Shuffle with controlled factor to prevent excessive scatter
      puzzle.shuffle(0.4);
      puzzle.draw();

      // Track progress
      const totalPieces = rows * cols;
      let hasCompleted = false;

      // Check completion by counting connected groups
      // When puzzle is complete, all pieces form ONE group
      const checkCompletion = () => {
        try {
          // Get all pieces and count how many groups exist
          const piecesArray = puzzle.puzzle.pieces;
          const groups = new Set();
          
          piecesArray.forEach(piece => {
            // Each piece belongs to a group (connected pieces share the same group reference)
            const group = piece.group || piece;
            groups.add(group);
          });
          
          // Calculate progress based on connected groups
          // Start: totalPieces groups, End: 1 group
          const numGroups = groups.size;
          const maxConnections = totalPieces - 1;
          const connections = totalPieces - numGroups;
          const progressPercent = Math.round((connections / maxConnections) * 100);
          
          setProgress(Math.min(100, progressPercent));
          
          console.log('Groups:', numGroups, 'Progress:', connections, '/', maxConnections, '=', progressPercent + '%');
          
          // Puzzle is complete when all pieces are in one group
          if (numGroups === 1 && !hasCompleted) {
            hasCompleted = true;
            setProgress(100);
            console.log('Puzzle completed! All pieces connected.');
            setTimeout(() => {
              handlePuzzleComplete();
            }, 500);
          }
        } catch (e) {
          console.error('Error checking completion:', e);
        }
      };

      // Track connect with haptic feedback
      puzzle.onConnect(() => {
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
        checkCompletion();
      });
      
      puzzle.onDisconnect(() => {
        checkCompletion();
      });

      puzzleRef.current = puzzle;

    } catch (error) {
      console.error('Error creating puzzle:', error);
      setImageError(true);
    }
  };

  const handlePuzzleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      setShowMemory(true);
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializePuzzle();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (puzzleRef.current) {
        puzzleRef.current = null;
      }
    };
  }, [initializePuzzle]);

  const handleContinue = () => {
    onComplete();
  };

  const handleReset = () => {
    setProgress(0);
    initializePuzzle();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-safe">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="backdrop-blur-md bg-white/80 shadow-xl rounded-3xl p-6 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-3">
          <motion.h2 
            className="text-xl md:text-2xl font-bold text-romantic-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Puzzle {puzzleNumber} of {totalPuzzles}
          </motion.h2>
          
          {/* Progress bar */}
          <div className="mt-2 h-2 bg-romantic-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-romantic-400 to-romantic-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-romantic-400 text-sm mt-1">{progress}% complete</p>
        </div>

        {/* Puzzle Container - Centered wrapper */}
        <div className="w-full max-w-[380px] sm:max-w-[520px] mx-auto">
          <div className="relative flex justify-center items-center min-h-[300px] md:min-h-[420px] bg-gradient-to-br from-romantic-50 to-white rounded-2xl overflow-hidden p-2">
          {isLoading && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-4xl mb-2"
                >
                  💖
                </motion.div>
                <p className="text-romantic-500">Loading your memory...</p>
              </div>
            </motion.div>
          )}
          
          {/* This div will be the container for headbreaker */}
          <div 
            ref={containerRef} 
            className="max-w-full touch-none"
            style={{ touchAction: 'none' }}
          />

          {/* Completion Overlay */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center p-6"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    ✨💖✨
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-bold text-romantic-gradient mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    You did it… just like us ❤️
                  </motion.h3>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* Instructions */}
        {!isCompleted && !isLoading && (
          <div className="text-center mt-3">
            <motion.p 
              className="text-romantic-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Drag pieces together to complete the puzzle 💕
            </motion.p>
            <motion.button
              onClick={handleReset}
              className="mt-2 px-4 py-2 text-sm text-romantic-500 hover:text-romantic-700 hover:bg-romantic-50 rounded-lg transition-colors min-h-[44px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Reset Puzzle
            </motion.button>
          </div>
        )}

        {/* Memory Reveal */}
        <AnimatePresence>
          {showMemory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <motion.h3 
                className="text-2xl font-bold text-romantic-gradient mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {memory.title}
              </motion.h3>
              
              <motion.p 
                className="text-romantic-600 text-lg italic mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                "{memory.description}"
              </motion.p>

              <motion.button
                onClick={handleContinue}
                className="btn-romantic min-h-[48px] px-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {puzzleNumber === totalPuzzles ? 'See Final Surprise ❤️' : 'Continue ❤️'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dev mode: Skip button (remove in production) */}
        {import.meta.env.DEV && !isCompleted && (
          <button
            onClick={handlePuzzleComplete}
            className="mt-4 text-xs text-romantic-300 hover:text-romantic-500 underline"
          >
            (Dev: Skip puzzle)
          </button>
        )}
      </motion.div>
    </div>
  );
}
