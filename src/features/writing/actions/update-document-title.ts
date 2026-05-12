"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentTitleSchema,
  type DocumentTitleInput,
} from "@/lib/validations/document-title";

export async function updateDocumentTitleAction(
  input: DocumentTitleInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentTitleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Título inválido.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_nodes")
    .update({ title: parsed.data.title })
    .eq("id", parsed.data.documentNodeId)
    .eq("user_id", profile.authUserId)
    .select("project_id")
    .maybeSingle();

  if (error) {
    return { status: "error", message: error.message };
  }

  const projectId = (data as { project_id: string } | null)?.project_id;
  if (projectId) {
    revalidatePath(`/plataforma/escrita/${projectId}`);
  }

  return { status: "ok" };
}
