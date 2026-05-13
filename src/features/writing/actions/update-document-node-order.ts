"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  documentOrderSchema,
  type DocumentOrderInput,
} from "@/lib/validations/document-node";

export async function updateDocumentNodeOrderAction(
  input: DocumentOrderInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = documentOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Ordem inválida.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const updates = parsed.data.orderedNodeIds.map((id, index) =>
    supabase
      .from("document_nodes")
      .update({ order_index: index })
      .eq("id", id)
      .eq("project_id", parsed.data.projectId)
      .eq("user_id", profile.authUserId),
  );

  const results = await Promise.all(updates);
  const firstError = results.find((result) => result.error)?.error;

  if (firstError) {
    return { status: "error", message: firstError.message };
  }

  revalidatePath(`/plataforma/escrita/${parsed.data.projectId}`);
  return { status: "ok" };
}
