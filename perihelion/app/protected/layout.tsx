import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (hasEnvVars) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/auth/login");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-white/10 h-16 backdrop-blur-sm bg-black/20">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-6 items-center flex-wrap">
              <Link
                href="/"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  letterSpacing: "0.25em",
                  fontSize: "1.05rem",
                  color: "#c8d8f8",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                ✦ PERIHELION
              </Link>
              {hasEnvVars && (
                <>
                  <Link
                    href="/protected/dashboard"
                    style={{ color: "#8ab4ff", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/protected/log/new"
                    style={{ color: "#9aaccc", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                  >
                    New observation
                  </Link>
                  <Link
                    href="/protected/log"
                    style={{ color: "#9aaccc", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                  >
                    Log
                  </Link>
                </>
              )}
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">{children}</div>

        <footer
          className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"
          style={{ borderColor: "rgba(140,180,255,0.1)", color: "#4a6088" }}
        >
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "#6a88bb" }}
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
