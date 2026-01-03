import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  created_at: string;
}

export const useMoodEntries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["mood_entries", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user,
  });

  const upsertMood = useMutation({
    mutationFn: async (mood: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("mood_entries")
        .upsert({
          user_id: user.id,
          date: today,
          mood,
        }, {
          onConflict: "user_id,date",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood_entries"] });
    },
  });

  const getTodayMood = () => {
    const today = new Date().toISOString().split("T")[0];
    return entries.find((e) => e.date === today)?.mood || null;
  };

  return {
    entries,
    isLoading,
    upsertMood,
    getTodayMood,
  };
};
