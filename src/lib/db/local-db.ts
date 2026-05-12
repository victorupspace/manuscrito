import Dexie, { type Table } from "dexie";
import type {
  Character,
  DocumentNode,
  Location,
  Project,
  ResearchItem,
  WritingGoal,
  WritingSession,
} from "@/types";

export type SyncQueueOperation = "create" | "update" | "delete";
export type SyncQueueEntity =
  | "project"
  | "documentNode"
  | "character"
  | "location"
  | "researchItem"
  | "writingGoal"
  | "writingSession";

export type SyncQueueItem = {
  id: string;
  entity: SyncQueueEntity;
  entityId: string;
  operation: SyncQueueOperation;
  payload: unknown;
  attempts: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export class ManuscritoLocalDatabase extends Dexie {
  projects!: Table<Project, string>;
  documentNodes!: Table<DocumentNode, string>;
  characters!: Table<Character, string>;
  locations!: Table<Location, string>;
  researchItems!: Table<ResearchItem, string>;
  writingGoals!: Table<WritingGoal, string>;
  writingSessions!: Table<WritingSession, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super("manuscrito-local");

    this.version(1).stores({
      projects: "id, userId, type, language, updatedAt",
      documentNodes:
        "id, projectId, parentId, type, status, orderIndex, updatedAt",
      characters: "id, projectId, name, updatedAt",
      locations: "id, projectId, name, updatedAt",
      researchItems: "id, projectId, type, *tags, updatedAt",
      writingGoals: "id, projectId, deadline, updatedAt",
      writingSessions: "id, projectId, documentNodeId, startedAt",
      syncQueue: "id, entity, entityId, operation, createdAt",
    });
  }
}

export const localDb = new ManuscritoLocalDatabase();
