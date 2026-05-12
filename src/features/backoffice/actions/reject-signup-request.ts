"use server";

import { revalidatePath } from "next/cache";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";

import type { AdminActionResult } from "./approve-signup-request";

export async function rejectSignupRequestAction(
  requestId: string,
  reason?: string,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!requestId) {
    return { status: "error", message: "Solicitação inválida." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: request, error: requestError } = await supabase
      .from("waitlist_requests")
      .select("auth_user_id")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) {
      return { status: "error", message: requestError.message };
    }

    const { error } = await supabase
      .from("waitlist_requests")
      .update({
        status: "rejected",
        decided_at: new Date().toISOString(),
        decided_by: session.email,
      })
      .eq("id", requestId)
      .eq("status", "pending");

    if (error) {
      return { status: "error", message: error.message };
    }

    const authUserId = (request as { auth_user_id: string | null } | null)
      ?.auth_user_id;
    if (authUserId) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        authUserId,
        {
          app_metadata: {
            role: "customer",
            approval_status: "rejected",
          },
        },
      );

      if (authError && process.env.NODE_ENV !== "production") {
        console.warn(
          "[waitlist] falha ao marcar usuário rejeitado:",
          authError,
        );
      }
    }

    await recordAudit({
      actorEmail: session.email,
      action: "waitlist.reject",
      targetType: "waitlist_request",
      targetId: requestId,
      payload: reason ? { reason } : {},
    });

    revalidatePath("/backoffice/requests");
    revalidatePath("/backoffice");
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao reprovar solicitação.",
    };
  }
}
