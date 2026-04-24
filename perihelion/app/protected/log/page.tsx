import { ObservationLogContent } from "@/components/observation-log-content";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ObservationLogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  return <ObservationLogContent />;
}
