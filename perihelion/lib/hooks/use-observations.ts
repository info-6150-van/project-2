import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ObservationRow } from "@/lib/types/observation";

export const OBSERVATIONS_QUERY_KEY = ["observations"] as const;

export function useObservations() {
  return useQuery({
    queryKey: OBSERVATIONS_QUERY_KEY,
    queryFn: async (): Promise<ObservationRow[]> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("observations")
        .select("*")
        .eq("user_id", user.id)
        .order("observed_at", { ascending: false });
      if (error) throw error;
      return data as ObservationRow[];
    },
  });
}
