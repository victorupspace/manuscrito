"use server";

import { revalidatePath } from "next/cache";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";

import type { AdminActionResult } from "./approve-signup-request";

export async function rejectEditorInviteAction(
  inviteId: string,
  reason?: string,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!inviteId) {
    return { status: "error", message: "Convite inválido." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("editor_invites")
      .update({
        status: "rejected",
        decided_at: new Date().toISOString(),
      })
      .eq("id", inviteId)
      .eq("status", "pending");

    if (error) {
      return { status: "error", message: error.message };
    }

    await recordAudit({
      actorEmail: session.email,
      action: "editor_invite.reject",
      targetType: "editor_invite",
      targetId: inviteId,
      payload: reason ? { reason } : {},
    });

    revalidatePath("/backoffice/editors");
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao reprovar convite.",
    };
  }
}
