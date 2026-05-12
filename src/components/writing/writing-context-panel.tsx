"use client";

import { useState, useTransition } from "react";

import { updateDocumentMetadataAction } from "@/features/writing/actions/update-document-metadata";
import { WritingStats } from "@/components/writing/writing-stats";
import type { WritingDocumentNode } from "@/types/writing";

const statusOptions: Array<{
  value: WritingDocumentNode["status"];
  label: string;
}> = [
  { value: "draft", label: "Rascunho" },
  { value: "in_review", label: "Em revisão" },
  { value: "completed", label: "Concluído" },
  { value: "archived", label: "Arquivado" },
];

export function WritingContextPanel({
  document,
  notes,
  status,
  targetWords,
  onNotesChange,
  onStatusChange,
  onTargetWordsChange,
  readOnly,
}: {
  document: WritingDocumentNode;
  notes: string;
  status: WritingDocumentNode["status"];
  targetWords: number | null;
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: WritingDocumentNode["status"]) => void;
  onTargetWordsChange: (targetWords: number | null) => void;
  readOnly?: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function saveMetadata() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateDocumentMetadataAction({
        documentNodeId: document.id,
        status,
        targetWords,
        notes,
      });
      setMessage(result.status === "ok" ? "Contexto salvo." : result.message);
    });
  }

  return (
    <aside className="h-full border-l border-brand-bordo/10 bg-brand-creme/55 p-4">
      <div>
        <p className="font-serif text-[0.66rem] uppercase tracking-[0.28em] text-brand-tinta/65">
          Contexto
        </p>
        <h2 className="mt-1 font-serif text-[1.3rem] italic text-brand-bordo">
          Notas e progresso
        </h2>
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <h3 className="font-serif text-[0.85rem] uppercase tracking-[0.22em] text-brand-tinta/75">
            Notas
          </h3>
          <textarea
            value={notes}
            readOnly={readOnly}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Anotações livres sobre este texto."
            className="mt-2 min-h-36 w-full resize-none rounded-md border border-brand-bordo/12 bg-brand-marfim p-3 font-serif text-[0.92rem] leading-relaxed text-brand-carvao outline-none placeholder:text-brand-tinta/40 focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
          />
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-[0.85rem] uppercase tracking-[0.22em] text-brand-tinta/75">
            Metadados
          </h3>
          <label className="block">
            <span className="font-serif text-[0.76rem] text-brand-tinta">
              Status
            </span>
            <select
              value={status}
              disabled={readOnly}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as WritingDocumentNode["status"],
                )
              }
              className="mt-1 h-10 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 font-serif text-[0.9rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-serif text-[0.76rem] text-brand-tinta">
              Meta de palavras
            </span>
            <input
              type="number"
              min={1}
              value={targetWords ?? ""}
              readOnly={readOnly}
              onChange={(event) =>
                onTargetWordsChange(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              className="mt-1 h-10 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 font-serif text-[0.9rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
              placeholder="Ex.: 2500"
            />
          </label>
          <button
            type="button"
            onClick={saveMetadata}
            disabled={pending || readOnly}
            className="h-9 w-full rounded-md border border-brand-bordo bg-brand-bordo px-3 font-serif text-[0.86rem] text-brand-marfim disabled:opacity-55"
          >
            {pending ? "Salvando..." : "Salvar contexto"}
          </button>
          {message ? (
            <p className="font-serif text-[0.8rem] italic text-brand-tinta">
              {message}
            </p>
          ) : null}
        </section>

        <section>
          <h3 className="mb-2 font-serif text-[0.85rem] uppercase tracking-[0.22em] text-brand-tinta/75">
            Progresso
          </h3>
          <WritingStats targetWords={targetWords} />
        </section>

        <section className="rounded-md border border-dashed border-brand-bordo/20 bg-brand-marfim p-4">
          <h3 className="font-serif text-[1rem] italic text-brand-bordo">
            Comentários
          </h3>
          <p className="mt-1 font-serif text-[0.86rem] leading-relaxed text-brand-tinta">
            Espaço reservado para comentários e sugestões de editores em uma
            etapa futura.
          </p>
        </section>
      </div>
    </aside>
  );
}
