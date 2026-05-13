import { create } from "zustand";

import type { WritingAccessMode } from "@/types/editor-permissions";
import type { ActiveWritingMode, WritingSyncStatus } from "@/types/writing";

type WritingState = {
  projectId: string | null;
  currentDocumentNodeId: string | null;
  focusMode: boolean;
  contextPanelOpen: boolean;
  outlineOpen: boolean;
  syncStatus: WritingSyncStatus;
  lastLocalSaveAt: string | null;
  lastRemoteSyncAt: string | null;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  hasUnsavedChanges: boolean;
  accessMode: WritingAccessMode;
  activeWritingMode: ActiveWritingMode;
  setProjectId: (projectId: string | null) => void;
  setCurrentDocumentNodeId: (documentNodeId: string | null) => void;
  toggleFocusMode: () => void;
  setFocusMode: (focusMode: boolean) => void;
  setContextPanelOpen: (open: boolean) => void;
  setOutlineOpen: (open: boolean) => void;
  setSyncStatus: (syncStatus: WritingSyncStatus) => void;
  markLocalSaved: (savedAt?: string) => void;
  markRemoteSynced: (syncedAt?: string) => void;
  setStats: (stats: {
    wordCount: number;
    characterCount: number;
    readingTime: number;
  }) => void;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
  setAccessMode: (accessMode: WritingAccessMode) => void;
  setActiveWritingMode: (mode: ActiveWritingMode) => void;
};

export const useWritingStore = create<WritingState>((set) => ({
  projectId: null,
  currentDocumentNodeId: null,
  focusMode: false,
  contextPanelOpen: false,
  outlineOpen: false,
  syncStatus: "idle",
  lastLocalSaveAt: null,
  lastRemoteSyncAt: null,
  wordCount: 0,
  characterCount: 0,
  readingTime: 0,
  hasUnsavedChanges: false,
  accessMode: "master",
  activeWritingMode: "editor",
  setProjectId: (projectId) => set({ projectId }),
  setCurrentDocumentNodeId: (currentDocumentNodeId) =>
    set({ currentDocumentNodeId }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  setFocusMode: (focusMode) => set({ focusMode }),
  setContextPanelOpen: (contextPanelOpen) => set({ contextPanelOpen }),
  setOutlineOpen: (outlineOpen) => set({ outlineOpen }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  markLocalSaved: (savedAt = new Date().toISOString()) =>
    set({
      lastLocalSaveAt: savedAt,
      syncStatus: "saved-local",
      hasUnsavedChanges: false,
    }),
  markRemoteSynced: (syncedAt = new Date().toISOString()) =>
    set({ lastRemoteSyncAt: syncedAt, syncStatus: "synced" }),
  setStats: ({ wordCount, characterCount, readingTime }) =>
    set({ wordCount, characterCount, readingTime }),
  setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
  setAccessMode: (accessMode) => set({ accessMode }),
  setActiveWritingMode: (activeWritingMode) => set({ activeWritingMode }),
}));
