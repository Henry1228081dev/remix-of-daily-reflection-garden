import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  cookie_awarded: boolean;
  created_at: string;
}

export const useHabits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const { data: completions = [], isLoading: completionsLoading } = useQuery({
    queryKey: ["habit_completions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_date", { ascending: false });
      
      if (error) throw error;
      return data as HabitCompletion[];
    },
    enabled: !!user,
  });

  const addHabit = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          name,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const deleteHabit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("habits")
        .update({ is_active: false })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const toggleCompletion = useMutation({
    mutationFn: async ({ habitId, date, completed, awardCookie }: { 
      habitId: string; 
      date: string; 
      completed: boolean;
      awardCookie?: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      if (completed) {
        const { error } = await supabase
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: date,
            cookie_awarded: awardCookie || false,
          });
        
        if (error && !error.message.includes("duplicate")) throw error;
      } else {
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_date", date);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit_completions"] });
    },
  });

  const isCompletedOnDate = (habitId: string, date: string) => {
    return completions.some(
      (c) => c.habit_id === habitId && c.completed_date === date
    );
  };

  const getStreak = (habitId: string) => {
    const habitCompletions = completions
      .filter((c) => c.habit_id === habitId)
      .map((c) => c.completed_date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      if (habitCompletions.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  return {
    habits,
    completions,
    isLoading: habitsLoading || completionsLoading,
    addHabit,
    deleteHabit,
    toggleCompletion,
    isCompletedOnDate,
    getStreak,
  };
};
