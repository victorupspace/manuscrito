"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  documentDeleteSchema,
  type DocumentDeleteInput,
} from "@/lib/validations/document-node";

export type DeleteDocumentNodeResult =
  | { status: "ok"; nextDocumentNodeId: string | null }
  | { status: "error"; message: string };

export async function deleteDocumentNodeAction(
  input: DocumentDeleteInput,
): Promise<DeleteDocumentNodeResult> {
  const profile = await requireApprovedUser();
  const parsed = documentDeleteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Documento inválido.",
    };
  }

  const { documentNodeId, projectId } = parsed.data;

  try {
    const supabase = createSupabaseAdminClient();

    const { data: documentNode, error: documentError } = await supabase
      .from("document_nodes")
      .select("id")
      .eq("id", documentNodeId)
      .eq("project_id", projectId)
      .eq("user_id", profile.authUserId)
      .maybeSingle();

    if (documentError) {
      return { status: "error", message: documentError.message };
    }

    if (!documentNode) {
      return {
        status: "error",
        message:
          "Não foi possível excluir este documento. Ele pode não existir mais ou você não tem permissão.",
      };
    }

    const { error: deleteError } = await supabase
      .from("document_nodes")
      .delete()
      .eq("id", documentNodeId)
      .eq("project_id", projectId)
      .eq("user_id", profile.authUserId);

    if (deleteError) {
      return { status: "error", message: deleteError.message };
    }

    const { data: remainingNodes, error: remainingError } = await supabase
      .from("document_nodes")
      .select("id, word_count")
      .eq("project_id", projectId)
      .eq("user_id", profile.authUserId)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    if (remainingError) {
      return { status: "error", message: remainingError.message };
    }

    const projectWordCount = (remainingNodes ?? []).reduce(
      (total, row) =>
        total + ((row as { word_count: number | null }).word_count ?? 0),
      0,
    );

    const { error: projectError } = await supabase
      .from("projects")
      .update({
        word_count: projectWordCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("user_id", profile.authUserId);

    if (projectError) {
      return { status: "error", message: projectError.message };
    }

    revalidatePath("/plataforma");
    revalidatePath(`/plataforma/escrita/${projectId}`);

    return {
      status: "ok",
      nextDocumentNodeId:
        (remainingNodes?.[0] as { id?: string } | undefined)?.id ?? null,
    };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao excluir documento.",
    };
  }
}
