import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Check, Cookie, Sparkles } from "lucide-react";
import { useSentenceTracker } from "@/hooks/useSentenceTracker";
import KindNoteNotification from "./KindNoteNotification";

const STORAGE_KEY = "reflect-journal-entries";
const COOKIE_STORAGE_KEY = "reflect-cookie-jar";

interface JournalEntry {
  date: string;
  timestamp?: string;
  entry: string;
  prompt?: string;
  mood?: string;
  cookiesEarned?: number;
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

interface EnhancedCheckInJournalProps {
  selectedMood?: string | null;
  onSave?: () => void;
  onCookieUpdate?: (count: number) => void;
}

const EnhancedCheckInJournal = ({ selectedMood, onSave, onCookieUpdate }: EnhancedCheckInJournalProps) => {
  const today = new Date().toDateString();
  
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const todayEntry = entries.find(e => e.date === today);
  const [entry, setEntry] = useState(todayEntry?.entry || "");
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    // Auto-set a random prompt on load
    return todayEntry?.prompt || prompts[Math.floor(Math.random() * prompts.length)];
  });
  const [saved, setSaved] = useState(false);
  const [sessionCookies, setSessionCookies] = useState(0);
  const [kindNote, setKindNote] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCookieEarned = useCallback((count: number) => {
    setSessionCookies(prev => prev + count);
    
    // Add cookies to the cookie jar
    const savedCookies = localStorage.getItem(COOKIE_STORAGE_KEY);
    const cookies: string[] = savedCookies ? JSON.parse(savedCookies) : [];
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date().toLocaleTimeString();
      cookies.push(`Journal reflection (${timestamp})`);
    }
    
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(cookies));
    onCookieUpdate?.(cookies.length);
  }, [onCookieUpdate]);

  const handleKindNote = useCallback((note: string) => {
    setKindNote(note);
    setShowNotification(true);
  }, []);

  const { trackText, sentenceCount } = useSentenceTracker({
    onCookieEarned: handleCookieEarned,
    onKindNote: handleKindNote,
    mood: selectedMood,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEntry(newText);
    trackText(newText);
  };

  const saveEntry = () => {
    if (entry.trim()) {
      const now = new Date();
      const newEntry: JournalEntry = {
        date: today,
        timestamp: now.toISOString(),
        entry: entry.trim(),
        prompt: currentPrompt || undefined,
        mood: selectedMood || undefined,
        cookiesEarned: sessionCookies,
      };
      
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== today);
        return [...filtered, newEntry];
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSave?.();
    }
  };

  const getEncouragementText = () => {
    if (sentenceCount === 0) {
      return "Start with just one sentence. You've got this! ✨";
    }
    if (sentenceCount === 1) {
      return "Beautiful start! Try adding another thought 🌱";
    }
    if (sentenceCount === 2) {
      return "You're on a roll! One more? 💚";
    }
    if (sentenceCount === 3) {
      return "Three sentences! You're really opening up 🌟";
    }
    return `Amazing! ${sentenceCount} thoughtful reflections 🎉`;
  };

  return (
    <>
      <Card className="bg-card shadow-card border-0 animate-fade-in-up">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Today's journal
            </CardTitle>
            
            {sessionCookies > 0 && (
              <div className="flex items-center gap-1.5 bg-accent/50 px-3 py-1 rounded-full animate-fade-in">
                <Cookie className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-semibold text-accent-foreground">
                  +{sessionCookies}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Auto-shown prompt */}
          <div className="bg-sage-light/30 rounded-lg p-3 text-sm text-sage-dark border border-sage-light/50">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="italic">{currentPrompt}</span>
            </div>
          </div>

          <Textarea
            ref={textareaRef}
            placeholder="Write one sentence about how today felt..."
            value={entry}
            onChange={handleTextChange}
            className="min-h-[120px] bg-secondary/50 border-sage-light/30 focus:border-primary resize-none text-base leading-relaxed"
          />

          {/* Dynamic encouragement */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground italic flex items-center gap-1">
              {getEncouragementText()}
            </p>
            
            {sentenceCount > 0 && (
              <span className="text-xs text-primary font-medium">
                {sentenceCount} sentence{sentenceCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex gap-2 justify-end">
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

      <KindNoteNotification
        note={kindNote || ""}
        isVisible={showNotification}
        onDismiss={() => setShowNotification(false)}
      />
    </>
  );
};

export default EnhancedCheckInJournal;
