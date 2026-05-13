"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DocumentSnapshot } from "@/types/writing";

export function SnapshotItem({
  snapshot,
  onRestore,
  restoring,
}: {
  snapshot: DocumentSnapshot;
  onRestore: (snapshot: DocumentSnapshot) => void;
  restoring?: boolean;
}) {
  return (
    <article className="rounded-lg border border-brand-bordo/12 bg-brand-marfim p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-[1rem] italic text-brand-bordo">
            {snapshot.label || snapshot.title}
          </p>
          <p className="mt-1 font-serif text-[0.78rem] text-brand-tinta">
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(snapshot.createdAt))}{" "}
            · {snapshot.wordCount.toLocaleString("pt-BR")} palavras
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={restoring}
          onClick={() => onRestore(snapshot)}
        >
          <RotateCcw className="size-3.5" />
          Restaurar
        </Button>
      </div>
      <p className="mt-3 line-clamp-3 font-serif text-[0.88rem] leading-relaxed text-brand-carvao/75">
        {snapshot.plainText || "Snapshot sem texto visível."}
      </p>
    </article>
  );
}
