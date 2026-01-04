import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flame, Shield, AlertTriangle, Plus, Trash2, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface DemoBadHabit {
  id: string;
  habit_name: string;
  replacement_habit: string | null;
  days_clean: number;
  best_streak: number;
  logs: { type: "urge" | "resist" | "slip"; date: string }[];
}

interface DemoBadHabitTrackerCardProps {
  onCookieEarned?: (description: string) => void;
}

const DemoBadHabitTrackerCard = ({ onCookieEarned }: DemoBadHabitTrackerCardProps) => {
  const [habits, setHabits] = useState<DemoBadHabit[]>([
    {
      id: "1",
      habit_name: "Doom scrolling",
      replacement_habit: "Read a book for 5 mins",
      days_clean: 3,
      best_streak: 7,
      logs: [],
    },
  ]);
  const [newHabit, setNewHabit] = useState("");
  const [newReplacement, setNewReplacement] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;

    const newHabitItem: DemoBadHabit = {
      id: Date.now().toString(),
      habit_name: newHabit.trim(),
      replacement_habit: newReplacement.trim() || null,
      days_clean: 0,
      best_streak: 0,
      logs: [],
    };

    setHabits((prev) => [...prev, newHabitItem]);
    setNewHabit("");
    setNewReplacement("");
    setShowAddForm(false);
    toast.success("Habit added! We'll help you track and overcome it.");
  };

  const getTodayStats = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return { urges: 0, resists: 0, slips: 0 };

    const today = new Date().toDateString();
    const todayLogs = habit.logs.filter((log) => new Date(log.date).toDateString() === today);

    return {
      urges: todayLogs.filter((l) => l.type === "urge").length,
      resists: todayLogs.filter((l) => l.type === "resist").length,
      slips: todayLogs.filter((l) => l.type === "slip").length,
    };
  };

  const handleLogEvent = (habitId: string, logType: "urge" | "resist" | "slip") => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const newLog = { type: logType, date: new Date().toISOString() };
        let newDaysClean = habit.days_clean;
        let newBestStreak = habit.best_streak;

        if (logType === "slip") {
          newBestStreak = Math.max(habit.best_streak, habit.days_clean);
          newDaysClean = 0;
        } else if (logType === "resist") {
          onCookieEarned?.(`Resisted: ${habit.habit_name}`);
        }

        return {
          ...habit,
          logs: [...habit.logs, newLog],
          days_clean: newDaysClean,
          best_streak: newBestStreak,
        };
      })
    );

    const messages = {
      urge: "Urge logged. Remember: urges pass. You've got this! 💪",
      resist: "Amazing! You resisted the urge. Keep going! 🌟",
      slip: "It's okay. Every slip is a learning moment. Start fresh now! 🌱",
    };

    toast(logType === "slip" ? "Logged" : "Great job!", {
      description: messages[logType],
    });
  };

  const handleDelete = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    toast.success("Habit removed");
  };

  return (
    <Card className="border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-red-50/30 dark:from-orange-950/20 dark:to-red-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="w-5 h-5 text-orange-500" />
            Bad Habits Tracker
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Input
                placeholder="Habit to break (e.g., Smoking)"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Replacement habit (optional)"
                value={newReplacement}
                onChange={(e) => setNewReplacement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
              />
              <Button onClick={handleAddHabit} disabled={!newHabit.trim()} className="w-full">
                Add Habit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits list */}
        {habits.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Flame className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No bad habits tracked yet.</p>
            <p className="text-sm">Add a habit you want to break!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const stats = getTodayStats(habit.id);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background/80 backdrop-blur rounded-xl p-4 border shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{habit.habit_name}</h4>
                      {habit.replacement_habit && (
                        <p className="text-sm text-muted-foreground">
                          Replace with: <span className="text-primary">{habit.replacement_habit}</span>
                        </p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(habit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Streak info */}
                  <div className="flex gap-3 mb-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {habit.days_clean} days clean
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Best: {habit.best_streak} days
                    </Badge>
                  </div>

                  {/* Today's stats */}
                  {(stats.urges > 0 || stats.resists > 0 || stats.slips > 0) && (
                    <div className="flex gap-2 mb-3 text-xs">
                      {stats.urges > 0 && (
                        <span className="text-orange-600">
                          {stats.urges} urge{stats.urges > 1 ? "s" : ""}
                        </span>
                      )}
                      {stats.resists > 0 && (
                        <span className="text-green-600">
                          {stats.resists} resist{stats.resists > 1 ? "s" : ""}
                        </span>
                      )}
                      {stats.slips > 0 && (
                        <span className="text-red-600">
                          {stats.slips} slip{stats.slips > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                      onClick={() => handleLogEvent(habit.id, "urge")}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Urge
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleLogEvent(habit.id, "resist")}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Resisted!
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleLogEvent(habit.id, "slip")}
                    >
                      <Flame className="w-4 h-4 mr-1" />
                      Slipped
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoBadHabitTrackerCard;
