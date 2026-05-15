"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type DeleteProjectResult =
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Exclui um projeto do usuário autenticado.
 *
 * Segurança
 * ─────────
 * A action roda no servidor e primeiro confirma que o projeto pertence ao
 * usuário autenticado. Depois usa service role para executar a remoção de forma
 * consistente, sem depender de cascatas/RLS disparadas a partir do client.
 *
 * Observação sobre tarefas vinculadas: a coluna `writing_tasks.project_id`
 * tem `on delete set null`, então tarefas associadas ao projeto serão
 * preservadas (apenas perdem o vínculo). Conteúdos de escrita (chapters,
 * scenes, etc.) cascateiam via `on delete cascade`, conforme migrations
 * posteriores definirem.
 */
export async function deleteProjectAction(
  projectId: string,
): Promise<DeleteProjectResult> {
  const profile = await requireApprovedUser();

  if (!projectId) {
    return { status: "error", message: "Projeto inválido." };
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", profile.authUserId)
      .maybeSingle();

    if (projectError) {
      return { status: "error", message: projectError.message };
    }

    if (!project) {
      return {
        status: "error",
        message:
          "Não foi possível excluir este material. Ele pode não existir mais ou você não tem permissão.",
      };
    }

    const { error: tasksError } = await supabase
      .from("writing_tasks")
      .update({ project_id: null })
      .eq("project_id", projectId)
      .eq("user_id", profile.authUserId);

    if (tasksError) {
      return { status: "error", message: tasksError.message };
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", profile.authUserId);

    if (deleteError) {
      return { status: "error", message: deleteError.message };
    }

    revalidatePath("/plataforma");
    revalidatePath(`/plataforma/escrita/${projectId}`);

    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao excluir projeto.",
    };
  }
}
