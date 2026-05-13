"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
import {
  BookMarked,
  FileText,
  Folder,
  GripVertical,
  Map,
  Notebook,
  StickyNote,
} from "lucide-react";

import { DOCUMENT_STATUS_LABELS } from "@/constants/document-statuses";
import { cn } from "@/lib/utils";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export const documentTypeLabels: Record<WritingDocumentNode["type"], string> = {
  part: "Parte",
  chapter: "Capítulo",
  scene: "Cena",
  note: "Nota",
  research: "Pesquisa",
  draft: "Rascunho",
  short_story_main: "Conto",
  document: "Documento",
};

const documentTypeIcons = {
  part: Folder,
  chapter: BookMarked,
  scene: FileText,
  note: StickyNote,
  research: Map,
  draft: Notebook,
  short_story_main: BookMarked,
  document: FileText,
};

export function BinderItem({
  project,
  node,
  active,
  depth = 0,
  dragHandleProps,
  dragging,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
  active: boolean;
  depth?: number;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  dragging?: boolean;
}) {
  const Icon = documentTypeIcons[node.type] ?? FileText;

  return (
    <div
      className={cn(
        "group rounded-md transition-transform",
        dragging ? "scale-[1.01] opacity-80" : null,
      )}
      style={{ paddingLeft: depth ? `${depth * 0.85}rem` : undefined }}
    >
      <Link
        href={`/plataforma/escrita/${project.id}?node=${node.id}`}
        className={cn(
          "flex items-center gap-2 rounded-md border px-2.5 py-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none",
          active
            ? "border-brand-bordo/35 bg-brand-bordo text-brand-marfim"
            : "border-brand-bordo/10 bg-brand-marfim text-brand-carvao hover:border-brand-bordo/30 hover:bg-white/70",
        )}
      >
        <button
          type="button"
          className={cn(
            "cursor-grab rounded-sm p-0.5 opacity-45 transition-opacity group-hover:opacity-100",
            active ? "text-brand-marfim" : "text-brand-tinta",
          )}
          aria-label={`Reordenar ${node.title}`}
          {...dragHandleProps}
          onClick={(event) => event.preventDefault()}
        >
          <GripVertical className="size-3.5" />
        </button>
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[0.92rem] italic">
            {node.title}
          </p>
          <p
            className={cn(
              "mt-0.5 truncate font-serif text-[0.62rem] uppercase tracking-[0.18em]",
              active ? "text-brand-marfim/72" : "text-brand-tinta/62",
            )}
          >
            {documentTypeLabels[node.type]} ·{" "}
            {DOCUMENT_STATUS_LABELS[node.status] ?? node.status}
          </p>
        </div>
        <span className="shrink-0 font-serif text-[0.74rem] opacity-75">
          {node.wordCount}
        </span>
      </Link>
    </div>
  );
}
