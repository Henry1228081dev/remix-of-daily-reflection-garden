import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Sparkles, AlertTriangle } from "lucide-react";
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

interface ValidationResult {
  isValid: boolean;
  reasons: string[];
}

// Validate journal entry for spam/gibberish
const validateEntry = (text: string): ValidationResult => {
  const trimmed = text.trim();
  const reasons: string[] = [];
  
  if (!trimmed) {
    return { isValid: false, reasons: ["Entry is empty"] };
  }

  // Check for repeated single characters (like "sssss" or ".......")
  if (/^(.)\1{4,}$/i.test(trimmed)) {
    reasons.push("Entry contains only repeated characters");
  }

  // Check for patterns like "S.S.S." or "a.b.c.d"
  if (/^([a-z]\.){2,}[a-z]?\.?$/i.test(trimmed.replace(/\s/g, ''))) {
    reasons.push("Entry appears to be random letters with periods");
  }

  // Check for mostly non-letter characters
  const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const totalChars = trimmed.replace(/\s/g, '').length;
  if (totalChars > 3 && letterCount / totalChars < 0.3) {
    reasons.push("Entry contains too few actual letters");
  }

  // Check for very short entries with no real words
  const words = trimmed.split(/\s+/).filter(w => w.length > 2 && /[a-zA-Z]{2,}/.test(w));
  if (trimmed.length > 5 && words.length < 2) {
    reasons.push("Entry doesn't contain meaningful words");
  }

  // Check for keyboard smashing (random consonant clusters)
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(trimmed)) {
    reasons.push("Entry appears to be keyboard smashing");
  }

  // Check for repeating patterns like "abcabc" or "123123"
  if (/^(.{1,4})\1{2,}$/i.test(trimmed.replace(/\s/g, ''))) {
    reasons.push("Entry contains repetitive patterns");
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
};

const DemoCheckInJournal = ({ selectedMood, onCookieEarned }: DemoCheckInJournalProps) => {
  const [entry, setEntry] = useState("");
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [saved, setSaved] = useState(false);
  const [savedAsInvalid, setSavedAsInvalid] = useState(false);
  const [invalidReasons, setInvalidReasons] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSave = () => {
    if (entry.trim()) {
      const validation = validateEntry(entry);
      
      if (validation.isValid) {
        setSaved(true);
        setSavedAsInvalid(false);
        onCookieEarned(`Journal entry (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
        toast({
          title: "Reflection saved! 🌟",
          description: "You earned a cookie for journaling today!",
        });
      } else {
        // Save but mark as invalid, no cookie
        setSaved(true);
        setSavedAsInvalid(true);
        setInvalidReasons(validation.reasons);
        toast({
          title: "Entry saved, but marked invalid ⚠️",
          description: "No cookie earned. Try writing something more meaningful!",
          variant: "destructive",
        });
      }
    }
  };

  if (saved) {
    return (
      <Card className={`border-2 ${savedAsInvalid ? 'border-destructive/50' : 'border-primary/20'}`}>
        <CardContent className="py-8 text-center">
          <div className={`w-16 h-16 ${savedAsInvalid ? 'bg-destructive/10' : 'bg-primary/10'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {savedAsInvalid ? (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            ) : (
              <Sparkles className="w-8 h-8 text-primary" />
            )}
          </div>
          
          {savedAsInvalid ? (
            <>
              <h3 className="text-xl font-medium mb-2 text-destructive">Invalid Entry Saved</h3>
              <div className="bg-destructive/10 rounded-lg p-4 mb-4 text-left">
                <p className="text-sm font-medium text-destructive mb-2">Reasons:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {invalidReasons.map((reason, i) => (
                    <li key={i}>• {reason}</li>
                  ))}
                </ul>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Your entry was saved but you didn't earn a cookie. Try writing a genuine reflection!
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium mb-2">Beautiful reflection!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed your check-in for today.
              </p>
            </>
          )}
          
          <Button variant="outline" onClick={() => { 
            setSaved(false); 
            setSavedAsInvalid(false);
            setInvalidReasons([]);
            setEntry(""); 
          }}>
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
