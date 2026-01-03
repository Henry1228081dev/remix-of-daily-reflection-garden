import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Lo-fi streams/tracks
const LOFI_TRACKS = [
  { name: "Chill Beats", url: "https://streams.ilovemusic.de/iloveradio17.mp3" },
  { name: "Study Vibes", url: "https://streams.ilovemusic.de/iloveradio21.mp3" },
  { name: "Relaxing", url: "https://streams.ilovemusic.de/iloveradio16.mp3" },
];

const LofiPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(30);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(LOFI_TRACKS[currentTrackIndex].url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;

    audioRef.current.addEventListener("canplay", () => setIsLoading(false));
    audioRef.current.addEventListener("waiting", () => setIsLoading(true));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Audio play failed:", error);
      }
      setIsLoading(false);
    }
  };

  const changeTrack = (direction: "prev" | "next") => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const newIndex = direction === "next" 
      ? (currentTrackIndex + 1) % LOFI_TRACKS.length
      : (currentTrackIndex - 1 + LOFI_TRACKS.length) % LOFI_TRACKS.length;
    
    audioRef.current = new Audio(LOFI_TRACKS[newIndex].url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;
    setCurrentTrackIndex(newIndex);
    
    if (wasPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.log);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative">
      {/* Mini Record Player Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/80 to-amber-950 border-2 border-amber-700/50 shadow-lg flex items-center justify-center overflow-hidden"
      >
        {/* Wood texture base */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/20 to-transparent" />
        
        {/* Vinyl Record */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          className="relative w-8 h-8 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 flex items-center justify-center"
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-1 rounded-full border border-zinc-700/30" />
          <div className="absolute inset-2 rounded-full border border-zinc-700/20" />
          
          {/* Center label */}
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-sage-dark" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </motion.div>

        {/* Playing indicator */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background"
          />
        )}
      </motion.button>

      {/* Expanded Player Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-14 right-0 w-64 rounded-2xl bg-gradient-to-br from-amber-900/95 to-amber-950/95 backdrop-blur-xl border-2 border-amber-700/50 shadow-2xl p-4 z-50"
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 text-amber-200/50 hover:text-amber-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Record Player Visual */}
            <div className="flex flex-col items-center mb-4">
              {/* Turntable */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-800 border-4 border-amber-800/50 shadow-inner flex items-center justify-center">
                {/* Vinyl */}
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                  className="relative w-24 h-24 rounded-full bg-gradient-to-br from-zinc-950 to-zinc-900"
                >
                  {/* Grooves */}
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full border border-zinc-700/20"
                      style={{
                        inset: `${8 + i * 6}px`,
                      }}
                    />
                  ))}
                  
                  {/* Center Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-sage to-sage-dark flex items-center justify-center">
                      <span className="text-[8px] font-bold text-primary-foreground">LOFI</span>
                    </div>
                  </div>

                  {/* Shine */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                </motion.div>

                {/* Tonearm */}
                <motion.div
                  animate={{ rotate: isPlaying ? 25 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-2 right-0 origin-top-right"
                  style={{ transformOrigin: "top right" }}
                >
                  <div className="w-1 h-16 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-zinc-500 rounded-sm" />
                </motion.div>
              </div>

              {/* Track Name */}
              <p className="mt-3 text-amber-100 font-medium text-sm">
                {LOFI_TRACKS[currentTrackIndex].name}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => changeTrack("prev")}
                className="w-8 h-8 rounded-full bg-amber-800/50 hover:bg-amber-800 text-amber-100 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <motion.button
                onClick={togglePlay}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-sage-dark text-primary-foreground flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                ) : isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-5 bg-primary-foreground rounded-full" />
                    <div className="w-1.5 h-5 bg-primary-foreground rounded-full" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[10px] border-l-primary-foreground border-y-[6px] border-y-transparent ml-1" />
                )}
              </motion.button>

              <button
                onClick={() => changeTrack("next")}
                className="w-8 h-8 rounded-full bg-amber-800/50 hover:bg-amber-800 text-amber-100 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 px-2">
              <VolumeX className="w-4 h-4 text-amber-300/70" />
              <Slider
                value={[volume]}
                onValueChange={(val) => setVolume(val[0])}
                max={100}
                step={5}
                className="flex-1"
              />
              <Volume2 className="w-4 h-4 text-amber-300/70" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LofiPlayer;
