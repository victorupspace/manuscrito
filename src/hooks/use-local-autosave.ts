"use client";

import { useEffect } from "react";
import { localDb } from "@/lib/db/local-db";
import { useEditorStore } from "@/stores/editor-store";
import { useSyncStore } from "@/stores/sync-store";

type UseLocalAutosaveOptions = {
  documentNodeId: string | null;
  contentJson: unknown;
  contentHtml: string;
  plainText: string;
  debounceMs?: number;
  enabled?: boolean;
};

export function useLocalAutosave({
  documentNodeId,
  contentJson,
  contentHtml,
  plainText,
  debounceMs = 900,
  enabled = true,
}: UseLocalAutosaveOptions) {
  const setSyncStatus = useSyncStore((state) => state.setSyncStatus);
  const markLocalSaved = useSyncStore((state) => state.markLocalSaved);
  const setSyncError = useSyncStore((state) => state.setSyncError);
  const setHasUnsavedChanges = useEditorStore(
    (state) => state.setHasUnsavedChanges,
  );

  useEffect(() => {
    if (!enabled || !documentNodeId) {
      return;
    }

    setHasUnsavedChanges(true);
    setSyncStatus("saving-local");

    const timeoutId = window.setTimeout(async () => {
      const updatedAt = new Date().toISOString();

      try {
        await localDb.transaction(
          "rw",
          localDb.documentNodes,
          localDb.syncQueue,
          async () => {
            await localDb.documentNodes.update(documentNodeId, {
              contentJson,
              contentHtml,
              plainText,
              wordCount: countWords(plainText),
              updatedAt,
            });

            await localDb.syncQueue.put({
              id: crypto.randomUUID(),
              entity: "documentNode",
              entityId: documentNodeId,
              operation: "update",
              payload: {
                contentJson,
                contentHtml,
                plainText,
                updatedAt,
              },
              attempts: 0,
              lastError: null,
              createdAt: updatedAt,
              updatedAt,
            });
          },
        );

        setHasUnsavedChanges(false);
        markLocalSaved(updatedAt);
      } catch (error) {
        setSyncError(
          error instanceof Error
            ? error.message
            : "Falha ao salvar localmente.",
        );
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    contentHtml,
    contentJson,
    debounceMs,
    documentNodeId,
    enabled,
    markLocalSaved,
    plainText,
    setHasUnsavedChanges,
    setSyncError,
    setSyncStatus,
  ]);
}

function countWords(text: string) {
  const words = text.trim().match(/\S+/g);

  return words?.length ?? 0;
}
