import "server-only";

import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import type {
  Customer,
  CustomerStatus,
  ServiceResult,
  SubscriptionPlan,
} from "@/features/backoffice/types";

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: CustomerStatus;
  created_at: string;
  plan: SubscriptionPlan | null;
};

export async function getCustomerById(
  customerId: string,
): Promise<ServiceResult<Customer | null>> {
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
      .from("customers")
      .select("id, full_name, email, phone, status, created_at, plan")
      .eq("id", customerId)
      .maybeSingle();

    if (error) {
      return { status: "error", message: error.message };
    }

    if (!data) {
      return { status: "ok", data: null };
    }

    const row = data as Row;
    return {
      status: "ok",
      data: {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        status: row.status,
        createdAt: row.created_at,
        plan: row.plan,
      },
    };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao consultar cliente.",
    };
  }
}
