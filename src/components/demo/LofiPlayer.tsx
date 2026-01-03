import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Music } from "lucide-react";

// Free lo-fi audio from a public source
const LOFI_AUDIO_URL = "https://streams.ilovemusic.de/iloveradio17.mp3";

const LofiPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(LOFI_AUDIO_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    audioRef.current.addEventListener("canplay", () => {
      setIsLoading(false);
    });

    audioRef.current.addEventListener("waiting", () => {
      setIsLoading(true);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={togglePlay}
      className={`gap-2 rounded-full px-3 transition-all ${
        isPlaying 
          ? "bg-primary/10 text-primary hover:bg-primary/20" 
          : "hover:bg-secondary"
      }`}
      disabled={isLoading}
    >
      <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
      {isLoading ? (
        <span className="text-xs">Loading...</span>
      ) : isPlaying ? (
        <>
          <span className="text-xs hidden sm:inline">Lo-fi</span>
          <VolumeX className="w-3.5 h-3.5" />
        </>
      ) : (
        <>
          <span className="text-xs hidden sm:inline">Lo-fi</span>
          <Volume2 className="w-3.5 h-3.5" />
        </>
      )}
    </Button>
  );
};

export default LofiPlayer;
