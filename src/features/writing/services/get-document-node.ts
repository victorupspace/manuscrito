import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapDocumentNode,
  type DocumentNodeRow,
} from "@/features/writing/services/get-project-writing-data";
import type { WritingDocumentNode } from "@/types/writing";

export async function getDocumentNode({
  documentNodeId,
  userId,
}: {
  documentNodeId: string;
  userId: string;
}): Promise<WritingDocumentNode | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_nodes")
    .select(
      "id, project_id, user_id, parent_id, type, title, content_json, content_html, plain_text, synopsis, summary, order_index, status, word_count, character_count, reading_time, target_words, notes, pov, location, tags, metadata, archived_at, created_at, updated_at, last_saved_at, last_synced_at",
    )
    .eq("id", documentNodeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapDocumentNode(data as DocumentNodeRow) : null;
}
