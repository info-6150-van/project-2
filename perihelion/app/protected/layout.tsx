import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{
        background: "radial-gradient(ellipse at 60% 0%, #0d1535 0%, #060912 70%)",
        fontFamily: "'EB Garamond', Georgia, serif",
        color: "#e8e4da",
      }}
    >
      {/* ── star-field decoration ─────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,.55) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 42% 65%, rgba(255,255,255,.4) 0%, transparent 100%)," +
            "radial-gradient(1.5px 1.5px at 75% 10%, rgba(255,255,255,.6) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,.35) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 30% 82%, rgba(255,255,255,.45) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 55% 38%, rgba(255,255,255,.3) 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-white/10 h-16 backdrop-blur-sm bg-black/20">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center">
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

        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
          {children}
        </div>

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