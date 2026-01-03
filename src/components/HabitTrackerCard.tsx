import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, Plus, X, Flame, TrendingUp, Calendar } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  cookieAwardedDates: string[]; // Track which dates already earned a cookie
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
      const parsed = JSON.parse(saved);
      // Migrate old habits without cookieAwardedDates
      return parsed.map((h: Habit) => ({
        ...h,
        cookieAwardedDates: h.cookieAwardedDates || [],
      }));
    }
    return [
      { id: "1", name: "Drink water", completedDates: [], cookieAwardedDates: [] },
      { id: "2", name: "Meditation", completedDates: [], cookieAwardedDates: [] },
    ];
  });
  
  const [newHabit, setNewHabit] = useState("");
  const [showStats, setShowStats] = useState(false);

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

  const getLongestStreak = (habit: Habit): number => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = [...habit.completedDates]
      .map(d => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currDate = sortedDates[i];
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  };

  const getCompletionRate = (habit: Habit, days: number): number => {
    const now = new Date();
    let completedCount = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      if (habit.completedDates.includes(dateStr)) {
        completedCount++;
      }
    }
    
    return Math.round((completedCount / days) * 100);
  };

  const isCompletedToday = (habit: Habit): boolean => {
    return habit.completedDates.includes(today);
  };

  const hasEarnedCookieToday = (habit: Habit): boolean => {
    return habit.cookieAwardedDates.includes(today);
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
        const alreadyEarnedCookie = hasEarnedCookieToday(habit);
        
        if (!completed) {
          // Only award cookie if not already earned today
          if (!alreadyEarnedCookie) {
            awardCookie(habit.name);
          }
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            cookieAwardedDates: alreadyEarnedCookie 
              ? habit.cookieAwardedDates 
              : [...habit.cookieAwardedDates, today],
          };
        } else {
          return {
            ...habit,
            completedDates: habit.completedDates.filter(d => d !== today),
            // Keep cookieAwardedDates - once earned, can't be re-earned
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
        cookieAwardedDates: [],
      }]);
      setNewHabit("");
    }
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const completedToday = habits.filter(h => isCompletedToday(h)).length;

  // Calculate overall stats
  const overallStats = {
    weeklyRate: habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h, 7), 0) / habits.length)
      : 0,
    monthlyRate: habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h, 30), 0) / habits.length)
      : 0,
    bestStreak: Math.max(...habits.map(h => getLongestStreak(h)), 0),
  };

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Daily habits
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Stats
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats Panel */}
        {showStats && (
          <div className="bg-secondary/50 rounded-lg p-3 space-y-2 animate-fade-in">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{overallStats.weeklyRate}%</p>
                <p className="text-xs text-muted-foreground">7-day rate</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">{overallStats.monthlyRate}%</p>
                <p className="text-xs text-muted-foreground">30-day rate</p>
              </div>
              <div>
                <p className="text-lg font-bold text-terracotta flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4" />
                  {overallStats.bestStreak}
                </p>
                <p className="text-xs text-muted-foreground">Best streak</p>
              </div>
            </div>
            
            {habits.length > 0 && (
              <div className="pt-2 border-t border-border/50 space-y-1">
                {habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate flex-1">{habit.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{getCompletionRate(habit, 7)}% / 7d</span>
                      <div className="flex items-center gap-0.5 text-terracotta">
                        <Flame className="w-3 h-3" />
                        <span>{getLongestStreak(habit)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
