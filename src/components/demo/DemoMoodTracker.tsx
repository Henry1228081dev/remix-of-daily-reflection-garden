import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const moods = [
  { id: "great", emoji: "😊", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "low", emoji: "😔", label: "Low" },
  { id: "sad", emoji: "😢", label: "Sad" },
];

interface DemoMoodTrackerProps {
  onMoodSelect: (mood: string | null) => void;
}

const DemoMoodTracker = ({ onMoodSelect }: DemoMoodTrackerProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (moodId: string) => {
    setSelected(moodId);
    onMoodSelect(moodId);
  };

  return (
    <Card>
      <CardContent className="py-6">
        <h3 className="text-center font-medium mb-4">How are you feeling today?</h3>
        <div className="flex justify-center gap-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                selected === mood.id 
                  ? "bg-primary/20 ring-2 ring-primary" 
                  : "hover:bg-secondary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoMoodTracker;
