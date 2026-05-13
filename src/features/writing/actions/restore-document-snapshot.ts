"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentSnapshotRestoreSchema,
  type DocumentSnapshotRestoreInput,
} from "@/lib/validations/document-snapshot";

export async function restoreDocumentSnapshotAction(
  input: DocumentSnapshotRestoreInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentSnapshotRestoreSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Snapshot inválido.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: snapshot, error: snapshotError } = await supabase
    .from("document_snapshots")
    .select(
      "id, title, content_json, content_html, plain_text, word_count, character_count",
    )
    .eq("id", parsed.data.snapshotId)
    .eq("document_node_id", parsed.data.documentNodeId)
    .eq("project_id", parsed.data.projectId)
    .eq("user_id", profile.authUserId)
    .maybeSingle();

  if (snapshotError) {
    return { status: "error", message: snapshotError.message };
  }

  if (!snapshot) {
    return { status: "error", message: "Snapshot não encontrado." };
  }

  const restored = snapshot as {
    title: string;
    content_json: unknown | null;
    content_html: string | null;
    plain_text: string | null;
    word_count: number;
    character_count: number;
  };
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("document_nodes")
    .update({
      title: restored.title,
      content_json: restored.content_json,
      content_html: restored.content_html,
      plain_text: restored.plain_text,
      word_count: restored.word_count,
      character_count: restored.character_count,
      last_saved_at: now,
      last_synced_at: now,
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
