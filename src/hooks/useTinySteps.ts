import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface TinyStep {
  id: string;
  user_id: string;
  text: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export const useTinySteps = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: steps = [], isLoading } = useQuery({
    queryKey: ["tiny_steps", user?.id, today],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tiny_steps")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as TinyStep[];
    },
    enabled: !!user,
  });

  const addStep = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("tiny_steps")
        .insert({
          user_id: user.id,
          text,
          date: today,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiny_steps"] });
    },
  });

  const toggleStep = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("tiny_steps")
        .update({ completed })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiny_steps"] });
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tiny_steps")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiny_steps"] });
    },
  });

  return {
    steps,
    isLoading,
    addStep,
    toggleStep,
    deleteStep,
    completedCount: steps.filter((s) => s.completed).length,
  };
};
