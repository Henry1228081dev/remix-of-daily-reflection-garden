import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CursorEffectsProps {
  equippedCursor: string | null;
}

interface Position {
  x: number;
  y: number;
}

interface Trail {
  id: number;
  x: number;
  y: number;
}

const CursorEffects = ({ equippedCursor }: CursorEffectsProps) => {
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Trail[]>([]);
  const [petPos, setPetPos] = useState<Position>({ x: 0, y: 0 });
  const trailIdRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Trail effect for star/wand cursors
  useEffect(() => {
    if (!equippedCursor || !["cursor-star", "cursor-wand", "cursor-galaxy"].includes(equippedCursor)) {
      setTrail([]);
      return;
    }

    const interval = setInterval(() => {
      trailIdRef.current += 1;
      setTrail(prev => [
        ...prev.slice(-8),
        { id: trailIdRef.current, x: mousePos.x, y: mousePos.y }
      ]);
    }, 50);

    return () => clearInterval(interval);
  }, [equippedCursor, mousePos.x, mousePos.y]);

  // Pet following effect
  useEffect(() => {
    if (!equippedCursor || !["cursor-pet-cat", "cursor-pet-dog"].includes(equippedCursor)) {
      return;
    }

    const interval = setInterval(() => {
      setPetPos(prev => ({
        x: prev.x + (mousePos.x - prev.x - 30) * 0.1,
        y: prev.y + (mousePos.y - prev.y - 30) * 0.1,
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [equippedCursor, mousePos.x, mousePos.y]);

  if (!equippedCursor) return null;

  const getTrailEmoji = () => {
    switch (equippedCursor) {
      case "cursor-star": return "⭐";
      case "cursor-wand": return "✨";
      case "cursor-galaxy": return "🌟";
      default: return "✨";
    }
  };

  const getPetEmoji = () => {
    switch (equippedCursor) {
      case "cursor-pet-cat": return "🐱";
      case "cursor-pet-dog": return "🐕";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Trail effects */}
      <AnimatePresence>
        {["cursor-star", "cursor-wand", "cursor-galaxy"].includes(equippedCursor) &&
          trail.map((t, i) => (
            <motion.span
              key={t.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.3, y: 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute text-lg"
              style={{ left: t.x - 8, top: t.y - 8 }}
            >
              {getTrailEmoji()}
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Heart pointer */}
      {equippedCursor === "cursor-heart" && (
        <motion.div
          className="absolute"
          style={{ left: mousePos.x + 10, top: mousePos.y + 10 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-xl">💖</span>
        </motion.div>
      )}

      {/* Halo effect */}
      {equippedCursor === "cursor-halo" && (
        <motion.div
          className="absolute"
          style={{ left: mousePos.x - 15, top: mousePos.y - 35 }}
          animate={{ 
            y: [0, -3, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">😇</span>
        </motion.div>
      )}

      {/* Pet followers */}
      {["cursor-pet-cat", "cursor-pet-dog"].includes(equippedCursor) && (
        <motion.div
          className="absolute"
          style={{ left: petPos.x, top: petPos.y }}
          animate={{ 
            y: [0, -2, 0],
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-3xl drop-shadow-lg">{getPetEmoji()}</span>
        </motion.div>
      )}

      {/* Galaxy effect */}
      {equippedCursor === "cursor-galaxy" && (
        <>
          <motion.div
            className="absolute w-40 h-40 rounded-full"
            style={{ 
              left: mousePos.x - 80, 
              top: mousePos.y - 80,
              background: "radial-gradient(circle, rgba(147,112,219,0.3) 0%, transparent 70%)"
            }}
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          />
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-sm"
              style={{ 
                left: mousePos.x + Math.cos(i * 72 * Math.PI / 180) * 30 - 6, 
                top: mousePos.y + Math.sin(i * 72 * Math.PI / 180) * 30 - 6 
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            >
              ✨
            </motion.span>
          ))}
        </>
      )}
    </div>
  );
};

export default CursorEffects;