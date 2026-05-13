"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentMetadataSchema,
  type DocumentMetadataInput,
} from "@/lib/validations/document-metadata";

export async function updateDocumentMetadataAction(
  input: DocumentMetadataInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentMetadataSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Metadados inválidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_nodes")
    .update({
      status: parsed.data.status,
      target_words: parsed.data.targetWords ?? null,
      notes: parsed.data.notes ?? null,
      synopsis: parsed.data.synopsis ?? null,
      pov: parsed.data.pov ?? null,
      location: parsed.data.location ?? null,
      tags: parsed.data.tags ?? [],
    })
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
