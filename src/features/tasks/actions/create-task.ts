"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  writingTaskCreateSchema,
  type WritingTaskCreateInput,
} from "@/lib/validations/writing-task";
import { mapTaskRow } from "@/features/tasks/services/get-user-tasks";
import type { WritingTask } from "@/types/writing-task";

export type TaskActionResult =
  | { status: "ok"; data?: WritingTask }
  | { status: "error"; message: string };

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

export async function createTaskAction(
  input: WritingTaskCreateInput,
): Promise<TaskActionResult> {
  const profile = await requireApprovedUser();
  const parsed = writingTaskCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("writing_tasks")
      .insert({
        user_id: profile.authUserId,
        project_id: parsed.data.projectId ?? null,
        title: parsed.data.title,
        description: parsed.data.description || null,
        due_date: parsed.data.dueDate ?? null,
      })
      .select(
        "id, user_id, project_id, title, description, completed, due_date, created_at, updated_at",
      )
      .single();

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/plataforma");
    return { status: "ok", data: mapTaskRow(data as TaskRow) };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao criar tarefa.",
    };
  }
}
