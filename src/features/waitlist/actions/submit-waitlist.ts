"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist";

export type WaitlistSubmitResult =
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Envia uma solicitação de acesso beta.
 *
 * Server Action. A validação acontece no servidor (defesa em profundidade,
 * mesmo que o formulário já valide no client com Zod).
 *
 * Persistência
 * ────────────
 * Cria o usuário no Supabase Auth com status pendente em `app_metadata` e
 * insere uma solicitação em `waitlist_requests`. A senha vai direto para o
 * Supabase Auth; ela nunca é gravada em tabela pública ou metadata.
 */
export async function submitWaitlist(
  input: WaitlistInput,
): Promise<WaitlistSubmitResult> {
  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Verifique os dados informados.",
    };
  }

  const { fullName, phone, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    const supabase = createSupabaseAdminClient();

    const { data: existingRequest, error: lookupError } = await supabase
      .from("waitlist_requests")
      .select("status")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      return { status: "error", message: lookupError.message };
    }

    if (existingRequest) {
      const status = (existingRequest as { status: string }).status;
      if (status === "pending") {
        return {
          status: "error",
          message: "Sua solicitação já está em análise.",
        };
      }
      if (status === "approved") {
        return {
          status: "error",
          message: "Este e-mail já foi aprovado para acesso.",
        };
      }
      return {
        status: "error",
        message: "Já recebemos uma solicitação com este e-mail.",
      };
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          phone,
        },
        app_metadata: {
          role: "customer",
          approval_status: "pending",
        },
      });

    if (authError || !authData.user) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[waitlist] erro Supabase Auth:", authError);
      }
      return {
        status: "error",
        message:
          authError?.message ??
          "Não foi possível criar seu acesso agora. Tente novamente em instantes.",
      };
    }

    const { error: insertError } = await supabase
      .from("waitlist_requests")
      .insert({
        auth_user_id: authData.user.id,
        full_name: fullName,
        phone,
        email,
        status: "pending",
      });

    if (insertError) {
      await supabase.auth.admin.deleteUser(authData.user.id);

      // Conflito de e-mail único: tratamos como "já está na lista".
      // Códigos do Postgres: 23505 = unique_violation.
      if (insertError.code === "23505") {
        return {
          status: "error",
          message: "Já recebemos uma solicitação com este e-mail.",
        };
      }

      if (process.env.NODE_ENV !== "production") {
        console.error("[waitlist] erro Supabase ao inserir:", insertError);
      }

      return {
        status: "error",
        message:
          "Não foi possível enviar sua solicitação agora. Tente novamente em instantes.",
      };
    }

    revalidatePath("/backoffice");
    revalidatePath("/backoffice/requests");

    return { status: "ok" };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[waitlist] exceção:", err);
    }
    return {
      status: "error",
      message:
        "Não foi possível enviar sua solicitação agora. Tente novamente em instantes.",
    };
  }
}
