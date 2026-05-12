import type { DocumentNodeType } from "@/constants/document-node-types";
import type { ProjectType } from "@/constants/project-types";
import type { ProjectStatus } from "@/types/project";

export type DocumentStatus = "draft" | "in_review" | "completed" | "archived";

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
  summary: string | null;
  orderIndex: number;
  status: DocumentStatus;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  targetWords: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string | null;
  lastSyncedAt: string | null;
};

export type ProjectWritingData = {
  project: WritingProject;
  documentNodes: WritingDocumentNode[];
  activeDocument: WritingDocumentNode;
};
