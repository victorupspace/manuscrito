"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { getDocumentStats } from "@/lib/editor/stats";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentNodeSaveSchema,
  type DocumentNodeSaveInput,
} from "@/lib/validations/document-node";

export type SaveDocumentNodeResult =
  | {
      status: "ok";
      savedAt: string;
      stats: { wordCount: number; characterCount: number; readingTime: number };
    }
  | { status: "error"; message: string };

export async function saveDocumentNodeAction(
  input: DocumentNodeSaveInput,
): Promise<SaveDocumentNodeResult> {
  const profile = await requireApprovedUser();
  const parsed = documentNodeSaveSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const stats = getDocumentStats(parsed.data.plainText);
  const savedAt = new Date().toISOString();

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("document_nodes")
      .update({
        title: parsed.data.title,
        content_json: parsed.data.contentJson,
        content_html: parsed.data.contentHtml,
        plain_text: parsed.data.plainText,
        notes: parsed.data.notes ?? null,
        status: parsed.data.status ?? "draft",
        target_words: parsed.data.targetWords ?? null,
        word_count: stats.wordCount,
        character_count: stats.characterCount,
        reading_time: stats.readingTime,
        last_saved_at: savedAt,
        last_synced_at: savedAt,
      })
      .eq("id", parsed.data.documentNodeId)
      .eq("project_id", parsed.data.projectId)
      .eq("user_id", profile.authUserId);

    if (error) {
      return { status: "error", message: error.message };
    }

    const { data: projectNodes, error: projectNodesError } = await supabase
      .from("document_nodes")
      .select("word_count")
      .eq("project_id", parsed.data.projectId)
      .eq("user_id", profile.authUserId);

    if (projectNodesError) {
      return { status: "error", message: projectNodesError.message };
    }

    const projectWordCount = (projectNodes ?? []).reduce(
      (total, row) =>
        total + ((row as { word_count: number | null }).word_count ?? 0),
      0,
    );

    const { error: projectError } = await supabase
      .from("projects")
      .update({
        word_count: projectWordCount,
        updated_at: savedAt,
      })
      .eq("id", parsed.data.projectId)
      .eq("user_id", profile.authUserId);

    if (projectError) {
      return { status: "error", message: projectError.message };
    }

    revalidatePath("/plataforma");
    revalidatePath(`/plataforma/escrita/${parsed.data.projectId}`);

    return { status: "ok", savedAt, stats };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao sincronizar documento.",
    };
  }
}
