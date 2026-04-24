"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/protected/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div>
        <div style={{
          display: "inline-block",
          padding: "0.2rem 0.75rem",
          border: "1px solid var(--app-badge-border)",
          borderRadius: "2px",
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          color: "var(--app-badge)",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}>
          Sky-Watcher&apos;s Journal
        </div>
        <h1 style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: "2rem",
          fontWeight: 400,
          color: "var(--app-heading)",
          margin: "0 0 0.35rem",
          lineHeight: 1.15,
        }}>
          New password
        </h1>
        <p style={{ margin: 0, color: "var(--app-body)", fontSize: "0.92rem" }}>
          Please enter your new password below.
        </p>
      </div>

      <div style={{
        border: "1px solid var(--app-card-border)",
        borderRadius: "4px",
        padding: "1.75rem",
        background: "var(--app-card-bg)",
        backdropFilter: "blur(8px)",
      }}>
        <form onSubmit={handleUpdatePassword}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                color: "var(--app-label)",
                textTransform: "uppercase",
              }}>
                New password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "var(--app-input-bg)",
                  border: "1px solid var(--app-input-border)",
                  borderRadius: "2px",
                  color: "var(--app-input-color)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: "0.85rem", color: "#f87171", margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.6rem 1.4rem",
                background: isLoading ? "rgba(42,76,173,0.5)" : "var(--app-btn-primary)",
                border: "1px solid var(--app-btn-primary-border)",
                borderRadius: "2px",
                color: "var(--app-btn-primary-text)",
                fontSize: "0.88rem",
                letterSpacing: "0.06em",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
              }}
            >
              {isLoading ? "Saving…" : "Save new password →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}