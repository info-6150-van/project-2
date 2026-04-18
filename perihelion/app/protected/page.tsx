import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div
      className="flex-1 w-full flex flex-col gap-12"
      style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#e8e4da" }}
    >
      <div className="w-full">
        <div
          className="text-sm p-3 px-5 rounded-sm flex gap-3 items-center"
          style={{
            background: "rgba(10,15,35,0.6)",
            border: "1px solid rgba(140,180,255,0.15)",
            color: "#9aaccc",
          }}
        >
          <InfoIcon size="16" strokeWidth={2} style={{ color: "#8ab4ff" }} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2
          style={{
            fontSize: "1.25rem",
            letterSpacing: "0.12em",
            color: "#8ab4ff",
            textTransform: "uppercase",
            fontWeight: 400,
            marginBottom: "1rem",
          }}
        >
          Your user details
        </h2>
        <pre
          className="text-xs font-mono p-3 max-h-32 overflow-auto"
          style={{
            border: "1px solid rgba(140,180,255,0.15)",
            borderRadius: "4px",
            background: "rgba(10,15,35,0.6)",
            color: "#9aaccc",
          }}
        >
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>

      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            letterSpacing: "0.12em",
            color: "#8ab4ff",
            textTransform: "uppercase",
            fontWeight: 400,
            marginBottom: "1rem",
          }}
        >
          Next steps
        </h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}