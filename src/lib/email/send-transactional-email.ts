import "server-only";

export type TransactionalEmailResult =
  | { status: "sent"; providerId?: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

type SendTransactionalEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.TRANSACTIONAL_EMAIL_FROM;

export function getAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: SendTransactionalEmailInput): Promise<TransactionalEmailResult> {
  if (!resendApiKey || !emailFrom) {
    return {
      status: "skipped",
      reason:
        "Email transacional não configurado. Defina RESEND_API_KEY e TRANSACTIONAL_EMAIL_FROM.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to,
        subject,
        html,
        text,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { id?: string; message?: string; error?: string }
      | null;

    if (!response.ok) {
      return {
        status: "error",
        message:
          payload?.message ??
          payload?.error ??
          `Falha ao enviar email (${response.status}).`,
      };
    }

    return { status: "sent", providerId: payload?.id };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Falha ao enviar email.",
    };
  }
}
