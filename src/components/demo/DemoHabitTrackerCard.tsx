import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, Trash2 } from "lucide-react";

interface DemoHabitTrackerCardProps {
  onCookieEarned: (description: string) => void;
  onHabitToggle?: (habitId: string, completed: boolean) => void;
  onHabitsChange?: (count: number) => void;
}

const DemoHabitTrackerCard = ({ onCookieEarned, onHabitToggle, onHabitsChange }: DemoHabitTrackerCardProps) => {
  const [habits, setHabits] = useState([
    { id: "1", name: "Morning meditation", completed: true },
    { id: "2", name: "Read for 15 mins", completed: false },
    { id: "3", name: "Exercise", completed: false },
  ]);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabits = [...habits, { id: Date.now().toString(), name: newHabit.trim(), completed: false }];
      setHabits(newHabits);
      setNewHabit("");
      onHabitsChange?.(newHabits.length);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        if (newCompleted && !habit.completed) {
          onCookieEarned(`Habit: ${habit.name}`);
        }
        onHabitToggle?.(id, newCompleted);
        return { ...habit, completed: newCompleted };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-primary" />
            Daily Habits
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{habits.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add a habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            className="flex-1"
          />
          <Button size="icon" onClick={addHabit} disabled={!newHabit.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 group">
              <Checkbox 
                checked={habit.completed} 
                onCheckedChange={() => toggleHabit(habit.id)}
              />
              <span className={`flex-1 text-sm ${habit.completed ? "line-through text-muted-foreground" : ""}`}>
                {habit.name}
              </span>
              <button 
                onClick={() => deleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="pt-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${habits.length ? (completedCount / habits.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoHabitTrackerCard;
