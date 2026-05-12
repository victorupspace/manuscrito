"use server";

import { revalidatePath } from "next/cache";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";
import type { EditorPermission } from "@/features/backoffice/types";

import type { AdminActionResult } from "./approve-signup-request";

const ALLOWED_PERMISSIONS: EditorPermission[] = [
  "viewer",
  "commenter",
  "editor",
];

export async function updateEditorPermissionAction(
  inviteId: string,
  permission: EditorPermission,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!inviteId || !ALLOWED_PERMISSIONS.includes(permission)) {
    return { status: "error", message: "Parâmetros inválidos." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("editor_invites")
      .update({ permission })
      .eq("id", inviteId);

    if (error) {
      return { status: "error", message: error.message };
    }

    await recordAudit({
      actorEmail: session.email,
      action: "editor_invite.update_permission",
      targetType: "editor_invite",
      targetId: inviteId,
      payload: { permission },
    });

    revalidatePath("/backoffice/editors");
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error
          ? err.message
          : "Falha ao atualizar permissão do editor.",
    };
  }
}
