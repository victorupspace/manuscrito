import "server-only";

/**
 * Placeholder arquitetural para resolução futura de conflitos entre Dexie e
 * Supabase. Hoje a sincronização remota é feita por server action após o
 * autosave local; este módulo existe para centralizar regras quando houver
 * versionamento e merge.
 */
export type LocalSyncDecision = "use-local" | "use-remote" | "needs-review";

export function compareDocumentTimestamps({
  localUpdatedAt,
  remoteUpdatedAt,
}: {
  localUpdatedAt: string | null | undefined;
  remoteUpdatedAt: string | null | undefined;
}): LocalSyncDecision {
  if (!localUpdatedAt) return "use-remote";
  if (!remoteUpdatedAt) return "use-local";
  return new Date(localUpdatedAt) > new Date(remoteUpdatedAt)
    ? "use-local"
    : "use-remote";
}
