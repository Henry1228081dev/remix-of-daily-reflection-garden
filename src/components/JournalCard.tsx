import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Check } from "lucide-react";

const STORAGE_KEY = "reflect-journal-entries";

interface JournalEntry {
  date: string;
  entry: string;
  prompt?: string;
}

const prompts = [
  "What's one thing you're grateful for today?",
  "Describe a small moment that made you smile.",
  "What's something you're looking forward to?",
  "What would you tell your past self from a year ago?",
  "What's one thing you did today that was just for you?",
  "How did you show kindness today (to yourself or others)?",
  "What's a challenge you're facing, and what's one tiny step forward?",
  "What's something that felt hard today, and how did you cope?",
];

const JournalCard = () => {
  const today = new Date().toDateString();
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const todayEntry = entries.find(e => e.date === today);
  const [entry, setEntry] = useState(todayEntry?.entry || "");
  const [currentPrompt, setCurrentPrompt] = useState(todayEntry?.prompt || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const getPrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const saveEntry = () => {
    if (entry.trim()) {
      const newEntry: JournalEntry = {
        date: today,
        entry: entry.trim(),
        prompt: currentPrompt || undefined,
      };
      
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== today);
        return [...filtered, newEntry];
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Today's journal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentPrompt && (
          <div className="bg-sage-light/50 rounded-lg p-3 text-sm text-sage-dark italic animate-fade-in">
            💭 {currentPrompt}
          </div>
        )}

        <Textarea
          placeholder="Write one sentence about how today felt..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-[100px] bg-secondary/50 border-sage-light/30 focus:border-primary resize-none"
        />

        <p className="text-xs text-muted-foreground italic">
          No pressure. One sentence is enough. 📝
        </p>

        <div className="flex gap-2 justify-end">
          <Button 
            variant="gentle" 
            size="sm"
            onClick={getPrompt}
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Get a prompt
          </Button>
          <Button 
            variant="wellness" 
            size="sm"
            onClick={saveEntry}
            disabled={!entry.trim()}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              "Save entry"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalCard;
