"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentArchiveSchema,
  type DocumentArchiveInput,
} from "@/lib/validations/document-node";

export async function archiveDocumentNodeAction(
  input: DocumentArchiveInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentArchiveSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Documento inválido.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("document_nodes")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.documentNodeId)
    .eq("project_id", parsed.data.projectId)
    .eq("user_id", profile.authUserId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/plataforma/escrita/${parsed.data.projectId}`);
  return { status: "ok" };
}
