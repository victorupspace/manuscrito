import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProjectStatus, UserProject } from "@/types/project";
import type { ProjectType } from "@/constants/project-types";

type ProjectRow = {
  id: string;
  user_id: string;
  type: ProjectType;
  title: string;
  description: string | null;
  status: ProjectStatus;
  word_count: number;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
};

export type ProjectsResult =
  | { status: "ok"; data: UserProject[] }
  | { status: "error"; message: string };

export function mapProjectRow(row: ProjectRow): UserProject {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    description: row.description,
    status: row.status,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastOpenedAt: row.last_opened_at,
  };
}

export async function getUserProjects(userId: string): Promise<ProjectsResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, user_id, type, title, description, status, word_count, created_at, updated_at, last_opened_at",
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return { status: "error", message: error.message };
    }

    return {
      status: "ok",
      data: (data ?? []).map((row) => mapProjectRow(row as ProjectRow)),
    };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao carregar projetos.",
    };
  }
}
