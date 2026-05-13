"use client";

import { DOCUMENT_STATUS_OPTIONS } from "@/constants/document-statuses";
import { cn } from "@/lib/utils";
import type { DocumentNodeType } from "@/constants/document-node-types";
import type { DocumentStatus } from "@/types/writing";

const typeFilters: Array<{ value: "all" | DocumentNodeType; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "part", label: "Partes" },
  { value: "chapter", label: "Capítulos" },
  { value: "scene", label: "Cenas" },
  { value: "note", label: "Notas" },
  { value: "research", label: "Pesquisa" },
];

export function CorkboardFilters({
  type,
  status,
  onTypeChange,
  onStatusChange,
}: {
  type: "all" | DocumentNodeType;
  status: "all" | DocumentStatus;
  onTypeChange: (type: "all" | DocumentNodeType) => void;
  onStatusChange: (status: "all" | DocumentStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-brand-bordo/10 bg-brand-creme/60 p-1">
        {typeFilters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onTypeChange(option.value)}
            className={cn(
              "h-8 shrink-0 rounded-md px-3 font-serif text-[0.8rem] transition-colors",
              type === option.value
                ? "bg-brand-bordo text-brand-marfim"
                : "text-brand-tinta hover:bg-brand-marfim",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as "all" | DocumentStatus)
        }
        className="h-10 rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 font-serif text-[0.86rem] text-brand-carvao outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
      >
        <option value="all">Todos os status</option>
        {DOCUMENT_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
