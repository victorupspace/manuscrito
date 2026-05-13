import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DocumentSnapshot } from "@/types/writing";

type SnapshotRow = {
  id: string;
  document_node_id: string;
  project_id: string;
  user_id: string;
  label: string | null;
  title: string;
  content_json: unknown | null;
  content_html: string | null;
  plain_text: string | null;
  word_count: number;
  character_count: number;
  created_at: string;
};

export function mapDocumentSnapshot(row: SnapshotRow): DocumentSnapshot {
  return {
    id: row.id,
    documentNodeId: row.document_node_id,
    projectId: row.project_id,
    userId: row.user_id,
    label: row.label,
    title: row.title,
    contentJson: row.content_json,
    contentHtml: row.content_html,
    plainText: row.plain_text,
    wordCount: row.word_count,
    characterCount: row.character_count,
    createdAt: row.created_at,
  };
}

export async function getDocumentSnapshots({
  documentNodeId,
  userId,
}: {
  documentNodeId: string;
  userId: string;
}): Promise<DocumentSnapshot[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_snapshots")
    .select(
      "id, document_node_id, project_id, user_id, label, title, content_json, content_html, plain_text, word_count, character_count, created_at",
    )
    .eq("document_node_id", documentNodeId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapDocumentSnapshot(row as SnapshotRow));
}
