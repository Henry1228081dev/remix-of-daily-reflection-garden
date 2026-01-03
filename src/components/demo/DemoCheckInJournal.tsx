import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DemoCheckInJournalProps {
  selectedMood: string | null;
  onCookieEarned: (description: string) => void;
}

const prompts = [
  "What's one thing you're grateful for today?",
  "What made you smile recently?",
  "What's something you're looking forward to?",
  "What's a small win you had today?",
  "What would make today great?",
];

const DemoCheckInJournal = ({ selectedMood, onCookieEarned }: DemoCheckInJournalProps) => {
  const [entry, setEntry] = useState("");
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (entry.trim()) {
      setSaved(true);
      onCookieEarned(`Journal entry (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
      toast({
        title: "Reflection saved! 🌟",
        description: "You earned a cookie for journaling today!",
      });
    }
  };

  if (saved) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Beautiful reflection!</h3>
          <p className="text-muted-foreground mb-4">
            You've completed your check-in for today.
          </p>
          <Button variant="outline" onClick={() => { setSaved(false); setEntry(""); }}>
            Write another entry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PenLine className="w-5 h-5 text-primary" />
          Today's Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-sm font-medium text-primary mb-1">Today's prompt:</p>
          <p className="text-foreground">{currentPrompt}</p>
        </div>

        {selectedMood && (
          <p className="text-sm text-muted-foreground">
            Feeling <span className="capitalize font-medium">{selectedMood}</span> today
          </p>
        )}

        <Textarea
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {entry.length} characters
          </span>
          <Button onClick={handleSave} disabled={!entry.trim()}>
            <Sparkles className="w-4 h-4 mr-2" />
            Save & Earn Cookie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoCheckInJournal;
