import "server-only";

import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import type {
  ServiceResult,
  WaitlistRequest,
  WaitlistRequestStatus,
} from "@/features/backoffice/types";

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: WaitlistRequestStatus;
  created_at: string;
  decided_at: string | null;
  decided_by: string | null;
};

function mapRow(row: Row): WaitlistRequest {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
    decidedBy: row.decided_by,
  };
}

export async function getWaitlistRequests(
  filter: WaitlistRequestStatus | "all" = "pending",
): Promise<ServiceResult<WaitlistRequest[]>> {
  if (!isSupabaseAdminConfigured) {
    return {
      status: "error",
      message:
        "Supabase admin não configurado. Defina SUPABASE_SERVICE_ROLE_KEY em .env.local.",
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    let query = supabase
      .from("waitlist_requests")
      .select("id, full_name, email, phone, status, created_at, decided_at, decided_by")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

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
          : "Falha ao consultar solicitações.",
    };
  }
}
