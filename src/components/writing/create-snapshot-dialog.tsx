"use client";

import { useState, useTransition } from "react";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createDocumentSnapshotAction } from "@/features/writing/actions/create-document-snapshot";
import type { WritingDocumentNode } from "@/types/writing";

export function CreateSnapshotDialog({
  document,
  onCreated,
}: {
  document: WritingDocumentNode;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function createSnapshot() {
    setMessage(null);
    startTransition(async () => {
      const result = await createDocumentSnapshotAction({
        documentNodeId: document.id,
        projectId: document.projectId,
        label,
      });
      if (result.status === "ok") {
        setLabel("");
        setOpen(false);
        onCreated();
        return;
      }
      setMessage(result.message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" />}>
        <Camera className="size-4" />
        Criar snapshot
      </DialogTrigger>
      <DialogContent className="bg-brand-marfim sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar snapshot</DialogTitle>
          <DialogDescription>
            Salve uma versão do documento antes de mexer em um trecho delicado.
          </DialogDescription>
        </DialogHeader>
        <label className="block">
          <span className="font-serif text-[0.8rem] text-brand-tinta">
            Nome opcional
          </span>
          <Input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Antes da revisão do final"
            className="mt-1"
          />
        </label>
        {message ? (
          <p className="font-serif text-[0.82rem] text-red-700">{message}</p>
        ) : null}
        <Button type="button" onClick={createSnapshot} disabled={pending}>
          {pending ? "Salvando..." : "Salvar versão"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
