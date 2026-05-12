"use client";

import { useState, useTransition } from "react";

import type { SubscriptionPlan } from "@/features/backoffice/types";
import { cn } from "@/lib/utils";

type ActionResult = { status: "ok" } | { status: "error"; message: string };

const OPTIONS: { value: SubscriptionPlan; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "solo", label: "Solo" },
  { value: "studio", label: "Studio" },
  { value: "atelier", label: "Atelier" },
];

export function SubscriptionPlanSelect({
  subscriptionId,
  value,
  onChange,
}: {
  subscriptionId: string;
  value: SubscriptionPlan;
  onChange: (next: SubscriptionPlan) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<SubscriptionPlan>(value);

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <select
        aria-label="Plano"
        value={current}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as SubscriptionPlan;
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
        data-subscription-id={subscriptionId}
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
