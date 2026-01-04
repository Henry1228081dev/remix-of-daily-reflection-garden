import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface BadHabit {
  id: string;
  user_id: string;
  habit_name: string;
  replacement_habit: string | null;
  days_clean: number;
  best_streak: number;
  last_slip_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BadHabitLog {
  id: string;
  user_id: string;
  bad_habit_id: string;
  log_type: "urge" | "resist" | "slip";
  intensity: number | null;
  notes: string | null;
  logged_at: string;
}

export const useBadHabits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["bad_habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bad_habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BadHabit[];
    },
    enabled: !!user,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["bad_habit_logs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bad_habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as BadHabitLog[];
    },
    enabled: !!user,
  });

  const addBadHabit = useMutation({
    mutationFn: async ({ habitName, replacementHabit }: { habitName: string; replacementHabit?: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bad_habits")
        .insert({
          user_id: user.id,
          habit_name: habitName,
          replacement_habit: replacementHabit || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bad_habits"] });
    },
  });

  const logEvent = useMutation({
    mutationFn: async ({
      badHabitId,
      logType,
      intensity,
      notes,
    }: {
      badHabitId: string;
      logType: "urge" | "resist" | "slip";
      intensity?: number;
      notes?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Insert the log
      const { error: logError } = await supabase
        .from("bad_habit_logs")
        .insert({
          user_id: user.id,
          bad_habit_id: badHabitId,
          log_type: logType,
          intensity: intensity || null,
          notes: notes || null,
        });

      if (logError) throw logError;

      // Update streak based on log type
      const habit = habits.find((h) => h.id === badHabitId);
      if (!habit) return;

      if (logType === "slip") {
        // Reset streak, update last slip date
        const { error: updateError } = await supabase
          .from("bad_habits")
          .update({
            days_clean: 0,
            last_slip_date: new Date().toISOString().split("T")[0],
          })
          .eq("id", badHabitId);

        if (updateError) throw updateError;
      } else if (logType === "resist") {
        // Calculate new streak
        const today = new Date().toISOString().split("T")[0];
        const lastSlip = habit.last_slip_date;
        
        let newDaysClean = habit.days_clean;
        if (!lastSlip) {
          // Never slipped, calculate from creation
          const created = new Date(habit.created_at);
          const now = new Date();
          newDaysClean = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          const slipDate = new Date(lastSlip);
          const now = new Date();
          newDaysClean = Math.floor((now.getTime() - slipDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        const newBestStreak = Math.max(habit.best_streak, newDaysClean);

        const { error: updateError } = await supabase
          .from("bad_habits")
          .update({
            days_clean: newDaysClean,
            best_streak: newBestStreak,
          })
          .eq("id", badHabitId);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bad_habits"] });
      queryClient.invalidateQueries({ queryKey: ["bad_habit_logs"] });
    },
  });

  const deleteBadHabit = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("bad_habits")
        .update({ is_active: false })
        .eq("id", habitId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bad_habits"] });
    },
  });

  const getLogsForHabit = (habitId: string) => {
    return logs.filter((log) => log.bad_habit_id === habitId);
  };

  const getTodayStats = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = logs.filter(
      (log) => log.bad_habit_id === habitId && log.logged_at.startsWith(today)
    );

    return {
      urges: todayLogs.filter((l) => l.log_type === "urge").length,
      resists: todayLogs.filter((l) => l.log_type === "resist").length,
      slips: todayLogs.filter((l) => l.log_type === "slip").length,
    };
  };

  return {
    habits,
    logs,
    isLoading,
    addBadHabit,
    logEvent,
    deleteBadHabit,
    getLogsForHabit,
    getTodayStats,
  };
};
