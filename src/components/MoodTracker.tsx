import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMoodEntries";

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
}

const moods: MoodOption[] = [
  { emoji: "😀", label: "Great", value: "great" },
  { emoji: "🙂", label: "Good", value: "good" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😟", label: "Low", value: "low" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😵‍💫", label: "Overwhelmed", value: "overwhelmed" },
  { emoji: "💫", label: "Hopeful", value: "hopeful" },
];

interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
}

const MoodTracker = ({ onMoodSelect }: MoodTrackerProps) => {
  const { getTodayMood, upsertMood, isLoading } = useMoodEntries();
  const todayMood = getTodayMood();
  const [selectedMood, setSelectedMood] = useState<string | null>(todayMood);

  useEffect(() => {
    if (todayMood) {
      setSelectedMood(todayMood);
    }
  }, [todayMood]);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
    upsertMood.mutate(mood);
  };

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          How I'm feeling today
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              disabled={isLoading || upsertMood.isPending}
              className={`
                flex flex-col items-center p-3 rounded-xl transition-all duration-200
                hover:scale-110 hover:bg-sage-light/50
                ${selectedMood === mood.value 
                  ? "bg-primary/20 ring-2 ring-primary scale-110" 
                  : "bg-secondary/50"
                }
                disabled:opacity-50
              `}
              title={mood.label}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground mt-1">{mood.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic text-center">
          Your mood isn't good or bad. It just is. 💚
        </p>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
