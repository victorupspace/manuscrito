"use client";

import { useMemo } from "react";

import { ScriveningsSectionEditor } from "@/components/writing/scrivenings-section-editor";
import type { WritingAccessMode } from "@/types/editor-permissions";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function ScriveningsView({
  project,
  nodes,
  accessMode,
}: {
  project: WritingProject;
  nodes: WritingDocumentNode[];
  accessMode: WritingAccessMode;
}) {
  const manuscriptNodes = useMemo(
    () =>
      nodes
        .filter(
          (node) =>
            node.status !== "archived" &&
            !["note", "research"].includes(node.type),
        )
        .sort((a, b) => a.orderIndex - b.orderIndex),
    [nodes],
  );
  const totalWords = manuscriptNodes.reduce(
    (total, node) => total + node.wordCount,
    0,
  );

  return (
    <section className="min-h-[calc(100dvh-122px)] bg-brand-marfim px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl border-b border-brand-bordo/10 pb-6">
          <p className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/65">
            Manuscrito contínuo
          </p>
          <h2 className="mt-1 font-serif text-[2rem] italic text-brand-bordo">
            {project.title}
          </h2>
          <p className="mt-2 font-serif text-[0.98rem] leading-relaxed text-brand-tinta">
            {manuscriptNodes.length} seções em sequência ·{" "}
            {totalWords.toLocaleString("pt-BR")} palavras no recorte atual
          </p>
        </div>

        {manuscriptNodes.length === 0 ? (
          <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-dashed border-brand-bordo/20 bg-brand-creme/65 p-8 text-center">
            <h3 className="font-serif text-[1.4rem] italic text-brand-bordo">
              Ainda não há seções contínuas.
            </h3>
            <p className="mt-2 font-serif text-brand-tinta">
              Crie capítulos, cenas ou documentos para ler a obra como um fluxo
              único.
            </p>
          </div>
        ) : (
          manuscriptNodes.map((node) => (
            <ScriveningsSectionEditor
              key={node.id}
              document={node}
              accessMode={accessMode}
            />
          ))
        )}
      </div>
    </section>
  );
}
