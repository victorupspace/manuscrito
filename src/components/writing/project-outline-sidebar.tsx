import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AddDocumentNodeDialog } from "@/components/writing/add-document-node-dialog";
import { BinderTree } from "@/components/writing/binder-tree";
import { PROJECT_TYPE_LABELS } from "@/constants/project-types";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function ProjectOutlineSidebar({
  project,
  nodes,
  activeNodeId,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
  activeNodeId: string;
}) {
  return (
    <aside className="h-full border-r border-brand-bordo/10 bg-brand-creme/60 p-4">
      <Link
        href="/plataforma"
        className="inline-flex items-center gap-2 font-serif text-[0.86rem] text-brand-tinta transition-colors hover:text-brand-bordo"
      >
        <ArrowLeft className="size-4" />
        Plataforma
      </Link>

      <div className="mt-6">
        <p className="font-serif text-[0.66rem] uppercase tracking-[0.28em] text-brand-tinta/65">
          {PROJECT_TYPE_LABELS[project.type]}
        </p>
        <h1 className="mt-1 line-clamp-3 font-serif text-[1.35rem] italic leading-tight text-brand-bordo">
          {project.title}
        </h1>
      </div>

      <div className="mt-5">
        <AddDocumentNodeDialog project={project} />
      </div>

      <nav className="mt-5 space-y-2" aria-label="Estrutura do projeto">
        <BinderTree project={project} nodes={nodes} activeNodeId={activeNodeId} />
      </nav>
    </aside>
  );
}
