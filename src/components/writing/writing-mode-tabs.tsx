"use client";

import { WRITING_MODE_TABS } from "@/constants/writing-mode-tabs";
import { cn } from "@/lib/utils";
import { useWritingStore } from "@/stores/writing-store";
import type { ActiveWritingMode } from "@/types/writing";

export function WritingModeTabs() {
  const activeMode = useWritingStore((state) => state.activeWritingMode);
  const setActiveMode = useWritingStore((state) => state.setActiveWritingMode);

  return (
    <nav
      aria-label="Modos de escrita"
      className="border-b border-brand-bordo/10 bg-brand-marfim/80 px-3 py-2 backdrop-blur-xl sm:px-4"
    >
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-brand-bordo/10 bg-brand-creme/60 p-1">
        {WRITING_MODE_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeMode === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id as ActiveWritingMode)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 font-serif text-[0.82rem] transition-all focus-visible:ring-2 focus-visible:ring-brand-bordo/25 focus-visible:outline-none",
                active
                  ? "bg-brand-bordo text-brand-marfim shadow-sm"
                  : "text-brand-tinta hover:bg-brand-marfim hover:text-brand-bordo",
              )}
              aria-current={active ? "page" : undefined}
              title={tab.description}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
