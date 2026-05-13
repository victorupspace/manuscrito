"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { restoreDocumentSnapshotAction } from "@/features/writing/actions/restore-document-snapshot";
import type { DocumentSnapshot } from "@/types/writing";

export function RestoreSnapshotDialog({
  snapshot,
  open,
  onOpenChange,
  onRestored,
}: {
  snapshot: DocumentSnapshot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestored: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function restore() {
    if (!snapshot) return;

    startTransition(async () => {
      const result = await restoreDocumentSnapshotAction({
        snapshotId: snapshot.id,
        documentNodeId: snapshot.documentNodeId,
        projectId: snapshot.projectId,
      });
      if (result.status === "ok") {
        onOpenChange(false);
        onRestored();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-brand-marfim sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restaurar snapshot?</DialogTitle>
          <DialogDescription>
            O conteúdo atual será substituído pela versão selecionada. Crie um
            snapshot novo antes se quiser guardar o estado atual.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-brand-bordo/12 bg-brand-creme/60 p-3">
          <p className="font-serif text-[0.95rem] italic text-brand-bordo">
            {snapshot?.label || snapshot?.title}
          </p>
          <p className="mt-1 font-serif text-[0.8rem] text-brand-tinta">
            {snapshot?.wordCount.toLocaleString("pt-BR")} palavras
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={restore} disabled={pending}>
            {pending ? "Restaurando..." : "Restaurar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
