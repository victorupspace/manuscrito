import type { ProjectType } from "@/constants/project-types";

export type PlatformOverview = {
  totalWords: number;
  activeMaterials: number;
  projectCounts: Record<ProjectType, number>;
  writingStreakDays: number;
};
