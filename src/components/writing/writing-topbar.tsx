"use client";

import Link from "next/link";
import {
  BookOpen,
  LibraryBig,
  MoreHorizontal,
  NotebookTabs,
} from "lucide-react";

import { FocusModeToggle } from "@/components/writing/focus-mode-toggle";
import { SaveStatusIndicator } from "@/components/writing/save-status-indicator";
import { useWritingStore } from "@/stores/writing-store";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function WritingTopbar({
  project,
  document,
}: {
  project: WritingProject;
  document: WritingDocumentNode;
}) {
  const wordCount = useWritingStore((state) => state.wordCount);
  const setOutlineOpen = useWritingStore((state) => state.setOutlineOpen);
  const setContextPanelOpen = useWritingStore(
    (state) => state.setContextPanelOpen,
  );

  return (
    <header className="sticky top-0 z-40 border-b border-brand-bordo/10 bg-brand-marfim/90 px-3 py-3 backdrop-blur-xl sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/plataforma"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-brand-bordo/12 bg-brand-marfim text-brand-bordo transition-colors hover:bg-brand-creme"
            aria-label="Voltar para plataforma"
          >
            <BookOpen className="size-4" />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-serif text-[0.86rem] text-brand-carvao">
              {project.title}
            </p>
            <p className="truncate font-serif text-[0.72rem] text-brand-tinta">
              {document.title} · {wordCount} palavras
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setOutlineOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-brand-bordo/12 bg-brand-marfim text-brand-tinta lg:hidden"
            aria-label="Abrir estrutura"
          >
            <LibraryBig className="size-4" />
          </button>
          <SaveStatusIndicator />
          <FocusModeToggle />
          <button
            type="button"
            onClick={() => setContextPanelOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-brand-bordo/12 bg-brand-marfim text-brand-tinta xl:hidden"
            aria-label="Abrir notas"
          >
            <NotebookTabs className="size-4" />
          </button>
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-md border border-brand-bordo/12 bg-brand-marfim text-brand-tinta sm:inline-flex"
            aria-label="Mais opções"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
