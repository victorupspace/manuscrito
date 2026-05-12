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

function mapRow(row: Row): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    createdAt: row.created_at,
    plan: row.plan,
  };
}

export async function getCustomers(): Promise<ServiceResult<Customer[]>> {
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
      .order("created_at", { ascending: false });

    if (error) {
      return { status: "error", message: error.message };
    }
    return { status: "ok", data: (data ?? []).map((row) => mapRow(row as Row)) };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao consultar clientes.",
    };
  }
}
