import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

const STORAGE_KEY = "reflect-daily-reflection";

interface ReflectionPromptsProps {
  isVisible: boolean;
  onClose?: () => void;
}

const ReflectionPrompts = ({ isVisible, onClose }: ReflectionPromptsProps) => {
  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only restore if it's from today
      if (parsed.date === new Date().toDateString()) {
        return parsed.responses;
      }
    }
    return { wentWell: "", didntGoWell: "", differently: "" };
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: new Date().toDateString(),
      responses
    }));
  }, [responses]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose?.();
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card shadow-card border-0 animate-fade-in-up">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Daily Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            What went well today? 🌟
          </label>
          <Textarea
            placeholder="Today I managed to..."
            value={responses.wentWell}
            onChange={(e) => setResponses({ ...responses, wentWell: e.target.value })}
            className="min-h-[80px] bg-secondary/50 border-sage-light/30 focus:border-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            What didn't go so well? 🌧️
          </label>
          <Textarea
            placeholder="I found it challenging when..."
            value={responses.didntGoWell}
            onChange={(e) => setResponses({ ...responses, didntGoWell: e.target.value })}
            className="min-h-[80px] bg-secondary/50 border-sage-light/30 focus:border-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            What will you do differently tomorrow? 🌱
          </label>
          <Textarea
            placeholder="Tomorrow I'll try to..."
            value={responses.differently}
            onChange={(e) => setResponses({ ...responses, differently: e.target.value })}
            className="min-h-[80px] bg-secondary/50 border-sage-light/30 focus:border-primary resize-none"
          />
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground italic mb-4">
            Done is better than perfect.
          </p>
          <Button 
            variant="wellness" 
            onClick={handleSave}
            className="min-w-[140px]"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              "Save Reflection"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionPrompts;
