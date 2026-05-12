"use client";

import {
  CheckCircle2,
  Cloud,
  CloudOff,
  Loader2,
  TriangleAlert,
} from "lucide-react";

import { useWritingStore } from "@/stores/writing-store";
import type { WritingSyncStatus } from "@/types/writing";

const LABELS: Record<WritingSyncStatus, string> = {
  idle: "Pronto",
  "saving-local": "Salvando...",
  "saved-local": "Salvo localmente",
  syncing: "Sincronizando...",
  synced: "Sincronizado",
  offline: "Offline",
  error: "Erro ao salvar",
};

export function SaveStatusIndicator() {
  const status = useWritingStore((state) => state.syncStatus);
  const Icon =
    status === "saving-local" || status === "syncing"
      ? Loader2
      : status === "synced" || status === "saved-local"
        ? CheckCircle2
        : status === "offline"
          ? CloudOff
          : status === "error"
            ? TriangleAlert
            : Cloud;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-brand-bordo/10 bg-brand-marfim px-3 py-1 font-serif text-[0.78rem] text-brand-tinta">
      <Icon
        className={
          status === "saving-local" || status === "syncing"
            ? "size-3.5 animate-spin text-brand-bordo"
            : "size-3.5 text-brand-bordo"
        }
      />
      {LABELS[status]}
    </div>
  );
}
