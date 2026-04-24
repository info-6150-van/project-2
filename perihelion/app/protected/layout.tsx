import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAdmin = false;
  if (hasEnvVars) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/auth/login");
    }
    const profile = await getProfile();
    isAdmin = profile?.role === 'admin';
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <AppNavbar showNavLinks isAdmin={isAdmin} />

        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">{children}</div>

        <AppFooter />
      </div>
    </main>
  );
}