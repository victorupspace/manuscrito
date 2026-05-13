"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/require-approved-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  writingTargetSchema,
  type WritingTargetInput,
} from "@/lib/validations/writing-target";

export async function updateWritingTargetAction(
  input: WritingTargetInput,
): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  const profile = await requireApprovedUser();
  const parsed = writingTargetSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Meta inválida.",
    };
  }

  const supabase = await createSupabaseServerClient();

  if (parsed.data.targetType === "project") {
    const { error } = await supabase
      .from("projects")
      .update({ target_words: parsed.data.targetWords })
      .eq("id", parsed.data.projectId)
      .eq("user_id", profile.authUserId);

    if (error) {
      return { status: "error", message: error.message };
    }
  } else if (parsed.data.documentNodeId) {
    const { error } = await supabase
      .from("document_nodes")
      .update({ target_words: parsed.data.targetWords })
      .eq("id", parsed.data.documentNodeId)
      .eq("project_id", parsed.data.projectId)
      .eq("user_id", profile.authUserId);

    if (error) {
      return { status: "error", message: error.message };
    }
  }

  const { error: targetError } = await supabase.from("writing_targets").insert({
    user_id: profile.authUserId,
    project_id: parsed.data.projectId,
    document_node_id:
      parsed.data.targetType === "document" ? parsed.data.documentNodeId : null,
    target_words: parsed.data.targetWords,
    target_type: parsed.data.targetType,
    due_date: parsed.data.dueDate ?? null,
  });

  if (targetError) {
    return { status: "error", message: targetError.message };
  }

  revalidatePath(`/plataforma/escrita/${parsed.data.projectId}`);
  revalidatePath("/plataforma");
  return { status: "ok" };
}
