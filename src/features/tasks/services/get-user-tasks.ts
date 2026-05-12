import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WritingTask } from "@/types/writing-task";

type TaskRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TasksResult =
  | { status: "ok"; data: WritingTask[] }
  | { status: "error"; message: string };

export function mapTaskRow(row: TaskRow): WritingTask {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserTasks(userId: string): Promise<TasksResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("writing_tasks")
      .select(
        "id, user_id, project_id, title, description, completed, due_date, created_at, updated_at",
      )
      .eq("user_id", userId)
      .order("completed", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return { status: "error", message: error.message };
    }

    return {
      status: "ok",
      data: (data ?? []).map((row) => mapTaskRow(row as TaskRow)),
    };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao carregar tarefas.",
    };
  }
}
