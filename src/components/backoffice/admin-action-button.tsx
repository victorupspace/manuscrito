"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "danger" | "ghost";

type AdminActionButtonProps = {
  action: () => Promise<{ status: "ok" } | { status: "error"; message: string }>;
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: Variant;
  className?: string;
  confirm?: string;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-brand-bordo bg-brand-bordo text-brand-marfim hover:bg-brand-bordo-profundo",
  danger:
    "border border-brand-bordo/40 bg-transparent text-brand-bordo hover:bg-brand-bordo hover:text-brand-marfim",
  ghost:
    "border border-brand-tinta/30 bg-transparent text-brand-tinta hover:bg-brand-tinta/10 hover:text-brand-carvao",
};

export function AdminActionButton({
  action,
  children,
  pendingLabel,
  variant = "primary",
  className,
  confirm,
}: AdminActionButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          setError(null);
          startTransition(async () => {
            const result = await action();
            if (result.status === "error") {
              setError(result.message);
            }
          });
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-sm px-3 py-1.5 font-serif text-[0.85rem] transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-brand-bordo/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_CLASSES[variant],
          className,
        )}
      >
        {pending ? (pendingLabel ?? "Processando…") : children}
      </button>
      {error ? (
        <p
          role="alert"
          className="font-serif text-[0.78rem] italic text-brand-bordo"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
