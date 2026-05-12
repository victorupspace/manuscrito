import type { ProjectType } from "@/constants/project-types";

export type ProjectStatus = "active" | "paused" | "completed" | "archived";

export type UserProject = {
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
