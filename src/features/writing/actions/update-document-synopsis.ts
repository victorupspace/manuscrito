"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentSynopsisSchema,
  type DocumentSynopsisInput,
} from "@/lib/validations/document-node";

export async function updateDocumentSynopsisAction(
  input: DocumentSynopsisInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentSynopsisSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Sinopse inválida.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_nodes")
    .update({ synopsis: parsed.data.synopsis ?? null })
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
