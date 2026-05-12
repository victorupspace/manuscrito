import "server-only";

import { cookies } from "next/headers";

/**
 * Autenticação local temporária do backoffice
 * ───────────────────────────────────────────
 * Esta camada é transitória: o objetivo é permitir que apenas o admin do
 * projeto (eu, durante o desenvolvimento) consiga acessar /backoffice sem
 * depender ainda de Supabase Auth.
 *
 * Como funciona
 * - Credenciais aceitas: BACKOFFICE_ADMIN_EMAIL + BACKOFFICE_ADMIN_PASSWORD
 *   (apenas em variáveis de ambiente — nunca em código).
 * - Comparação feita no servidor (server action / route handler).
 * - Após login, gravamos um cookie httpOnly com um token assinado por HMAC
 *   SHA-256 (Web Crypto, compatível com o runtime do `proxy.ts`).
 * - O cookie carrega apenas: `email`, `expiresAt` e a assinatura.
 *   Nada sensível é exposto ao client.
 *
 * Quando substituir
 * - Quando a tabela `admin_users` (Supabase Auth) estiver pronta, troque
 *   `verifyAdminCredentials` por uma consulta à `admin_users` e a assinatura
 *   por JWT do próprio Supabase Auth. As demais funções permanecem.
 */

export const BACKOFFICE_COOKIE_NAME = "manuscrito_bo_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const secret = process.env.BACKOFFICE_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "BACKOFFICE_SESSION_SECRET ausente ou muito curto. Defina pelo menos 16 caracteres em .env.local.",
    );
  }
  return encoder.encode(secret);
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const view =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes as ArrayBuffer);
  let binary = "";
  for (let i = 0; i < view.byteLength; i++) {
    binary += String.fromCharCode(view[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    getSecret() as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  return base64UrlEncode(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

type SessionPayload = {
  email: string;
  expiresAt: number; // ms epoch
};

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(body);
  return `${body}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;

  let expected: string;
  try {
    expected = await hmac(body);
  } catch {
    return null;
  }
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const padded = body.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    const parsed = JSON.parse(json) as SessionPayload;
    if (
      typeof parsed.email !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    if (parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Confere as credenciais informadas contra as variáveis de ambiente.
 * Comparação resistente a timing (na medida do possível em JS puro) e
 * insensível a maiúsculas/minúsculas no e-mail.
 */
export function verifyAdminCredentials(
  email: string,
  password: string,
): boolean {
  const expectedEmail = process.env.BACKOFFICE_ADMIN_EMAIL;
  const expectedPassword = process.env.BACKOFFICE_ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedExpected = expectedEmail.trim().toLowerCase();

  return (
    timingSafeEqual(normalizedEmail, normalizedExpected) &&
    timingSafeEqual(password, expectedPassword)
  );
}

export async function createBackofficeSession(email: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const token = await signSessionToken({
    email: email.trim().toLowerCase(),
    expiresAt,
  });
  const cookieStore = await cookies();
  cookieStore.set(BACKOFFICE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroyBackofficeSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(BACKOFFICE_COOKIE_NAME);
}

export async function getBackofficeSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(BACKOFFICE_COOKIE_NAME)?.value;
  return verifySessionToken(raw);
}
