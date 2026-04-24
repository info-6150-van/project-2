import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
        <nav className="app-nav w-full flex justify-center border-b h-16 backdrop-blur-sm">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-6 items-center flex-wrap">
              <Link
                href="/"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  letterSpacing: "0.25em",
                  fontSize: "1.05rem",
                  color: "var(--app-logo)",
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
                    style={{ color: "var(--app-link)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/protected/log/new"
                    style={{ color: "var(--app-body)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                  >
                    New observation
                  </Link>
                  <Link
                    href="/protected/log"
                    style={{ color: "var(--app-body)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                  >
                    Log
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      style={{ color: "var(--app-link)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em" }}
                    >
                      Admin
                    </Link>
                  )}
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
          className="app-footer w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"
        >
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "var(--app-footer-link)" }}
            >
              Supabase
            </a>
            {" "}and{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
              style={{ color: "var(--app-footer-link)" }}
            >
              Next.JS
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}