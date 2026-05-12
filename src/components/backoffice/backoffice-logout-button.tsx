"use client";

import { useTransition } from "react";

import { logoutBackofficeAction } from "@/features/backoffice/auth/actions/logout-backoffice";
import { cn } from "@/lib/utils";

export function BackofficeLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(() => {
          void logoutBackofficeAction();
        });
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-sm border border-brand-bordo/40 px-3 py-1.5 font-serif text-[0.82rem] text-brand-bordo transition-colors outline-none",
          "hover:bg-brand-bordo hover:text-brand-marfim focus-visible:ring-2 focus-visible:ring-brand-bordo/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-marfim",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-label="Sair do backoffice"
      >
        {pending ? "Saindo…" : "Sair"}
      </button>
    </form>
  );
}
