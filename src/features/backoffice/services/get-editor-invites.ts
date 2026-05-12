import "server-only";

import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import type {
  EditorInvite,
  EditorInviteStatus,
  EditorPermission,
  ServiceResult,
} from "@/features/backoffice/types";

type Row = {
  id: string;
  master_user_id: string;
  master_user_name: string;
  master_user_email: string;
  editor_email: string;
  permission: EditorPermission;
  status: EditorInviteStatus;
  created_at: string;
  decided_at: string | null;
};

function mapRow(row: Row): EditorInvite {
  return {
    id: row.id,
    masterUserId: row.master_user_id,
    masterUserName: row.master_user_name,
    masterUserEmail: row.master_user_email,
    editorEmail: row.editor_email,
    permission: row.permission,
    status: row.status,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
  };
}

export async function getEditorInvites(): Promise<
  ServiceResult<EditorInvite[]>
> {
  if (!isSupabaseAdminConfigured) {
    return {
      status: "error",
      message:
        "Supabase admin não configurado. Defina SUPABASE_SERVICE_ROLE_KEY em .env.local.",
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("editor_invites")
      .select(
        "id, master_user_id, master_user_name, master_user_email, editor_email, permission, status, created_at, decided_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      return { status: "error", message: error.message };
    }
    return { status: "ok", data: (data ?? []).map((row) => mapRow(row as Row)) };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error
          ? err.message
          : "Falha ao consultar convites de editores.",
    };
  }
}
