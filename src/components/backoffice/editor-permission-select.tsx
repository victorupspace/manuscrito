"use client";

import { useState, useTransition } from "react";

import type { EditorPermission } from "@/features/backoffice/types";
import { cn } from "@/lib/utils";

type ActionResult = { status: "ok" } | { status: "error"; message: string };

const OPTIONS: { value: EditorPermission; label: string }[] = [
  { value: "viewer", label: "Viewer" },
  { value: "commenter", label: "Commenter" },
  { value: "editor", label: "Editor" },
];

export function EditorPermissionSelect({
  inviteId,
  value,
  onChange,
}: {
  inviteId: string;
  value: EditorPermission;
  onChange: (next: EditorPermission) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<EditorPermission>(value);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <label
        htmlFor={`permission-${inviteId}`}
        className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/70"
      >
        Permissão
      </label>
      <select
        id={`permission-${inviteId}`}
        value={current}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as EditorPermission;
          const previous = current;
          setCurrent(next);
          setError(null);
          startTransition(async () => {
            const result = await onChange(next);
            if (result.status === "error") {
              setError(result.message);
              setCurrent(previous);
            }
          });
        }}
        className={cn(
          "rounded-sm border border-brand-bordo/30 bg-brand-marfim px-3 py-1.5 font-serif text-[0.88rem] text-brand-carvao outline-none",
          "focus-visible:border-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="font-serif text-[0.78rem] italic text-brand-bordo">
          {error}
        </p>
      ) : null}
    </div>
  );
}
