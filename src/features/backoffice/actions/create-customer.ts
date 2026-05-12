"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { recordAudit } from "@/features/backoffice/services/record-audit";
import { extractPhoneDigits } from "@/lib/validations/waitlist";
import type { AdminActionResult } from "./approve-signup-request";

const PLAN_OPTIONS = ["free", "solo", "studio", "atelier"] as const;

const createCustomerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Informe o nome completo.")
    .max(120, "Nome muito longo."),
  email: z.string().trim().email("E-mail inválido."),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const digits = extractPhoneDigits(value);
      return digits.length === 10 || digits.length === 11;
    }, "Telefone inválido."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha pode ter no máximo 72 caracteres."),
  plan: z.enum(PLAN_OPTIONS),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export async function createCustomerAction(
  input: CreateCustomerInput,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }

  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { fullName, password, plan } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const phone = parsed.data.phone || null;

  try {
    const supabase = createSupabaseAdminClient();

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
      return {
        status: "error",
        message:
          authError?.message ??
          "Não foi possível criar o usuário no Supabase Auth.",
      };
    }

    const { error: customerError } = await supabase.from("customers").insert({
      id: authData.user.id,
      full_name: fullName,
      email,
      phone,
      status: "active",
      plan,
    });

    if (customerError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { status: "error", message: customerError.message };
    }

    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        customer_id: authData.user.id,
        customer_email: email,
        customer_name: fullName,
        plan,
        status: "trialing",
      });

    if (subscriptionError) {
      await supabase.from("customers").delete().eq("id", authData.user.id);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { status: "error", message: subscriptionError.message };
    }

    await recordAudit({
      actorEmail: session.email,
      action: "customer.create",
      targetType: "customer",
      targetId: authData.user.id,
      payload: { email, plan },
    });

    revalidatePath("/backoffice");
    revalidatePath("/backoffice/customers");
    revalidatePath("/backoffice/subscriptions");

    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao cadastrar cliente.",
    };
  }
}
