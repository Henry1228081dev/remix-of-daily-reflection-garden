import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, Plus, X, Flame, TrendingUp } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useCookies } from "@/hooks/useCookies";

interface HabitTrackerCardProps {
  onCookieEarned?: (count: number) => void;
}

const HabitTrackerCard = ({ onCookieEarned }: HabitTrackerCardProps) => {
  const today = new Date().toISOString().split("T")[0];
  
  const { 
    habits, 
    completions, 
    isLoading, 
    addHabit, 
    deleteHabit, 
    toggleCompletion, 
    isCompletedOnDate,
    getStreak 
  } = useHabits();
  
  const { addCookie, totalCount } = useCookies();
  
  const [newHabit, setNewHabit] = useState("");
  const [showStats, setShowStats] = useState(false);

  const isCompletedToday = (habitId: string) => isCompletedOnDate(habitId, today);

  const getCompletionRate = (habitId: string, days: number): number => {
    const now = new Date();
    let completedCount = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (isCompletedOnDate(habitId, dateStr)) {
        completedCount++;
      }
    }
    
    return Math.round((completedCount / days) * 100);
  };

  const getLongestStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter((c) => c.habit_id === habitId)
      .map((c) => c.completed_date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    if (habitCompletions.length === 0) return 0;
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < habitCompletions.length; i++) {
      const prevDate = new Date(habitCompletions[i - 1]);
      const currDate = new Date(habitCompletions[i]);
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

  const handleToggleHabit = async (habitId: string, habitName: string) => {
    const completed = isCompletedToday(habitId);
    
    if (!completed) {
      // Award cookie when completing
      addCookie.mutate({ 
        description: `${habitName} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`, 
        source: "habit" 
      });
      onCookieEarned?.(totalCount + 1);
    }
    
    toggleCompletion.mutate({
      habitId,
      date: today,
      completed: !completed,
      awardCookie: !completed,
    });
  };

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit.mutate(newHabit.trim());
      setNewHabit("");
    }
  };

  const completedToday = habits.filter(h => isCompletedToday(h.id)).length;

  const overallStats = {
    weeklyRate: habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h.id, 7), 0) / habits.length)
      : 0,
    monthlyRate: habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h.id, 30), 0) / habits.length)
      : 0,
    bestStreak: Math.max(...habits.map(h => getLongestStreak(h.id)), 0),
  };

  if (isLoading) {
    return (
      <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-2">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading habits...
        </CardContent>
      </Card>
    );
  }

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
        {showStats && habits.length > 0 && (
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
            
            <div className="pt-2 border-t border-border/50 space-y-1">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate flex-1">{habit.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{getCompletionRate(habit.id, 7)}% / 7d</span>
                    <div className="flex items-center gap-0.5 text-terracotta">
                      <Flame className="w-3 h-3" />
                      <span>{getLongestStreak(habit.id)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {habits.map((habit) => {
          const streak = getStreak(habit.id);
          const completed = isCompletedToday(habit.id);
          
          return (
            <div 
              key={habit.id} 
              className="flex items-center gap-3 group"
            >
              <Checkbox 
                id={habit.id}
                checked={completed}
                onCheckedChange={() => handleToggleHabit(habit.id, habit.name)}
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
                onClick={() => deleteHabit.mutate(habit.id)}
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
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
            className="bg-secondary/50 border-sage-light/30 text-sm"
          />
          <Button 
            variant="gentle" 
            size="icon"
            onClick={handleAddHabit}
            disabled={!newHabit.trim() || addHabit.isPending}
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
