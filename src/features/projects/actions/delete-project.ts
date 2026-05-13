"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DeleteProjectResult =
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Exclui um projeto do usuário autenticado.
 *
 * Segurança
 * ─────────
 * A RLS de `projects` já restringe DELETE a `auth.uid() = user_id`. O filtro
 * `.eq("user_id", profile.authUserId)` aqui é defesa em profundidade — garante
 * que mesmo se a policy for relaxada no futuro, esta action continua segura.
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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", profile.authUserId);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/plataforma");

    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao excluir projeto.",
    };
  }
}
