import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, Plus, X, Flame } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

interface HabitTrackerCardProps {
  onCookieEarned?: (count: number) => void;
}

const STORAGE_KEY = "reflect-habits";
const COOKIE_STORAGE_KEY = "reflect-cookie-jar";

const HabitTrackerCard = ({ onCookieEarned }: HabitTrackerCardProps) => {
  const today = new Date().toDateString();
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "1", name: "Drink water", completedDates: [] },
      { id: "2", name: "Meditation", completedDates: [] },
    ];
  });
  
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const getStreak = (habit: Habit): number => {
    const sortedDates = [...habit.completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (sortedDates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  };

  const isCompletedToday = (habit: Habit): boolean => {
    return habit.completedDates.includes(today);
  };

  const awardCookie = (habitName: string) => {
    const savedCookies = localStorage.getItem(COOKIE_STORAGE_KEY);
    const cookies: string[] = savedCookies ? JSON.parse(savedCookies) : [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    cookies.push(`${habitName} (${timestamp})`);
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(cookies));
    onCookieEarned?.(cookies.length);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completed = isCompletedToday(habit);
        if (!completed) {
          awardCookie(habit.name);
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
          };
        } else {
          return {
            ...habit,
            completedDates: habit.completedDates.filter(d => d !== today),
          };
        }
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now().toString(),
        name: newHabit.trim(),
        completedDates: [],
      }]);
      setNewHabit("");
    }
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const completedToday = habits.filter(h => isCompletedToday(h)).length;

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Daily habits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map((habit) => {
          const streak = getStreak(habit);
          const completed = isCompletedToday(habit);
          
          return (
            <div 
              key={habit.id} 
              className="flex items-center gap-3 group"
            >
              <Checkbox 
                id={habit.id}
                checked={completed}
                onCheckedChange={() => toggleHabit(habit.id)}
                className="border-primary data-[state=checked]:bg-primary"
              />
              <label 
                htmlFor={habit.id}
                className={`flex-1 text-sm cursor-pointer transition-all ${
                  completed ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}
              >
                {habit.name}
              </label>
              
              {streak > 0 && (
                <div className="flex items-center gap-1 text-xs bg-accent/50 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3 text-terracotta" />
                  <span className="font-medium text-accent-foreground">{streak}</span>
                </div>
              )}
              
              <button 
                onClick={() => removeHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Add a habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            className="bg-secondary/50 border-sage-light/30 text-sm"
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

        <p className="text-xs text-muted-foreground text-center pt-2">
          {completedToday}/{habits.length} completed today • Build your streaks! 🔥
        </p>
      </CardContent>
    </Card>
  );
};

export default HabitTrackerCard;
