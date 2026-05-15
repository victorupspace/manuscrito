"use client";

import { useEffect, useRef } from "react";

import { syncLocalDocumentAction } from "@/features/writing/actions/sync-local-document";
import { localDb } from "@/lib/db/local-db";
import { getDocumentStats } from "@/lib/editor/stats";
import { useWritingStore } from "@/stores/writing-store";
import type { DocumentNodeType } from "@/constants/document-node-types";
import type { DocumentNodeSaveInput } from "@/lib/validations/document-node";

let flushingDocumentQueue = false;

type UseWritingAutosaveOptions = {
  payload: DocumentNodeSaveInput;
  userId: string;
  documentType: DocumentNodeType;
  enabled?: boolean;
  debounceMs?: number;
  remoteDebounceMs?: number;
  online?: boolean;
};

function isDocumentSaveInput(
  payload: unknown,
): payload is DocumentNodeSaveInput {
  if (!payload || typeof payload !== "object") return false;

  const candidate = payload as Partial<DocumentNodeSaveInput>;
  return (
    typeof candidate.documentNodeId === "string" &&
    typeof candidate.projectId === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.contentHtml === "string" &&
    typeof candidate.plainText === "string"
  );
}

async function clearQueuedDocumentUpdates(documentNodeId: string) {
  const queuedItems = await localDb.syncQueue
    .where("entityId")
    .equals(documentNodeId)
    .toArray();

  const queuedDocumentUpdates = queuedItems.filter(
    (item) => item.entity === "documentNode" && item.operation === "update",
  );

  if (queuedDocumentUpdates.length === 0) return;

  await localDb.syncQueue.bulkDelete(
    queuedDocumentUpdates.map((item) => item.id),
  );
}

async function flushQueuedDocumentUpdates() {
  if (flushingDocumentQueue) return;
  flushingDocumentQueue = true;

  try {
    const queuedItems = await localDb.syncQueue
      .where("entity")
      .equals("documentNode")
      .toArray();
    const latestUpdatesByDocument = new Map<
      string,
      (typeof queuedItems)[number]
    >();

    for (const item of queuedItems) {
      if (item.operation !== "update" || !isDocumentSaveInput(item.payload)) {
        continue;
      }

      const current = latestUpdatesByDocument.get(item.entityId);
      if (!current || item.createdAt > current.createdAt) {
        latestUpdatesByDocument.set(item.entityId, item);
      }
    }

    const latestUpdates = Array.from(latestUpdatesByDocument.values()).sort(
      (a, b) => a.createdAt.localeCompare(b.createdAt),
    );

    for (const item of latestUpdates) {
      if (!isDocumentSaveInput(item.payload)) continue;

      const result = await syncLocalDocumentAction(item.payload);

      if (result.status === "ok") {
        await clearQueuedDocumentUpdates(item.entityId);
        continue;
      }

      await localDb.syncQueue.update(item.id, {
        attempts: item.attempts + 1,
        lastError: result.message,
        updatedAt: new Date().toISOString(),
      });
    }
  } finally {
    flushingDocumentQueue = false;
  }
}

export function useWritingAutosave({
  payload,
  userId,
  documentType,
  enabled = true,
  debounceMs = 700,
  remoteDebounceMs = 1800,
  online = true,
}: UseWritingAutosaveOptions) {
  const setSyncStatus = useWritingStore((state) => state.setSyncStatus);
  const markLocalSaved = useWritingStore((state) => state.markLocalSaved);
  const markRemoteSynced = useWritingStore((state) => state.markRemoteSynced);
  const setHasUnsavedChanges = useWritingStore(
    (state) => state.setHasUnsavedChanges,
  );
  const setStats = useWritingStore((state) => state.setStats);
  const latestPayloadRef = useRef(payload);

  useEffect(() => {
    latestPayloadRef.current = payload;
  }, [payload]);

  useEffect(() => {
    if (!enabled || !payload.documentNodeId) return;

    const stats = getDocumentStats(payload.plainText);
    setStats(stats);
    setHasUnsavedChanges(true);
    setSyncStatus("saving-local");

    const localTimeout = window.setTimeout(async () => {
      const current = latestPayloadRef.current;
      const savedAt = new Date().toISOString();
      const currentStats = getDocumentStats(current.plainText);

      try {
        await localDb.transaction(
          "rw",
          localDb.documentNodes,
          localDb.syncQueue,
          async () => {
            await localDb.documentNodes.put({
              id: current.documentNodeId,
              userId,
              projectId: current.projectId,
              parentId: null,
              type: documentType,
              title: current.title,
              contentJson: current.contentJson,
              contentHtml: current.contentHtml,
              plainText: current.plainText,
              summary: null,
              orderIndex: 0,
              status: current.status ?? "draft",
              wordCount: currentStats.wordCount,
              characterCount: currentStats.characterCount,
              readingTime: currentStats.readingTime,
              targetWords: current.targetWords ?? null,
              notes: current.notes ?? null,
              createdAt: savedAt,
              updatedAt: savedAt,
              lastSavedAt: savedAt,
              lastSyncedAt: null,
            });

            await localDb.syncQueue.put({
              id: crypto.randomUUID(),
              entity: "documentNode",
              entityId: current.documentNodeId,
              operation: "update",
              payload: current,
              attempts: 0,
              lastError: null,
              createdAt: savedAt,
              updatedAt: savedAt,
            });
          },
        );

        markLocalSaved(savedAt);
      } catch {
        setSyncStatus("error");
      }
    }, debounceMs);

    const remoteTimeout = window.setTimeout(async () => {
      if (!online) {
        setSyncStatus("offline");
        return;
      }

      setSyncStatus("syncing");
      const result = await syncLocalDocumentAction(latestPayloadRef.current);
      if (result.status === "ok") {
        await clearQueuedDocumentUpdates(
          latestPayloadRef.current.documentNodeId,
        );
        markRemoteSynced(result.savedAt);
        return;
      }
      setSyncStatus("error");
    }, remoteDebounceMs);

    return () => {
      window.clearTimeout(localTimeout);
      window.clearTimeout(remoteTimeout);
    };
  }, [
    debounceMs,
    documentType,
    enabled,
    markLocalSaved,
    markRemoteSynced,
    online,
    payload,
    remoteDebounceMs,
    setHasUnsavedChanges,
    setStats,
    setSyncStatus,
    userId,
  ]);

  useEffect(() => {
    if (!enabled || !online) return;

    void flushQueuedDocumentUpdates();
  }, [enabled, online]);
}
