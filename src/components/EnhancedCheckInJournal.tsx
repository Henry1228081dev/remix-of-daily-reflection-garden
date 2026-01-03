import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Check, Cookie, Sparkles } from "lucide-react";
import KindNoteNotification from "./KindNoteNotification";
import { supabase } from "@/integrations/supabase/client";

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

// Count valid sentences - must have real words, proper length, and meaningful content
const countValidSentences = (text: string): number => {
  if (!text.trim()) return 0;
  
  // Split by sentence-ending punctuation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  // Count sentences with meaningful content
  return sentences.filter(sentence => {
    const trimmed = sentence.trim();
    
    // Filter out repeated characters (like "aaaa" or "....")
    if (/^(.)\1{3,}$/.test(trimmed)) return false;
    
    // Filter out gibberish (mostly consonants with no vowels)
    const hasVowels = /[aeiouAEIOU]/.test(trimmed);
    if (!hasVowels && trimmed.length > 2) return false;
    
    // Must have at least 4 distinct words (not repeated)
    const words = trimmed.split(/\s+/).filter(w => w.length > 1 && /[a-zA-Z]/.test(w));
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    // Need at least 4 unique words and at least 5 total words
    return uniqueWords.size >= 4 && words.length >= 5;
  }).length;
};

const EnhancedCheckInJournal = ({ selectedMood, onSave, onCookieUpdate }: EnhancedCheckInJournalProps) => {
  const today = new Date().toDateString();
  
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const todayEntry = entries.find(e => e.date === today);
  const [entry, setEntry] = useState(todayEntry?.entry || "");
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    return todayEntry?.prompt || prompts[Math.floor(Math.random() * prompts.length)];
  });
  const [saved, setSaved] = useState(false);
  const [kindNote, setKindNote] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Track sentence counts: baseline is what was already saved, current is live count
  const baselineSentenceCount = useRef(todayEntry?.cookiesEarned ?? countValidSentences(todayEntry?.entry || ""));
  const [currentSentenceCount, setCurrentSentenceCount] = useState(() => 
    countValidSentences(todayEntry?.entry || "")
  );
  const [sessionCookiesEarned, setSessionCookiesEarned] = useState(0);
  const isGeneratingNote = useRef(false);

  const addCookiesToJar = useCallback((count: number) => {
    if (count <= 0) return;
    
    const savedCookies = localStorage.getItem(COOKIE_STORAGE_KEY);
    const cookies: string[] = savedCookies ? JSON.parse(savedCookies) : [];
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date().toLocaleTimeString();
      cookies.push(`Journal reflection (${timestamp})`);
    }
    
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(cookies));
    onCookieUpdate?.(cookies.length);
  }, [onCookieUpdate]);

  const generateKindNote = useCallback(async (text: string, sentenceCount: number) => {
    if (isGeneratingNote.current || sentenceCount === 0) return;
    
    isGeneratingNote.current = true;

    try {
      const { data, error } = await supabase.functions.invoke('generate-kind-note', {
        body: { journalText: text, sentenceCount, mood: selectedMood }
      });

      if (error) {
        console.error('Error generating kind note:', error);
        const fallbackNotes = [
          `${sentenceCount} sentences! You're building something beautiful 🌱`,
          `Look at you go! ${sentenceCount} thoughtful sentences 💚`,
          `Every word counts. You've written ${sentenceCount} full thoughts! ✨`,
          `${sentenceCount} sentences of pure reflection. Keep flowing 🌊`,
        ];
        setKindNote(fallbackNotes[sentenceCount % fallbackNotes.length]);
        setShowNotification(true);
      } else if (data?.note) {
        setKindNote(data.note);
        setShowNotification(true);
      }
    } catch (err) {
      console.error('Failed to generate kind note:', err);
    } finally {
      isGeneratingNote.current = false;
    }
  }, [selectedMood]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEntry(newText);
    
    const newCount = countValidSentences(newText);
    setCurrentSentenceCount(newCount);
    
    // Only award cookies for NEW sentences beyond what was already saved
    const newCookies = newCount - baselineSentenceCount.current;
    
    if (newCookies > sessionCookiesEarned) {
      const cookiesToAdd = newCookies - sessionCookiesEarned;
      setSessionCookiesEarned(newCookies);
      addCookiesToJar(cookiesToAdd);
      generateKindNote(newText, newCount);
    }
  };

  const saveEntry = () => {
    if (entry.trim()) {
      const now = new Date();
      const totalCookies = (todayEntry?.cookiesEarned ?? 0) + sessionCookiesEarned;
      
      const newEntry: JournalEntry = {
        date: today,
        timestamp: now.toISOString(),
        entry: entry.trim(),
        prompt: currentPrompt || undefined,
        mood: selectedMood || undefined,
        cookiesEarned: totalCookies,
      };
      
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== today);
        return [...filtered, newEntry];
      });
      
      // Update baseline after save so further edits don't double-count
      baselineSentenceCount.current = countValidSentences(entry.trim());
      setSessionCookiesEarned(0);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSave?.();
    }
  };

  const getEncouragementText = () => {
    if (currentSentenceCount === 0) {
      return "Start with just one sentence. You've got this! ✨";
    }
    if (currentSentenceCount === 1) {
      return "Beautiful start! Try adding another thought 🌱";
    }
    if (currentSentenceCount === 2) {
      return "You're on a roll! One more? 💚";
    }
    if (currentSentenceCount === 3) {
      return "Three sentences! You're really opening up 🌟";
    }
    return `Amazing! ${currentSentenceCount} thoughtful reflections 🎉`;
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
            
            {sessionCookiesEarned > 0 && (
              <div className="flex items-center gap-1.5 bg-accent/50 px-3 py-1 rounded-full animate-fade-in">
                <Cookie className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-semibold text-accent-foreground">
                  +{sessionCookiesEarned}
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
            
            {currentSentenceCount > 0 && (
              <span className="text-xs text-primary font-medium">
                {currentSentenceCount} sentence{currentSentenceCount !== 1 ? 's' : ''}
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
