"use client";

import { Maximize2, Minimize2 } from "lucide-react";

import { useWritingStore } from "@/stores/writing-store";

export function FocusModeToggle() {
  const focusMode = useWritingStore((state) => state.focusMode);
  const toggleFocusMode = useWritingStore((state) => state.toggleFocusMode);
  const Icon = focusMode ? Minimize2 : Maximize2;

  return (
    <button
      type="button"
      onClick={toggleFocusMode}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 font-serif text-[0.85rem] text-brand-tinta transition-colors hover:text-brand-bordo focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none"
    >
      <Icon className="size-4" />
      <span className="hidden sm:inline">
        {focusMode ? "Sair do foco" : "Modo foco"}
      </span>
    </button>
  );
}
