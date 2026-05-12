"use server";

import { revalidatePath } from "next/cache";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";

import type { AdminActionResult } from "./approve-signup-request";

/**
 * "Remove" um cliente — soft delete via status `removed`.
 *
 * Mantemos o registro para histórico/auditoria. A exclusão real do usuário
 * em `auth.users` deve ser feita explicitamente e em fluxo separado.
 */
export async function removeCustomerAction(
  customerId: string,
  options?: { suspendOnly?: boolean },
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!customerId) {
    return { status: "error", message: "Cliente inválido." };
  }

  const nextStatus = options?.suspendOnly ? "suspended" : "removed";

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("customers")
      .update({ status: nextStatus })
      .eq("id", customerId);

    if (error) {
      return { status: "error", message: error.message };
    }

    await recordAudit({
      actorEmail: session.email,
      action: options?.suspendOnly ? "customer.suspend" : "customer.remove",
      targetType: "customer",
      targetId: customerId,
    });

    revalidatePath("/backoffice/customers");
    revalidatePath(`/backoffice/customers/${customerId}`);
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao atualizar cliente.",
    };
  }
}
