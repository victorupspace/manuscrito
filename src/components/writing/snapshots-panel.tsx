"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { CreateSnapshotDialog } from "@/components/writing/create-snapshot-dialog";
import { RestoreSnapshotDialog } from "@/components/writing/restore-snapshot-dialog";
import { SnapshotItem } from "@/components/writing/snapshot-item";
import { listDocumentSnapshotsAction } from "@/features/writing/actions/list-document-snapshots";
import type { DocumentSnapshot, WritingDocumentNode } from "@/types/writing";

export function SnapshotsPanel({
  document,
}: {
  document: WritingDocumentNode;
}) {
  const [snapshots, setSnapshots] = useState<DocumentSnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] =
    useState<DocumentSnapshot | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const loadSnapshots = useCallback(() => {
    startTransition(async () => {
      const result = await listDocumentSnapshotsAction(document.id);
      if (result.status === "ok") {
        setSnapshots(result.snapshots);
        return;
      }
      setMessage(result.message);
    });
  }, [document.id]);

  useEffect(() => {
    let ignore = false;

    startTransition(async () => {
      const result = await listDocumentSnapshotsAction(document.id);
      if (ignore) return;

      if (result.status === "ok") {
        setSnapshots(result.snapshots);
        return;
      }
      setMessage(result.message);
    });

    return () => {
      ignore = true;
    };
  }, [document.id]);

  return (
    <section className="min-h-[calc(100dvh-122px)] bg-brand-marfim p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[0.68rem] uppercase tracking-[0.28em] text-brand-tinta/65">
              Snapshots
            </p>
            <h2 className="mt-1 font-serif text-[2rem] italic text-brand-bordo">
              Versões salvas
            </h2>
            <p className="mt-2 max-w-2xl font-serif text-[0.98rem] leading-relaxed text-brand-tinta">
              Guarde estados importantes de “{document.title}” antes de
              revisões grandes.
            </p>
          </div>
          <CreateSnapshotDialog document={document} onCreated={loadSnapshots} />
        </div>

        {message ? (
          <p className="mt-4 font-serif text-[0.86rem] text-red-700">
            {message}
          </p>
        ) : null}

        {pending && snapshots.length === 0 ? (
          <div className="mt-6 rounded-lg border border-brand-bordo/10 bg-brand-creme/60 p-6 font-serif text-brand-tinta">
            Carregando versões...
          </div>
        ) : null}

        {snapshots.length === 0 && !pending ? (
          <div className="mt-8 rounded-lg border border-dashed border-brand-bordo/20 bg-brand-creme/65 p-8 text-center">
            <h3 className="font-serif text-[1.4rem] italic text-brand-bordo">
              Nenhum snapshot ainda.
            </h3>
            <p className="mt-2 font-serif text-brand-tinta">
              Salve uma versão antes de reescrever uma cena, capítulo ou final.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {snapshots.map((snapshot) => (
              <SnapshotItem
                key={snapshot.id}
                snapshot={snapshot}
                onRestore={setSelectedSnapshot}
              />
            ))}
          </div>
        )}
      </div>
      <RestoreSnapshotDialog
        snapshot={selectedSnapshot}
        open={Boolean(selectedSnapshot)}
        onOpenChange={(open) => {
          if (!open) setSelectedSnapshot(null);
        }}
        onRestored={loadSnapshots}
      />
    </section>
  );
}
