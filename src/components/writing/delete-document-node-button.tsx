"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteDocumentNodeAction } from "@/features/writing/actions/delete-document-node";
import { cn } from "@/lib/utils";
import type { WritingDocumentNode, WritingProject } from "@/types/writing";

export function DeleteDocumentNodeButton({
  project,
  node,
  active,
  className,
}: {
  project: WritingProject;
  node: WritingDocumentNode;
  active: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    setOpen(true);
  }

  function deleteDocument() {
    setError(null);
    startTransition(async () => {
      const result = await deleteDocumentNodeAction({
        projectId: project.id,
        documentNodeId: node.id,
      });

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      setOpen(false);

      if (active) {
        const nextHref = result.nextDocumentNodeId
          ? `/plataforma/escrita/${project.id}?node=${result.nextDocumentNodeId}`
          : `/plataforma/escrita/${project.id}`;
        router.replace(nextHref);
      }

      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Excluir ${node.title}`}
        title="Excluir documento"
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-sm opacity-70 transition-colors group-hover:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-bordo/30 focus-visible:outline-none sm:opacity-0",
          active
            ? "text-brand-marfim/80 hover:bg-brand-marfim/12 hover:text-brand-marfim"
            : "text-brand-tinta/65 hover:bg-brand-bordo/10 hover:text-brand-bordo",
          className,
        )}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (pending) return;
          setOpen(nextOpen);
          if (!nextOpen) setError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir “{node.title}”?</DialogTitle>
            <DialogDescription>
              Esta ação remove o documento do projeto no Supabase. Se ele tiver
              documentos filhos, snapshots ou metas vinculadas, esses dados
              também serão removidos.
            </DialogDescription>
          </DialogHeader>

          {error ? (
            <p
              role="alert"
              className="text-[0.85rem] leading-relaxed text-destructive"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border-default bg-surface-2 px-4 text-[0.88rem] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={deleteDocument}
              disabled={pending}
              aria-busy={pending || undefined}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-destructive px-4 text-[0.88rem] font-bold text-text-on-brand transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Excluindo..." : "Excluir definitivamente"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
