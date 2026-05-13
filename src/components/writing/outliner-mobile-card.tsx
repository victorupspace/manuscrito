"use client";

import Link from "next/link";

import { DOCUMENT_STATUS_LABELS } from "@/constants/document-statuses";
import { documentTypeLabels } from "@/components/writing/binder-item";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function OutlinerMobileCard({
  project,
  node,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
}) {
  const progress = node.targetWords
    ? Math.min(100, Math.round((node.wordCount / node.targetWords) * 100))
    : 0;

  return (
    <Link
      href={`/plataforma/escrita/${project.id}?node=${node.id}`}
      className="block rounded-lg border border-brand-bordo/12 bg-brand-marfim p-4 shadow-[0_12px_30px_rgba(67,40,32,0.05)]"
    >
      <p className="font-serif text-[0.66rem] uppercase tracking-[0.22em] text-brand-tinta/65">
        {documentTypeLabels[node.type]} ·{" "}
        {DOCUMENT_STATUS_LABELS[node.status] ?? node.status}
      </p>
      <h3 className="mt-1 font-serif text-[1.18rem] italic text-brand-bordo">
        {node.title}
      </h3>
      <p className="mt-3 line-clamp-3 font-serif text-[0.9rem] leading-relaxed text-brand-carvao/80">
        {node.synopsis || "Sem sinopse registrada."}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-serif text-[0.8rem] text-brand-tinta">
          {node.wordCount.toLocaleString("pt-BR")} palavras
        </span>
        <span className="font-serif text-[0.8rem] text-brand-tinta">
          {node.targetWords ? `${progress}% da meta` : "Sem meta"}
        </span>
      </div>
    </Link>
  );
}
