"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DocumentStatusSelect } from "@/components/writing/document-status-select";
import { documentTypeLabels } from "@/components/writing/binder-item";
import { updateDocumentMetadataAction } from "@/features/writing/actions/update-document-metadata";
import type {
  DocumentStatus,
  WritingDocumentNode,
  WritingProject,
} from "@/types/writing";

export function OutlinerRow({
  project,
  node,
  index,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
  index: number;
}) {
  const [status, setStatus] = useState<DocumentStatus>(node.status);
  const [synopsis, setSynopsis] = useState(node.synopsis ?? "");
  const [targetWords, setTargetWords] = useState(node.targetWords);
  const [pov, setPov] = useState(node.pov ?? "");
  const [location, setLocation] = useState(node.location ?? "");
  const [tags, setTags] = useState(node.tags.join(", "));
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const progress = targetWords
    ? Math.min(100, Math.round((node.wordCount / targetWords) * 100))
    : 0;

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateDocumentMetadataAction({
        documentNodeId: node.id,
        status,
        targetWords,
        notes: node.notes,
        synopsis,
        pov,
        location,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setMessage(result.status === "ok" ? "Salvo." : result.message);
    });
  }

  return (
    <tr className="border-b border-brand-bordo/10 align-top">
      <td className="px-3 py-3 font-serif text-[0.82rem] text-brand-tinta">
        {index + 1}
      </td>
      <td className="min-w-52 px-3 py-3">
        <Link
          href={`/plataforma/escrita/${project.id}?node=${node.id}`}
          className="font-serif text-[0.98rem] italic text-brand-bordo hover:text-brand-carvao"
        >
          {node.title}
        </Link>
        <p className="mt-1 font-serif text-[0.72rem] uppercase tracking-[0.18em] text-brand-tinta/60">
          {documentTypeLabels[node.type]}
        </p>
      </td>
      <td className="min-w-36 px-3 py-3">
        <DocumentStatusSelect value={status} onChange={setStatus} />
      </td>
      <td className="min-w-64 px-3 py-3">
        <textarea
          value={synopsis}
          onChange={(event) => setSynopsis(event.target.value)}
          className="min-h-20 w-full resize-none rounded-md border border-brand-bordo/12 bg-brand-marfim px-3 py-2 font-serif text-[0.84rem] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
          placeholder="Função narrativa, virada ou intenção da cena."
        />
      </td>
      <td className="px-3 py-3 font-serif text-[0.86rem] text-brand-carvao">
        {node.wordCount.toLocaleString("pt-BR")}
      </td>
      <td className="min-w-28 px-3 py-3">
        <input
          type="number"
          min={1}
          value={targetWords ?? ""}
          onChange={(event) =>
            setTargetWords(event.target.value ? Number(event.target.value) : null)
          }
          className="h-9 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-2 font-serif text-[0.84rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
        />
      </td>
      <td className="min-w-32 px-3 py-3">
        <div className="h-2 rounded-full bg-brand-creme">
          <div
            className="h-full rounded-full bg-brand-bordo"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 font-serif text-[0.72rem] text-brand-tinta">
          {progress}%
        </p>
      </td>
      <td className="min-w-36 px-3 py-3">
        <input
          value={pov}
          onChange={(event) => setPov(event.target.value)}
          className="h-9 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-2 font-serif text-[0.84rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
        />
      </td>
      <td className="min-w-36 px-3 py-3">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="h-9 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-2 font-serif text-[0.84rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
        />
      </td>
      <td className="min-w-44 px-3 py-3">
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          className="h-9 w-full rounded-md border border-brand-bordo/12 bg-brand-marfim px-2 font-serif text-[0.84rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-bordo/20"
          placeholder="tema, cena-chave"
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <Button type="button" size="icon-sm" onClick={save} disabled={pending}>
            <Save className="size-3.5" />
            <span className="sr-only">Salvar metadados</span>
          </Button>
          <Link
            href={`/plataforma/escrita/${project.id}?node=${node.id}`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-brand-bordo/12 bg-brand-marfim text-brand-tinta transition-colors hover:text-brand-bordo"
          >
            <ExternalLink className="size-3.5" />
            <span className="sr-only">Abrir documento</span>
          </Link>
        </div>
        {message ? (
          <p className="mt-2 font-serif text-[0.72rem] italic text-brand-tinta">
            {message}
          </p>
        ) : null}
      </td>
    </tr>
  );
}
