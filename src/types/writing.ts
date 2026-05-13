import type { DocumentNodeType } from "@/constants/document-node-types";
import type { ProjectType } from "@/constants/project-types";
import type { ProjectStatus } from "@/types/project";

export type DocumentStatus =
  | "idea"
  | "draft"
  | "in_progress"
  | "in_review"
  | "review"
  | "completed"
  | "archived";

export type ActiveWritingMode =
  | "editor"
  | "binder"
  | "corkboard"
  | "outliner"
  | "scrivenings"
  | "snapshots"
  | "targets";

export type WritingSyncStatus =
  | "idle"
  | "saving-local"
  | "saved-local"
  | "syncing"
  | "synced"
  | "offline"
  | "error";

export type WritingProject = {
  id: string;
  userId: string;
  type: ProjectType;
  title: string;
  description: string | null;
  status: ProjectStatus;
  wordCount: number;
  targetWords: number | null;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string | null;
};

export type WritingDocumentNode = {
  id: string;
  projectId: string;
  userId: string;
  parentId: string | null;
  type: DocumentNodeType;
  title: string;
  contentJson: unknown | null;
  contentHtml: string | null;
  plainText: string | null;
  synopsis: string | null;
  summary: string | null;
  orderIndex: number;
  status: DocumentStatus;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  targetWords: number | null;
  notes: string | null;
  pov: string | null;
  location: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string | null;
  lastSyncedAt: string | null;
};

export type DocumentSnapshot = {
  id: string;
  documentNodeId: string;
  projectId: string;
  userId: string;
  label: string | null;
  title: string;
  contentJson: unknown | null;
  contentHtml: string | null;
  plainText: string | null;
  wordCount: number;
  characterCount: number;
  createdAt: string;
};

export type WritingTarget = {
  id: string;
  userId: string;
  projectId: string | null;
  documentNodeId: string | null;
  targetWords: number;
  targetType: "project" | "document";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectWritingData = {
  project: WritingProject;
  documentNodes: WritingDocumentNode[];
  activeDocument: WritingDocumentNode;
};
