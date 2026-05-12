import "server-only";

import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import type {
  ServiceResult,
  Subscription,
  SubscriptionPlan,
} from "@/features/backoffice/types";

type Row = {
  id: string;
  customer_id: string;
  customer_email: string;
  customer_name: string;
  plan: SubscriptionPlan;
  status: "active" | "trialing" | "canceled" | "past_due";
  started_at: string;
  renews_at: string | null;
};

function mapRow(row: Row): Subscription {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    plan: row.plan,
    status: row.status,
    startedAt: row.started_at,
    renewsAt: row.renews_at,
  };
}

export async function getSubscriptions(): Promise<
  ServiceResult<Subscription[]>
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
      .from("subscriptions")
      .select(
        "id, customer_id, customer_email, customer_name, plan, status, started_at, renews_at",
      )
      .order("started_at", { ascending: false });

    if (error) {
      return { status: "error", message: error.message };
    }
    return { status: "ok", data: (data ?? []).map((row) => mapRow(row as Row)) };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao consultar assinaturas.",
    };
  }
}
