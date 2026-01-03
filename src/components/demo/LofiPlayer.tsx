import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Music, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const changeTrack = (index: number) => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(LOFI_TRACKS[index].url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;
    setCurrentTrackIndex(index);
    
    if (wasPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.log);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 rounded-full px-3 transition-all ${
            isPlaying 
              ? "bg-primary/10 text-primary hover:bg-primary/20" 
              : "hover:bg-secondary"
          }`}
        >
          <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
          <span className="text-xs hidden sm:inline">Lo-fi</span>
          {/* Show Volume2 when playing (click to see controls), VolumeX when paused */}
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Lo-fi Music</span>
            <Button
              size="sm"
              variant={isPlaying ? "default" : "outline"}
              onClick={togglePlay}
              disabled={isLoading}
              className="h-7 px-3 text-xs"
            >
              {isLoading ? "..." : isPlaying ? "Pause" : "Play"}
            </Button>
          </div>

          {/* Track selector */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Station</span>
            <div className="space-y-1">
              {LOFI_TRACKS.map((track, index) => (
                <button
                  key={track.name}
                  onClick={() => changeTrack(index)}
                  className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                    currentTrackIndex === index
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Volume</span>
              <span className="text-xs text-muted-foreground">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(val) => setVolume(val[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LofiPlayer;
