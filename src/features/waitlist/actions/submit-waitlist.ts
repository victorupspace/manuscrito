"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist";

export type WaitlistSubmitResult =
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Cria uma conta a partir da landing.
 *
 * Server Action. A validação acontece no servidor (defesa em profundidade,
 * mesmo que o formulário já valide no client com Zod).
 *
 * Persistência
 * ────────────
 * Cria o usuário no Supabase Auth, ativa o perfil em `customers`, cria a
 * assinatura inicial e mantém um registro aprovado em `waitlist_requests`
 * para visibilidade no backoffice. A senha vai direto para o Supabase Auth;
 * ela nunca é gravada em tabela pública ou metadata.
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
          message: "Este e-mail já foi cadastrado. Tente entrar na plataforma.",
        };
      }
      if (status === "approved") {
        return {
          status: "error",
          message: "Este e-mail já possui uma conta. Acesse a plataforma.",
        };
      }
      return {
        status: "error",
        message:
          "Este e-mail não pode ser cadastrado no momento. Fale com o suporte.",
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
          approval_status: "approved",
        },
      });

    if (authError || !authData.user) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[waitlist] erro Supabase Auth:", authError);
      }
      return {
        status: "error",
        message: authError?.message?.toLowerCase().includes("already")
          ? "Este e-mail já possui uma conta. Acesse a plataforma."
          : (authError?.message ??
            "Não foi possível criar seu acesso agora. Tente novamente em instantes."),
      };
    }

    const { error: customerError } = await supabase.from("customers").upsert(
      {
        id: authData.user.id,
        full_name: fullName,
        email,
        phone,
        status: "active",
        plan: "free",
      },
      { onConflict: "id" },
    );

    if (customerError) {
      await supabase.auth.admin.deleteUser(authData.user.id);

      // Conflito de e-mail único: tratamos como conta já existente.
      // Códigos do Postgres: 23505 = unique_violation.
      if (customerError.code === "23505") {
        return {
          status: "error",
          message: "Este e-mail já possui uma conta. Acesse a plataforma.",
        };
      }

      if (process.env.NODE_ENV !== "production") {
        console.error(
          "[waitlist] erro Supabase ao criar cliente:",
          customerError,
        );
      }

      return {
        status: "error",
        message:
          "Não foi possível criar sua conta agora. Tente novamente em instantes.",
      };
    }

    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          customer_id: authData.user.id,
          customer_email: email,
          customer_name: fullName,
          plan: "free",
          status: "trialing",
        },
        { onConflict: "customer_id" },
      );

    if (subscriptionError) {
      await supabase.auth.admin.deleteUser(authData.user.id);

      if (process.env.NODE_ENV !== "production") {
        console.error(
          "[waitlist] erro Supabase ao criar assinatura:",
          subscriptionError,
        );
      }

      return {
        status: "error",
        message:
          "Não foi possível criar sua conta agora. Tente novamente em instantes.",
      };
    }

    const now = new Date().toISOString();
    const { error: insertError } = await supabase
      .from("waitlist_requests")
      .insert({
        auth_user_id: authData.user.id,
        full_name: fullName,
        phone,
        email,
        status: "approved",
        decided_at: now,
        decided_by: "landing:auto-approval",
        metadata: {
          source: "landing",
          auto_approved: true,
        },
      });

    if (insertError) {
      await supabase.auth.admin.deleteUser(authData.user.id);

      // Conflito de e-mail único: tratamos como conta já existente.
      // Códigos do Postgres: 23505 = unique_violation.
      if (insertError.code === "23505") {
        return {
          status: "error",
          message: "Este e-mail já possui uma conta. Acesse a plataforma.",
        };
      }

      if (process.env.NODE_ENV !== "production") {
        console.error(
          "[waitlist] erro Supabase ao registrar cadastro:",
          insertError,
        );
      }

      return {
        status: "error",
        message:
          "Não foi possível criar sua conta agora. Tente novamente em instantes.",
      };
    }

    revalidatePath("/backoffice");
    revalidatePath("/backoffice/requests");
    revalidatePath("/backoffice/customers");
    revalidatePath("/backoffice/subscriptions");

    return { status: "ok" };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[waitlist] exceção:", err);
    }
    return {
      status: "error",
      message:
        "Não foi possível criar sua conta agora. Tente novamente em instantes.",
    };
  }
}
