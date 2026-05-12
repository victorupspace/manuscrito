import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Registra uma ação administrativa em `admin_audit_logs`.
 *
 * Falhas de auditoria não interrompem a operação principal — logamos em dev
 * e seguimos. Quando a tabela for criada no Supabase com esquema:
 *   admin_audit_logs (
 *     id          uuid primary key default gen_random_uuid(),
 *     actor_email text not null,
 *     action      text not null,
 *     target_type text,
 *     target_id   text,
 *     payload     jsonb not null default '{}'::jsonb,
 *     created_at  timestamptz not null default now()
 *   )
 */
export async function recordAudit(entry: {
  actorEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("admin_audit_logs").insert({
      actor_email: entry.actorEmail,
      action: entry.action,
      target_type: entry.targetType ?? null,
      target_id: entry.targetId ?? null,
      payload: entry.payload ?? {},
    });
    if (error && process.env.NODE_ENV !== "production") {
      console.warn("[audit] falha ao registrar log:", error.message);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[audit] exceção:", err);
    }
  }
}
