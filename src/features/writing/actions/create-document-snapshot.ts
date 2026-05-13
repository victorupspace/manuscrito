"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentSnapshotCreateSchema,
  type DocumentSnapshotCreateInput,
} from "@/lib/validations/document-snapshot";

export async function createDocumentSnapshotAction(
  input: DocumentSnapshotCreateInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentSnapshotCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Snapshot inválido.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: node, error: nodeError } = await supabase
    .from("document_nodes")
    .select(
      "id, project_id, user_id, title, content_json, content_html, plain_text, word_count, character_count",
    )
    .eq("id", parsed.data.documentNodeId)
    .eq("project_id", parsed.data.projectId)
    .eq("user_id", profile.authUserId)
    .maybeSingle();

  if (nodeError) {
    return { status: "error", message: nodeError.message };
  }

  if (!node) {
    return { status: "error", message: "Documento não encontrado." };
  }

  const snapshot = node as {
    id: string;
    project_id: string;
    title: string;
    content_json: unknown | null;
    content_html: string | null;
    plain_text: string | null;
    word_count: number;
    character_count: number;
  };

  const { error } = await supabase.from("document_snapshots").insert({
    document_node_id: snapshot.id,
    project_id: snapshot.project_id,
    user_id: profile.authUserId,
    label: parsed.data.label ?? null,
    title: snapshot.title,
    content_json: snapshot.content_json,
    content_html: snapshot.content_html,
    plain_text: snapshot.plain_text,
    word_count: snapshot.word_count,
    character_count: snapshot.character_count,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath(`/plataforma/escrita/${parsed.data.projectId}`);
  return { status: "ok" };
}
