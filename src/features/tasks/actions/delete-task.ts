"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TaskActionResult } from "@/features/tasks/actions/create-task";

export async function deleteTaskAction(
  taskId: string,
): Promise<TaskActionResult> {
  const profile = await requireApprovedUser();

  if (!taskId) {
    return { status: "error", message: "Tarefa inválida." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("writing_tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", profile.authUserId);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/plataforma");
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao remover tarefa.",
    };
  }
}
