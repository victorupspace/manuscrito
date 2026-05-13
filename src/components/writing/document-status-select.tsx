"use client";

import { DOCUMENT_STATUS_OPTIONS } from "@/constants/document-statuses";
import type { DocumentStatus } from "@/types/writing";

export function DocumentStatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: DocumentStatus;
  onChange: (value: DocumentStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as DocumentStatus)}
      className="h-9 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-2 font-serif text-[0.82rem] text-brand-carvao outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20 disabled:opacity-60"
    >
      {DOCUMENT_STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
