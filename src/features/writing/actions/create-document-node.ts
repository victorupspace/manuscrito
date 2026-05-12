"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentNodeCreateSchema,
  type DocumentNodeCreateInput,
} from "@/lib/validations/document-node";

export type CreateDocumentNodeResult =
  | { status: "ok"; documentNodeId: string }
  | { status: "error"; message: string };

export async function createDocumentNodeAction(
  input: DocumentNodeCreateInput,
): Promise<CreateDocumentNodeResult> {
  const profile = await requireApprovedUser();
  const parsed = documentNodeCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { count } = await supabase
      .from("document_nodes")
      .select("id", { count: "exact", head: true })
      .eq("project_id", parsed.data.projectId)
      .eq("user_id", profile.authUserId);

    const { data, error } = await supabase
      .from("document_nodes")
      .insert({
        project_id: parsed.data.projectId,
        user_id: profile.authUserId,
        parent_id: parsed.data.parentId ?? null,
        type: parsed.data.type,
        title: parsed.data.title,
        order_index: count ?? 0,
      })
      .select("id")
      .single();

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath(`/plataforma/escrita/${parsed.data.projectId}`);
    return { status: "ok", documentNodeId: (data as { id: string }).id };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao criar documento.",
    };
  }
}
