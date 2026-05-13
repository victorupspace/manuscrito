"use client";

import { useState, useTransition } from "react";
import { Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WordTargetProgress } from "@/components/writing/word-target-progress";
import { updateWritingTargetAction } from "@/features/writing/actions/update-writing-target";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function WritingTargetsPanel({
  project,
  activeDocument,
  nodes,
}: {
  project: WritingProject;
  activeDocument: WritingDocumentNode;
  nodes: WritingDocumentNode[];
}) {
  const [projectTarget, setProjectTarget] = useState(project.targetWords);
  const [documentTarget, setDocumentTarget] = useState(
    activeDocument.targetWords,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const projectWordCount = nodes.reduce((total, node) => total + node.wordCount, 0);

  function saveProjectTarget() {
    if (!projectTarget) return;
    setMessage(null);
    startTransition(async () => {
      const result = await updateWritingTargetAction({
        projectId: project.id,
        targetWords: projectTarget,
        targetType: "project",
      });
      setMessage(result.status === "ok" ? "Meta do projeto salva." : result.message);
    });
  }

  function saveDocumentTarget() {
    if (!documentTarget) return;
    setMessage(null);
    startTransition(async () => {
      const result = await updateWritingTargetAction({
        projectId: project.id,
        documentNodeId: activeDocument.id,
        targetWords: documentTarget,
        targetType: "document",
      });
      setMessage(
        result.status === "ok" ? "Meta do documento salva." : result.message,
      );
    });
  }

  return (
    <section className="min-h-[calc(100dvh-122px)] bg-brand-marfim p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div>
          <p className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/65">
            Metas
          </p>
          <h2 className="mt-1 font-serif text-[2rem] italic text-brand-bordo">
            Ritmo de palavras
          </h2>
          <p className="mt-2 max-w-2xl font-serif text-[0.98rem] leading-relaxed text-brand-tinta">
            Defina objetivos por projeto e por documento sem tirar o foco do
            texto.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <WordTargetProgress
            current={projectWordCount}
            target={projectTarget}
            label="Projeto"
            emptyLabel="Sem meta geral"
          />
          <WordTargetProgress
            current={activeDocument.wordCount}
            target={documentTarget}
            label={activeDocument.title}
            emptyLabel="Sem meta no documento"
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="rounded-lg border border-brand-bordo/12 bg-brand-creme/60 p-4">
            <span className="font-serif text-[0.82rem] text-brand-tinta">
              Meta do projeto
            </span>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min={1}
                value={projectTarget ?? ""}
                onChange={(event) =>
                  setProjectTarget(
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                className="h-10 min-w-0 flex-1 rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 font-serif outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
                placeholder="Ex.: 80000"
              />
              <Button
                type="button"
                onClick={saveProjectTarget}
                disabled={pending || !projectTarget}
              >
                <Target className="size-4" />
                Salvar
              </Button>
            </div>
          </label>

          <label className="rounded-lg border border-brand-bordo/12 bg-brand-creme/60 p-4">
            <span className="font-serif text-[0.82rem] text-brand-tinta">
              Meta de “{activeDocument.title}”
            </span>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min={1}
                value={documentTarget ?? ""}
                onChange={(event) =>
                  setDocumentTarget(
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                className="h-10 min-w-0 flex-1 rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 font-serif outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
                placeholder="Ex.: 2500"
              />
              <Button
                type="button"
                onClick={saveDocumentTarget}
                disabled={pending || !documentTarget}
              >
                <Target className="size-4" />
                Salvar
              </Button>
            </div>
          </label>
        </div>

        {message ? (
          <p className="mt-4 font-serif text-[0.86rem] italic text-brand-tinta">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
