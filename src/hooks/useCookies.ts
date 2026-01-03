import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Cookie {
  id: string;
  user_id: string;
  description: string;
  source: string;
  earned_at: string;
}

export const useCookies = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cookies = [], isLoading } = useQuery({
    queryKey: ["cookies", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("cookies")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });
      
      if (error) throw error;
      return data as Cookie[];
    },
    enabled: !!user,
  });

  const addCookie = useMutation({
    mutationFn: async ({ description, source }: { description: string; source: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("cookies")
        .insert({
          user_id: user.id,
          description,
          source,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cookies"] });
    },
  });

  const deleteCookie = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cookies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cookies"] });
    },
  });

  const getWeekCookies = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return cookies.filter((c) => new Date(c.earned_at) >= weekAgo);
  };

  return {
    cookies,
    totalCount: cookies.length,
    isLoading,
    addCookie,
    deleteCookie,
    getWeekCookies,
  };
};
