import { create } from "zustand";
import type { Project } from "@/types";

type ProjectState = {
  projects: Project[];
  activeProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  upsertProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  setActiveProjectId: (projectId: string | null) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProjectId: null,
  setProjects: (projects) => set({ projects }),
  upsertProject: (project) =>
    set((state) => {
      const exists = state.projects.some((item) => item.id === project.id);

      return {
        projects: exists
          ? state.projects.map((item) =>
              item.id === project.id ? project : item,
            )
          : [...state.projects, project],
      };
    }),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
      activeProjectId:
        state.activeProjectId === projectId ? null : state.activeProjectId,
    })),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
}));
