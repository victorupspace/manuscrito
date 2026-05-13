import { getAppBaseUrl } from "@/lib/email/send-transactional-email";

export function buildAccountApprovedEmail({
  fullName,
}: {
  fullName: string;
}) {
  const firstName = fullName.split(/\s+/).filter(Boolean)[0] ?? "autor";
  const loginUrl = `${getAppBaseUrl()}/login`;
  const subject = "Manuscrito · Sua conta foi aprovada";
  const text = `Olá, ${firstName}. Sua conta no Manuscrito foi aprovada. Acesse: ${loginUrl}`;
  const html = `
    <div style="margin:0;padding:32px;background:#ece6d3;font-family:Georgia,'Times New Roman',serif;color:#1f1b16;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#f5f1e8;border:1px solid rgba(107,31,46,.14);border-radius:14px;">
        <tr>
          <td style="padding:34px 34px 28px;">
            <p style="margin:0 0 18px;color:#6b1f2e;font-style:italic;font-size:30px;line-height:1;">
              Manuscrito
            </p>
            <p style="margin:0 0 28px;text-transform:uppercase;letter-spacing:.28em;font-size:11px;color:#5c5650;">
              Estúdio de escrita
            </p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.18;color:#1f1b16;">
              Sua conta foi aprovada.
            </h1>
            <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#3a3530;">
              Olá, ${escapeHtml(firstName)}. Seu acesso ao Manuscrito já está liberado.
            </p>
            <p style="margin:0 0 28px;font-size:16px;line-height:1.65;color:#5c5650;">
              Entre na plataforma para começar a organizar livros, contos, rascunhos,
              cenas, notas e materiais de apoio no seu espaço de escrita.
            </p>
            <a href="${loginUrl}" style="display:inline-block;background:#6b1f2e;color:#f5f1e8;text-decoration:none;border-radius:8px;padding:13px 18px;font-weight:700;font-family:Arial,sans-serif;">
              Entrar na plataforma
            </a>
            <p style="margin:30px 0 0;font-size:13px;line-height:1.5;color:#8a847c;">
              Se o botão não funcionar, copie e cole este link no navegador:<br />
              <a href="${loginUrl}" style="color:#6b1f2e;">${loginUrl}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  return { subject, html, text };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
