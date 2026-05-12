import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && serviceRoleKey,
);

/**
 * Cliente Supabase com a service role key.
 *
 * Uso restrito ao servidor (server actions, route handlers, server components).
 * Nunca importe este módulo em código client-side: o `import "server-only"`
 * acima fará o build falhar caso isso aconteça.
 *
 * Necessário enquanto não há políticas RLS específicas para o backoffice e
 * para fluxos administrativos como aprovar/rejeitar solicitações de cadastro.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
