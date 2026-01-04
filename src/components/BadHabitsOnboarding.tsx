import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Loader2, Check, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Suggestion {
  name: string;
  reason: string;
}

interface BadHabitEntry {
  habitName: string;
  suggestions: Suggestion[];
  selectedReplacement: string | null;
  isLoading: boolean;
}

interface BadHabitsOnboardingProps {
  onComplete: (habits: Array<{ habitName: string; replacement: string }>) => void;
  onSkip: () => void;
}

const BadHabitsOnboarding = ({ onComplete, onSkip }: BadHabitsOnboardingProps) => {
  const [habits, setHabits] = useState<BadHabitEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [step, setStep] = useState<"input" | "select">("input");

  const addHabit = async () => {
    if (!currentInput.trim()) return;

    const newHabit: BadHabitEntry = {
      habitName: currentInput.trim(),
      suggestions: [],
      selectedReplacement: null,
      isLoading: true,
    };

    setHabits((prev) => [...prev, newHabit]);
    setCurrentInput("");

    try {
      const { data, error } = await supabase.functions.invoke("suggest-replacements", {
        body: { badHabit: newHabit.habitName },
      });

      if (error) throw error;

      setHabits((prev) =>
        prev.map((h) =>
          h.habitName === newHabit.habitName
            ? { ...h, suggestions: data.suggestions || [], isLoading: false }
            : h
        )
      );
    } catch (error) {
      console.error("Error getting suggestions:", error);
      setHabits((prev) =>
        prev.map((h) =>
          h.habitName === newHabit.habitName
            ? {
                ...h,
                suggestions: [
                  { name: "Take a short walk", reason: "Physical activity helps break urge cycles" },
                  { name: "Practice deep breathing", reason: "Calms the nervous system" },
                  { name: "Drink water", reason: "Simple action that satisfies the need to do something" },
                  { name: "Call a friend", reason: "Social support helps overcome cravings" },
                  { name: "Do a quick stretch", reason: "Releases tension and redirects focus" },
                ],
                isLoading: false,
              }
            : h
        )
      );
    }
  };

  const selectReplacement = (habitName: string, replacement: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.habitName === habitName ? { ...h, selectedReplacement: replacement } : h
      )
    );
  };

  const removeHabit = (habitName: string) => {
    setHabits((prev) => prev.filter((h) => h.habitName !== habitName));
  };

  const handleComplete = () => {
    const selectedHabits = habits
      .filter((h) => h.selectedReplacement)
      .map((h) => ({ habitName: h.habitName, replacement: h.selectedReplacement! }));

    if (selectedHabits.length === 0) {
      toast({
        title: "Select at least one replacement",
        description: "Pick a healthier alternative for at least one habit.",
        variant: "destructive",
      });
      return;
    }

    onComplete(selectedHabits);
  };

  const allHabitsHaveSelections = habits.length > 0 && habits.every((h) => h.selectedReplacement);
  const anyLoading = habits.some((h) => h.isLoading);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          What bad habits do you want to break?
        </h2>
        <p className="text-muted-foreground mt-2">
          We'll suggest healthier alternatives powered by AI
        </p>
      </div>

      {/* Input section */}
      <div className="flex gap-2">
        <Input
          placeholder="e.g., Smoking, Stress eating, Nail biting..."
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          className="flex-1"
        />
        <Button onClick={addHabit} disabled={!currentInput.trim()}>
          Add
        </Button>
      </div>

      {/* Habits list with suggestions */}
      <AnimatePresence mode="popLayout">
        {habits.map((habit) => (
          <motion.div
            key={habit.habitName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-secondary/50 rounded-xl p-4 border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{habit.habitName}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeHabit(habit.habitName)}
                className="text-muted-foreground hover:text-destructive"
              >
                ✕
              </Button>
            </div>

            {habit.isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Getting AI suggestions...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Pick a healthier replacement:
                </p>
                <div className="grid gap-2">
                  {habit.suggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectReplacement(habit.habitName, suggestion.name)}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        habit.selectedReplacement === suggestion.name
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-background hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {habit.selectedReplacement === suggestion.name && (
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="font-medium">{suggestion.name}</span>
                          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onSkip} className="flex-1">
          Skip for now
        </Button>
        <Button
          onClick={handleComplete}
          disabled={habits.length === 0 || anyLoading || !habits.some((h) => h.selectedReplacement)}
          className="flex-1"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default BadHabitsOnboarding;
