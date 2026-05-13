"use server";

import { revalidatePath } from "next/cache";

import { getBackofficeSession } from "@/lib/backoffice/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email/send-transactional-email";
import { buildAccountApprovedEmail } from "@/features/backoffice/emails/account-approved-email";
import { recordAudit } from "@/features/backoffice/services/record-audit";

export type AdminActionResult =
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Aprova uma solicitação de cadastro vinda da homepage.
 *
 * Cria/ativa o cliente no banco operacional, abre a assinatura inicial free
 * e marca o usuário do Supabase Auth como aprovado em `app_metadata`.
 */
export async function approveSignupRequestAction(
  requestId: string,
): Promise<AdminActionResult> {
  const session = await getBackofficeSession();
  if (!session) {
    return { status: "error", message: "Sessão expirada." };
  }
  if (!requestId) {
    return { status: "error", message: "Solicitação inválida." };
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data: request, error: requestError } = await supabase
      .from("waitlist_requests")
      .select("id, auth_user_id, full_name, email, phone, status")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) {
      return { status: "error", message: requestError.message };
    }

    if (!request) {
      return { status: "error", message: "Solicitação não encontrada." };
    }

    const row = request as {
      id: string;
      auth_user_id: string | null;
      full_name: string;
      email: string;
      phone: string;
      status: string;
    };

    if (row.status !== "pending") {
      return {
        status: "error",
        message: "Esta solicitação já foi decidida.",
      };
    }

    if (!row.auth_user_id) {
      return {
        status: "error",
        message:
          "Esta solicitação não possui usuário no Supabase Auth. Peça um novo cadastro pela landing page.",
      };
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(
      row.auth_user_id,
      {
        app_metadata: {
          role: "customer",
          approval_status: "approved",
        },
        user_metadata: {
          full_name: row.full_name,
          phone: row.phone,
        },
      },
    );

    if (authError) {
      return { status: "error", message: authError.message };
    }

    const { error: customerError } = await supabase.from("customers").upsert(
      {
        id: row.auth_user_id,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        status: "active",
        plan: "free",
      },
      { onConflict: "id" },
    );

    if (customerError) {
      return { status: "error", message: customerError.message };
    }

    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          customer_id: row.auth_user_id,
          customer_email: row.email,
          customer_name: row.full_name,
          plan: "free",
          status: "trialing",
        },
        { onConflict: "customer_id" },
      );

    if (subscriptionError) {
      return { status: "error", message: subscriptionError.message };
    }

    const { error } = await supabase
      .from("waitlist_requests")
      .update({
        status: "approved",
        decided_at: new Date().toISOString(),
        decided_by: session.email,
      })
      .eq("id", requestId)
      .eq("status", "pending");

    if (error) {
      return { status: "error", message: error.message };
    }

    await recordAudit({
      actorEmail: session.email,
      action: "waitlist.approve",
      targetType: "waitlist_request",
      targetId: requestId,
    });

    const approvalEmail = buildAccountApprovedEmail({
      fullName: row.full_name,
    });
    const emailResult = await sendTransactionalEmail({
      to: row.email,
      ...approvalEmail,
    });

    await recordAudit({
      actorEmail: session.email,
      action:
        emailResult.status === "sent"
          ? "waitlist.approval_email_sent"
          : "waitlist.approval_email_not_sent",
      targetType: "waitlist_request",
      targetId: requestId,
      payload: { email: row.email, emailResult },
    });

    revalidatePath("/backoffice/requests");
    revalidatePath("/backoffice/customers");
    revalidatePath("/backoffice/subscriptions");
    revalidatePath("/backoffice");
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Falha ao aprovar solicitação.",
    };
  }
}
