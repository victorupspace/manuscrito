import Link from "next/link";

import { PROJECT_TYPE_LABELS } from "@/constants/project-types";
import { cn } from "@/lib/utils";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

const typeLabel: Record<WritingDocumentNode["type"], string> = {
  part: "Parte",
  chapter: "Capítulo",
  scene: "Cena",
  note: "Nota",
  research: "Pesquisa",
  draft: "Rascunho",
  short_story_main: "Conto",
  document: "Documento",
};

export function DocumentNodeItem({
  project,
  node,
  active,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
  active: boolean;
}) {
  return (
    <Link
      href={`/plataforma/escrita/${project.id}?node=${node.id}`}
      className={cn(
        "block rounded-md border px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none",
        active
          ? "border-brand-bordo/35 bg-brand-bordo text-brand-marfim"
          : "border-brand-bordo/10 bg-brand-marfim text-brand-carvao hover:border-brand-bordo/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-serif text-[0.96rem] italic">
            {node.title}
          </p>
          <p
            className={cn(
              "mt-1 font-serif text-[0.68rem] uppercase tracking-[0.2em]",
              active ? "text-brand-marfim/70" : "text-brand-tinta/65",
            )}
          >
            {typeLabel[node.type] ?? PROJECT_TYPE_LABELS[project.type]}
          </p>
        </div>
        <span className="shrink-0 font-serif text-[0.76rem] opacity-75">
          {node.wordCount}
        </span>
      </div>
    </Link>
  );
}
