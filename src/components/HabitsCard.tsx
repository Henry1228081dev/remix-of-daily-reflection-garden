import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, Plus, X } from "lucide-react";

const STORAGE_KEY = "reflect-habits";

interface Habit {
  id: string;
  text: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: "1", text: "Drink one glass of water", completed: false },
  { id: "2", text: "Go outside for 5 minutes", completed: false },
  { id: "3", text: "Write one sentence", completed: false },
  { id: "4", text: "Stretch", completed: false },
  { id: "5", text: "Say something kind to yourself", completed: false },
];

const HabitsCard = () => {
  const today = new Date().toDateString();
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset completion status if it's a new day
      if (parsed.date !== today) {
        return (parsed.habits as Habit[]).map(h => ({ ...h, completed: false }));
      }
      return parsed.habits;
    }
    return defaultHabits;
  });
  
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: today,
      habits
    }));
  }, [habits, today]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now().toString(),
        text: newHabit.trim(),
        completed: false
      }]);
      setNewHabit("");
    }
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Tiny habits I'm building
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Little habits that help you feel grounded. No pressure — just gentle progress.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                ${habit.completed 
                  ? "bg-primary/10 text-sage-dark" 
                  : "bg-secondary/50 hover:bg-secondary"
                }
              `}
            >
              <Checkbox
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
                className="border-sage-light data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className={`flex-1 text-sm ${habit.completed ? "line-through opacity-60" : ""}`}>
                {habit.text}
              </span>
              <button
                onClick={() => removeHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a tiny habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            className="bg-secondary/50 border-sage-light/30 focus:border-primary"
          />
          <Button 
            variant="gentle" 
            size="icon"
            onClick={addHabit}
            disabled={!newHabit.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-sage-light/20">
          <p className="text-sm text-muted-foreground italic">
            Small steps add up. 🌱
          </p>
          <span className="text-sm text-sage-dark font-medium">
            {completedCount}/{habits.length} today
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitsCard;
