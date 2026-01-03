import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Check, X, Flame, Trophy } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

interface DemoWeeklyStreakProps {
  completedHabits: Record<string, boolean>; // habitId -> completed today
  completedSteps: Record<string, boolean>; // stepId -> completed
  totalHabits: number;
  totalSteps: number;
}

// Demo data for the past week
const DEMO_WEEK_DATA = [
  { daysAgo: 6, habitsComplete: true, stepsComplete: true },
  { daysAgo: 5, habitsComplete: true, stepsComplete: false },
  { daysAgo: 4, habitsComplete: true, stepsComplete: true },
  { daysAgo: 3, habitsComplete: false, stepsComplete: true },
  { daysAgo: 2, habitsComplete: true, stepsComplete: true },
  { daysAgo: 1, habitsComplete: true, stepsComplete: true },
  { daysAgo: 0, habitsComplete: false, stepsComplete: false }, // Today - will use real data
];

const DemoWeeklyStreak = ({ 
  completedHabits, 
  completedSteps, 
  totalHabits, 
  totalSteps 
}: DemoWeeklyStreakProps) => {
  const weekData = useMemo(() => {
    const today = startOfDay(new Date());
    
    // Calculate today's completion
    const todayHabitsComplete = totalHabits > 0 && 
      Object.values(completedHabits).filter(Boolean).length === totalHabits;
    const todayStepsComplete = totalSteps > 0 && 
      Object.values(completedSteps).filter(Boolean).length === totalSteps;
    const todayAllComplete = todayHabitsComplete && todayStepsComplete;

    return DEMO_WEEK_DATA.map((day, index) => {
      const date = subDays(today, day.daysAgo);
      const isToday = day.daysAgo === 0;
      
      return {
        date,
        dayName: format(date, 'EEE'),
        dayNum: format(date, 'd'),
        habitsComplete: isToday ? todayHabitsComplete : day.habitsComplete,
        stepsComplete: isToday ? todayStepsComplete : day.stepsComplete,
        allComplete: isToday ? todayAllComplete : (day.habitsComplete && day.stepsComplete),
        isToday,
      };
    });
  }, [completedHabits, completedSteps, totalHabits, totalSteps]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    // Count backwards from yesterday (skip today)
    for (let i = weekData.length - 2; i >= 0; i--) {
      if (weekData[i].allComplete) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [weekData]);

  const perfectDays = weekData.filter(d => d.allComplete).length;

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Weekly Streak
          </div>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 text-sm font-normal bg-terracotta/20 text-terracotta px-2 py-1 rounded-full">
              <Flame className="w-4 h-4" />
              {currentStreak} day streak!
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week grid */}
        <div className="flex justify-between gap-2">
          {weekData.map((day, index) => (
            <div 
              key={index}
              className={`flex-1 text-center p-2 rounded-lg transition-all ${
                day.isToday 
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                  : ''
              } ${
                day.allComplete 
                  ? 'bg-primary/20' 
                  : 'bg-secondary/50'
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{day.dayName}</p>
              <p className={`text-sm font-medium mb-2 ${day.isToday ? 'text-primary' : ''}`}>
                {day.dayNum}
              </p>
              <div className="flex justify-center">
                {day.allComplete ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-sticky-yellow" />
            <span className="text-sm text-muted-foreground">
              Perfect days this week:
            </span>
            <span className="font-semibold text-foreground">{perfectDays}/7</span>
          </div>
        </div>

        {/* Encouragement */}
        <p className="text-sm text-center text-muted-foreground pt-2">
          {perfectDays >= 5 
            ? "🌟 Amazing week! Keep it up!" 
            : perfectDays >= 3 
            ? "💪 Great progress! You're building momentum!"
            : "🌱 Every day is a fresh start. You've got this!"}
        </p>
      </CardContent>
    </Card>
  );
};

export default DemoWeeklyStreak;
