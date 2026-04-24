import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

interface AppNavbarProps {
  showNavLinks?: boolean;
  isAdmin?: boolean;
  showThemeSwitcher?: boolean;
}

export function AppNavbar({
  showNavLinks = false,
  isAdmin = false,
  showThemeSwitcher = false,
}: AppNavbarProps) {
  return (
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
          {showNavLinks && hasEnvVars && (
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
        <div className="flex items-center gap-4">
          {showThemeSwitcher && <ThemeSwitcher />}
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </div>
    </nav>
  );
}