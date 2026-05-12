import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import {
  BACKOFFICE_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/backoffice/auth";

/**
 * Proxy do Next 16 (antigo `middleware`).
 *
 * Responsabilidades:
 *  1. `/backoffice/*` — checagem otimista da sessão administrativa local.
 *  2. `/plataforma/*` — checagem otimista da sessão do Supabase Auth
 *     (refresh de cookies inclusive) e redirecionamento para `/login` quando
 *     não houver usuário autenticado.
 *
 * A autorização "real" (verificação de aprovação em `customers`) continua
 * sendo feita em cada server component / action via `requireApprovedUser()`.
 * Aqui só evitamos requisições desnecessárias para usuários claramente
 * deslogados.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/backoffice")) {
    return handleBackoffice(request);
  }

  if (pathname.startsWith("/plataforma")) {
    return handlePlataforma(request);
  }

  return NextResponse.next();
}

async function handleBackoffice(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/backoffice/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(BACKOFFICE_COOKIE_NAME)?.value;
  const session = await verifySessionToken(cookie);

  if (!session) {
    return NextResponse.redirect(new URL("/backoffice/login", request.url));
  }

  return NextResponse.next();
}

async function handlePlataforma(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem Supabase configurado a rota segue — o erro explícito vem da página,
  // que tem mensagens mais amigáveis (e o helper `requireApprovedUser` já
  // redireciona para /login quando não há sessão).
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Padrão @supabase/ssr para middleware/proxy: a `response` precisa ser
  // recriada dentro de `setAll` para que cookies de refresh sejam propagados.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/backoffice/:path*", "/plataforma/:path*"],
};
