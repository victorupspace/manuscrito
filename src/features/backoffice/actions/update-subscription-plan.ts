"use server";

import { revalidatePath } from "next/cache";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";
import type { SubscriptionPlan } from "@/features/backoffice/types";

import type { AdminActionResult } from "./approve-signup-request";

const ALLOWED_PLANS: SubscriptionPlan[] = ["free", "solo", "studio", "atelier"];

export async function updateSubscriptionPlanAction(
  subscriptionId: string,
  plan: SubscriptionPlan,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!subscriptionId || !ALLOWED_PLANS.includes(plan)) {
    return { status: "error", message: "Parâmetros inválidos." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .update({ plan })
      .eq("id", subscriptionId)
      .select("customer_id")
      .maybeSingle();

    if (error) {
      return { status: "error", message: error.message };
    }

    const customerId = (subscription as { customer_id: string } | null)
      ?.customer_id;
    if (customerId) {
      const { error: customerError } = await supabase
        .from("customers")
        .update({ plan })
        .eq("id", customerId);

      if (customerError) {
        return { status: "error", message: customerError.message };
      }
    }

    await recordAudit({
      actorEmail: session.email,
      action: "subscription.update_plan",
      targetType: "subscription",
      targetId: subscriptionId,
      payload: { plan },
    });

    revalidatePath("/backoffice/subscriptions");
    revalidatePath("/backoffice/customers");
    if (customerId) {
      revalidatePath(`/backoffice/customers/${customerId}`);
    }
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error
          ? err.message
          : "Falha ao atualizar plano da assinatura.",
    };
  }
}
