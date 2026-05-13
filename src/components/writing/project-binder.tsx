"use client";

import { AddDocumentNodeDialog } from "@/components/writing/add-document-node-dialog";
import { BinderTree } from "@/components/writing/binder-tree";
import { PROJECT_TYPE_LABELS } from "@/constants/project-types";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function ProjectBinder({
  project,
  nodes,
  activeNodeId,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
  activeNodeId: string;
}) {
  return (
    <section className="min-h-[calc(100dvh-122px)] bg-brand-marfim p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/65">
              Estrutura · {PROJECT_TYPE_LABELS[project.type]}
            </p>
            <h2 className="mt-1 font-serif text-[2rem] italic text-brand-bordo">
              Binder do projeto
            </h2>
            <p className="mt-2 max-w-2xl font-serif text-[0.98rem] leading-relaxed text-brand-tinta">
              Organize partes, capítulos, cenas, notas e pesquisa sem sair do
              ambiente de escrita.
            </p>
          </div>
          <AddDocumentNodeDialog project={project} />
        </div>

        <div className="mt-6 rounded-lg border border-brand-bordo/12 bg-brand-creme/55 p-3 shadow-[0_16px_40px_rgba(67,40,32,0.05)]">
          <BinderTree
            project={project}
            nodes={nodes}
            activeNodeId={activeNodeId}
          />
        </div>
      </div>
    </section>
  );
}
