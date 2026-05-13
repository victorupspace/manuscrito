"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createDocumentNodeAction } from "@/features/writing/actions/create-document-node";
import type { WritingProject } from "@/types/writing";
import type { DocumentNodeType } from "@/constants/document-node-types";

const OPTIONS: Array<{ type: DocumentNodeType; label: string }> = [
  { type: "part", label: "Parte" },
  { type: "chapter", label: "Capítulo" },
  { type: "scene", label: "Cena" },
  { type: "note", label: "Nota" },
  { type: "research", label: "Pesquisa" },
  { type: "draft", label: "Rascunho" },
  { type: "document", label: "Documento" },
];

export function AddDocumentNodeDialog({
  project,
}: {
  project: WritingProject;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocumentNodeType>(
    project.type === "book" ? "chapter" : "draft",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createDocumentNodeAction({
        projectId: project.id,
        type,
        title,
      });
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      setOpen(false);
      setTitle("");
      router.push(
        `/plataforma/escrita/${project.id}?node=${result.documentNodeId}`,
      );
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-brand-bordo/15 bg-brand-marfim px-3 font-serif text-[0.86rem] text-brand-bordo transition-colors hover:bg-brand-creme"
      >
        <Plus className="size-4" />
        Adicionar documento
      </button>
      {open ? (
        <form
          onSubmit={submit}
          className="mt-3 space-y-2 rounded-md border border-brand-bordo/10 bg-brand-marfim p-3"
        >
          <label className="block">
            <span className="font-serif text-[0.68rem] uppercase tracking-[0.2em] text-brand-tinta/70">
              Tipo
            </span>
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as DocumentNodeType)
              }
              className="mt-1 h-9 w-full rounded-md border border-brand-bordo/15 bg-brand-marfim px-2 font-serif text-[0.9rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
            >
              {OPTIONS.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-serif text-[0.68rem] uppercase tracking-[0.2em] text-brand-tinta/70">
              Título
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-brand-bordo/15 bg-brand-marfim px-2 font-serif text-[0.9rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/25"
              placeholder="Novo capítulo"
            />
          </label>
          {error ? (
            <p className="font-serif text-[0.8rem] italic text-brand-bordo">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="h-9 w-full rounded-md bg-brand-bordo px-3 font-serif text-[0.86rem] text-brand-marfim disabled:opacity-55"
          >
            {pending ? "Criando..." : "Criar"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
