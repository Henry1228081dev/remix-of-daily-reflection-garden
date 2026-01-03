import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface PerfectDayCelebrationProps {
  isActive: boolean;
  onComplete?: () => void;
}

const PerfectDayCelebration = ({ isActive, onComplete }: PerfectDayCelebrationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
      
      // Epic confetti burst
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 60 * (timeLeft / duration);
        
        // Rainbow colors for perfect day
        const colors = ["#fbbf24", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#06b6d4"];
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors,
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors,
        });
      }, 200);

      // Auto-hide after 4 seconds
      const hideTimer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(hideTimer);
      };
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/30 via-sticky-yellow/30 to-primary/30"
          />

          {/* Central celebration */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-r from-sticky-yellow via-primary to-sticky-yellow blur-2xl"
            />

            {/* Trophy container */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-gradient-to-br from-sticky-yellow via-accent to-terracotta p-8 rounded-full shadow-2xl"
            >
              <Trophy className="w-20 h-20 text-white drop-shadow-lg" />
              
              {/* Orbiting stars */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.75 }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center center" }}
                >
                  <Star
                    className="absolute w-6 h-6 text-sticky-yellow fill-sticky-yellow"
                    style={{
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Floating sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: Math.cos((i / 8) * Math.PI * 2) * 80,
                  y: Math.sin((i / 8) * Math.PI * 2) * 80,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="absolute left-1/2 top-1/2"
              >
                <Sparkles className="w-5 h-5 text-sticky-yellow" />
              </motion.div>
            ))}
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-1/3 text-center"
          >
            <motion.h2
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl font-bold text-white drop-shadow-lg mb-2"
            >
              🎉 PERFECT DAY! 🎉
            </motion.h2>
            <p className="text-xl text-white/90 drop-shadow">
              You completed all habits and steps!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerfectDayCelebration;
