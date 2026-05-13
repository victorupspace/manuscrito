"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
import { GripVertical, PenLine } from "lucide-react";

import { DOCUMENT_STATUS_LABELS } from "@/constants/document-statuses";
import { cn } from "@/lib/utils";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";
import { documentTypeLabels } from "@/components/writing/binder-item";

export function CorkboardCard({
  project,
  node,
  dragHandleProps,
  dragging,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  dragging?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-lg border border-brand-bordo/12 bg-brand-marfim p-4 shadow-[0_14px_35px_rgba(67,40,32,0.06)] transition-all hover:-translate-y-0.5 hover:border-brand-bordo/25",
        dragging ? "scale-[1.02] shadow-[0_18px_45px_rgba(67,40,32,0.14)]" : null,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-[0.68rem] uppercase tracking-[0.22em] text-brand-tinta/65">
            {documentTypeLabels[node.type]} ·{" "}
            {DOCUMENT_STATUS_LABELS[node.status] ?? node.status}
          </p>
          <h3 className="mt-1 line-clamp-2 font-serif text-[1.18rem] italic leading-tight text-brand-bordo">
            {node.title}
          </h3>
        </div>
        <button
          type="button"
          className="cursor-grab rounded-md border border-brand-bordo/10 p-1.5 text-brand-tinta/55 transition-colors hover:text-brand-bordo"
          aria-label={`Reordenar ${node.title}`}
          {...dragHandleProps}
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      <p className="mt-4 min-h-20 font-serif text-[0.93rem] leading-relaxed text-brand-carvao/80">
        {node.synopsis ||
          node.summary ||
          "Sinopse ainda vazia. Use este card para registrar a função narrativa desta parte."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-creme px-2.5 py-1 font-serif text-[0.72rem] text-brand-tinta">
          {node.wordCount.toLocaleString("pt-BR")} palavras
        </span>
        {node.pov ? (
          <span className="rounded-full bg-brand-creme px-2.5 py-1 font-serif text-[0.72rem] text-brand-tinta">
            POV: {node.pov}
          </span>
        ) : null}
        {node.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-brand-bordo/10 px-2.5 py-1 font-serif text-[0.72rem] text-brand-tinta"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/plataforma/escrita/${project.id}?node=${node.id}`}
        className="mt-4 inline-flex items-center gap-2 font-serif text-[0.86rem] text-brand-bordo transition-colors hover:text-brand-carvao"
      >
        <PenLine className="size-4" />
        Abrir no editor
      </Link>
    </article>
  );
}
