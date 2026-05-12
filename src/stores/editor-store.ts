import { create } from "zustand";

export type EditorMode = "writing" | "metadata" | "outline" | "cards";

type EditorState = {
  currentProjectId: string | null;
  currentDocumentNodeId: string | null;
  editorMode: EditorMode;
  focusMode: boolean;
  wordCount: number;
  hasUnsavedChanges: boolean;
  setCurrentProjectId: (projectId: string | null) => void;
  setCurrentDocumentNodeId: (documentNodeId: string | null) => void;
  setEditorMode: (mode: EditorMode) => void;
  setFocusMode: (enabled: boolean) => void;
  setWordCount: (wordCount: number) => void;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
  resetEditorState: () => void;
};

const initialState = {
  currentProjectId: null,
  currentDocumentNodeId: null,
  editorMode: "writing" as EditorMode,
  focusMode: false,
  wordCount: 0,
  hasUnsavedChanges: false,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),
  setCurrentDocumentNodeId: (documentNodeId) =>
    set({ currentDocumentNodeId: documentNodeId }),
  setEditorMode: (editorMode) => set({ editorMode }),
  setFocusMode: (focusMode) => set({ focusMode }),
  setWordCount: (wordCount) => set({ wordCount }),
  setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
  resetEditorState: () => set(initialState),
}));
