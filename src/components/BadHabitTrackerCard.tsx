import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flame, Shield, AlertTriangle, Plus, Trash2, TrendingUp, Clock } from "lucide-react";
import { useBadHabits } from "@/hooks/useBadHabits";
import { toast } from "@/hooks/use-toast";

const BadHabitTrackerCard = () => {
  const { habits, isLoading, addBadHabit, logEvent, deleteBadHabit, getTodayStats } = useBadHabits();
  const [newHabit, setNewHabit] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddHabit = async () => {
    if (!newHabit.trim()) return;

    try {
      await addBadHabit.mutateAsync({ habitName: newHabit.trim() });
      setNewHabit("");
      setShowAddForm(false);
      toast({
        title: "Habit added!",
        description: "We'll help you track and overcome this habit.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogEvent = async (habitId: string, logType: "urge" | "resist" | "slip") => {
    try {
      await logEvent.mutateAsync({ badHabitId: habitId, logType });
      
      const messages = {
        urge: "Urge logged. Remember: urges pass. You've got this! 💪",
        resist: "Amazing! You resisted the urge. Keep going! 🌟",
        slip: "It's okay. Every slip is a learning moment. Start fresh now! 🌱",
      };

      toast({
        title: logType === "slip" ? "Logged" : "Great job!",
        description: messages[logType],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log event.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (habitId: string) => {
    try {
      await deleteBadHabit.mutateAsync(habitId);
      toast({
        title: "Habit removed",
        description: "Keep up the good work on your other habits!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove habit.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

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
              className="flex gap-2"
            >
              <Input
                placeholder="Habit to break (e.g., Smoking)"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                className="flex-1"
              />
              <Button onClick={handleAddHabit} disabled={!newHabit.trim() || addBadHabit.isPending}>
                Add
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
                        <span className="text-orange-600">{stats.urges} urge{stats.urges > 1 ? "s" : ""}</span>
                      )}
                      {stats.resists > 0 && (
                        <span className="text-green-600">{stats.resists} resist{stats.resists > 1 ? "s" : ""}</span>
                      )}
                      {stats.slips > 0 && (
                        <span className="text-red-600">{stats.slips} slip{stats.slips > 1 ? "s" : ""}</span>
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
                      disabled={logEvent.isPending}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Urge
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleLogEvent(habit.id, "resist")}
                      disabled={logEvent.isPending}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Resisted!
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleLogEvent(habit.id, "slip")}
                      disabled={logEvent.isPending}
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

export default BadHabitTrackerCard;
