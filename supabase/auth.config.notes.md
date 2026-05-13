# Configuração do Supabase Auth — fluxo de reset de senha

Estes ajustes são feitos no **painel do Supabase** (não há SQL para alterá-los
diretamente). Apenas o arquivo
[migrations/20260512130000_password_reset_support.sql](./migrations/20260512130000_password_reset_support.sql)
precisa rodar no banco; o restante é configuração do servidor de Auth.

## 1. URL Configuration (Auth → URL Configuration)

### Site URL
```
https://manuscrito.app
```
Em desenvolvimento, troque temporariamente por `http://localhost:3000` ou
deixe os dois cadastrados via *Redirect URLs*.

### Redirect URLs (allow list)
Adicione todas as URLs autorizadas a receber o callback do Supabase. Sem isso
o `resetPasswordForEmail` rejeita o `redirectTo` enviado pela server action.

```
http://localhost:3000/reset-password
http://localhost:3000/login
https://pulsotech.app.br/reset-password
https://pulsotech.app.br/login
https://manuscrito.app/reset-password
https://manuscrito.app/login
```

Inclua também variantes de preview (Vercel) se aplicável, por exemplo:
```
https://*-manuscrito.vercel.app/reset-password
```

## 2. Email Template — "Reset Password" (Auth → Email Templates)

O template padrão do Supabase já funciona, mas convém alinhá-lo ao tom
editorial do Manuscrito.

### Subject
```
Manuscrito · Redefinição de senha
```

### Body (HTML)
```html
<p>Olá,</p>

<p>
  Recebemos uma solicitação para redefinir a senha da sua conta no
  <strong>Manuscrito</strong>.
</p>

<p>
  <a href="{{ .ConfirmationURL }}">Clique aqui para criar uma nova senha</a>.
</p>

<p>
  O link expira em 1 hora. Se você não solicitou esta redefinição, pode
  ignorar este e-mail com tranquilidade — sua senha atual continua válida.
</p>

<p style="margin-top: 32px; color: #6b1f2e; font-style: italic;">
  — Manuscrito · Anno mmxxvi
</p>
```

> A variável `{{ .ConfirmationURL }}` já expande para
> `https://<project>.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=<redirectTo>`.
> Após verificar o token, o Supabase redireciona para
> `<redirectTo>?code=<pkce_code>`, que é exatamente o que nossa rota
> `/reset-password` consome via `exchangeCodeForSession`.

## 3. Auth → Providers → Email

- **Enable Email provider:** habilitado.
- **Confirm email:** habilitado (já era requisito do fluxo de waitlist).
- **Secure email change:** habilitado (recomendado).
- **Mailer OTP expiration:** 3600 (1 hora — padrão).

## 4. Auth → Rate Limits

Para mitigar abuso do `resetPasswordForEmail`, mantenha o limite padrão
(2 emails por hora por IP no plano free; ajuste conforme o plano). Se for
abrir o beta, considere também um WAF/Cloudflare na frente.

## 5. Variáveis de ambiente locais

Confirme em `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
```

A server action `requestPasswordResetAction` deriva o `redirectTo` do header
`Origin` (ou `Host`) da requisição — não há env extra a configurar para o
reset funcionar tanto em localhost quanto em produção.

## 6. Como o fluxo completo se comporta

```
Usuário em /forgot-password
  └─ submete email
     └─ server action chama supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: <origin>/reset-password }
        )
  └─ Supabase envia email com link {{ .ConfirmationURL }}
     └─ link aponta para <supabase>/auth/v1/verify?...&redirect_to=<redirectTo>

Usuário clica no email
  └─ Supabase verifica o OTP de recovery
     └─ redireciona para <redirectTo>?code=<pkce_code>

Página /reset-password (Server Component)
  └─ supabase.auth.exchangeCodeForSession(code)
     └─ grava cookies de sessão temporária (httpOnly)
  └─ renderiza ResetPasswordForm

Usuário escolhe nova senha + confirma
  └─ updatePasswordAction (server action):
       1. valida com Zod
       2. supabase.auth.getUser() — confere sessão de recovery
       3. supabase.auth.updateUser({ password })
       4. supabase.auth.signOut()
       5. redirect("/login?reason=password_updated")
  └─ Página /login exibe banner "Senha atualizada com sucesso..."
```
