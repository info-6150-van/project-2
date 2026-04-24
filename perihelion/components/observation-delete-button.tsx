"use client";

import { deleteObservation } from "@/app/protected/log/actions";
import { OBSERVATIONS_QUERY_KEY } from "@/lib/hooks/use-observations";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  observationId: string;
};

export function ObservationDeleteButton({ observationId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    if (!window.confirm("Delete this observation? This cannot be undone.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteObservation(observationId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: OBSERVATIONS_QUERY_KEY });
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={onClick}
        style={{
          padding: "0.35rem 0.75rem",
          fontSize: "0.75rem",
          letterSpacing: "0.06em",
          background: pending ? "rgba(127,29,29,0.35)" : "rgba(185,28,28,0.2)",
          border: "1px solid rgba(248,113,113,0.35)",
          borderRadius: "2px",
          color: "var(--destructive)",
          cursor: pending ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && (
        <span style={{ fontSize: "0.72rem", color: "var(--destructive)", maxWidth: "12rem", textAlign: "right" }}>
          {error}
        </span>
      )}
    </div>
  );
}