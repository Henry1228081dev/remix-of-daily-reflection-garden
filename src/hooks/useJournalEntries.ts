import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  entry: string;
  prompt: string | null;
  mood: string | null;
  cookies_earned: number;
  created_at: string;
  updated_at: string;
}

export const useJournalEntries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal_entries", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user,
  });

  const upsertEntry = useMutation({
    mutationFn: async (entry: {
      date: string;
      entry: string;
      prompt?: string;
      mood?: string;
      cookies_earned?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("journal_entries")
        .upsert({
          user_id: user.id,
          date: entry.date,
          entry: entry.entry,
          prompt: entry.prompt || null,
          mood: entry.mood || null,
          cookies_earned: entry.cookies_earned || 0,
        }, {
          onConflict: "user_id,date",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_entries"] });
    },
  });

  const getTodayEntry = () => {
    const today = new Date().toISOString().split("T")[0];
    return entries.find((e) => e.date === today);
  };

  const getWeekEntries = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entries.filter((e) => new Date(e.date) >= weekAgo);
  };

  return {
    entries,
    isLoading,
    upsertEntry,
    getTodayEntry,
    getWeekEntries,
  };
};
