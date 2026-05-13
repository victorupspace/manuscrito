import type { DocumentNodeType } from "@/constants/document-node-types";
import type { SupportedLanguage } from "@/constants/languages";
import type { ProjectType } from "@/constants/project-types";

export type ISODateString = string;

export type SyncStatus =
  | "idle"
  | "saving-local"
  | "saved-local"
  | "syncing"
  | "synced"
  | "offline"
  | "error";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: ProjectType;
  language?: SupportedLanguage;
  targetWords: number | null;
  deadline: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type DocumentStatus =
  | "idea"
  | "draft"
  | "in_progress"
  | "in_review"
  | "review"
  | "completed"
  | "archived";

export type DocumentNode = {
  id: string;
  projectId: string;
  userId?: string;
  parentId: string | null;
  type: DocumentNodeType;
  title: string;
  contentJson: unknown | null;
  contentHtml: string | null;
  plainText: string | null;
  synopsis?: string | null;
  summary: string | null;
  orderIndex: number;
  status: DocumentStatus;
  wordCount: number;
  characterCount?: number;
  readingTime?: number;
  targetWords?: number | null;
  notes?: string | null;
  pov?: string | null;
  location?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
  archivedAt?: ISODateString | null;
  lastSavedAt?: ISODateString | null;
  lastSyncedAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Character = {
  id: string;
  projectId: string;
  name: string;
  role: string | null;
  description: string | null;
  notes: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Location = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  notes: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type ResearchItem = {
  id: string;
  projectId: string;
  title: string;
  type: string;
  url: string | null;
  notes: string | null;
  tags: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type WritingGoal = {
  id: string;
  projectId: string;
  targetWords: number;
  deadline: ISODateString | null;
  dailyTarget: number | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type WritingSession = {
  id: string;
  projectId: string;
  documentNodeId: string | null;
  startedAt: ISODateString;
  endedAt: ISODateString | null;
  wordsWritten: number;
};
