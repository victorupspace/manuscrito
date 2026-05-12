import { create } from "zustand";
import type { SyncStatus } from "@/types";

type SyncState = {
  syncStatus: SyncStatus;
  lastLocalSaveAt: string | null;
  lastRemoteSyncAt: string | null;
  error: string | null;
  setSyncStatus: (syncStatus: SyncStatus) => void;
  markLocalSaved: (savedAt?: string) => void;
  markRemoteSynced: (syncedAt?: string) => void;
  setSyncError: (error: string) => void;
  clearSyncError: () => void;
};

export const useSyncStore = create<SyncState>((set) => ({
  syncStatus: "idle",
  lastLocalSaveAt: null,
  lastRemoteSyncAt: null,
  error: null,
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  markLocalSaved: (savedAt = new Date().toISOString()) =>
    set({ lastLocalSaveAt: savedAt, syncStatus: "saved-local", error: null }),
  markRemoteSynced: (syncedAt = new Date().toISOString()) =>
    set({ lastRemoteSyncAt: syncedAt, syncStatus: "synced", error: null }),
  setSyncError: (error) => set({ error, syncStatus: "error" }),
  clearSyncError: () => set({ error: null }),
}));
