# Backoffice — autenticação local + integração Supabase

Este documento descreve a configuração do backoffice administrativo do
Manuscrito nesta etapa: autenticação local temporária, integração real com
Supabase e fluxos suportados.

## Variáveis de ambiente

Defina em `.env.local` (nunca em código, nunca no client):

| Variável                        | Escopo       | Descrição                                                                         |
| ------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | público      | URL do projeto Supabase.                                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público      | Anon key, usada pelos clientes browser/SSR.                                       |
| `SUPABASE_SERVICE_ROLE_KEY`     | **servidor** | Service role. Usada apenas em código server-only (`src/lib/supabase/admin.ts`).   |
| `BACKOFFICE_ADMIN_EMAIL`        | servidor     | E-mail aceito pelo login local do backoffice.                                     |
| `BACKOFFICE_ADMIN_PASSWORD`     | servidor     | Senha aceita pelo login local do backoffice.                                      |
| `BACKOFFICE_SESSION_SECRET`     | servidor     | Segredo HMAC para assinar o cookie de sessão. Gere com `openssl rand -base64 32`. |
| `RESEND_API_KEY`                | servidor     | API key do Resend para emails transacionais administrativos.                      |
| `TRANSACTIONAL_EMAIL_FROM`      | servidor     | Remetente verificado. Ex.: `Manuscrito <noreply@pulsotech.app.br>`.               |
| `NEXT_PUBLIC_APP_URL`           | público      | URL pública do app usada nos links de email. Ex.: `https://pulsotech.app.br`.     |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` **nunca** deve ser exposta ao cliente. O
> módulo `src/lib/supabase/admin.ts` declara `import "server-only"`; qualquer
> import acidental no client quebra o build.

## Como acessar

1. Defina as variáveis acima e reinicie `npm run dev`.
2. Acesse `http://localhost:3000/backoffice/login`.
3. Informe `BACKOFFICE_ADMIN_EMAIL` + `BACKOFFICE_ADMIN_PASSWORD`.
4. Em caso de sucesso, um cookie httpOnL `manuscrito_bo_session` é criado e
   você é redirecionado para `/backoffice`.

A sessão expira em 8 horas. O logout (botão "Sair") destrói o cookie e
redireciona para `/backoffice/login`.

## Como criar o banco no Supabase

O schema oficial está em
`supabase/migrations/20260512120000_backoffice_core.sql`.

Para aplicar pelo painel:

1. Abra o projeto no Supabase.
2. Vá em **SQL Editor**.
3. Cole o conteúdo da migration.
4. Clique em **Run**.

Depois copie para `.env.local`:

- `Project Settings > API > Project URL` em `NEXT_PUBLIC_SUPABASE_URL`.
- `Project Settings > API > anon public` em `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `Project Settings > API > service_role` em `SUPABASE_SERVICE_ROLE_KEY`.

Reinicie `npm run dev` após alterar `.env.local`.

## Estrutura de rotas

| Rota                                 | Acesso    | Descrição                                  |
| ------------------------------------ | --------- | ------------------------------------------ |
| `/backoffice/login`                  | público   | Tela de login local.                       |
| `/backoffice`                        | protegido | Painel com cards de visão geral.           |
| `/backoffice/requests`               | protegido | Solicitações `pending` vindas da homepage. |
| `/backoffice/customers`              | protegido | Lista de clientes.                         |
| `/backoffice/customers/[customerId]` | protegido | Ficha individual com ações.                |
| `/backoffice/editors`                | protegido | Convites de editores + permissão.          |
| `/backoffice/subscriptions`          | protegido | Lista de assinaturas com troca de plano.   |

A proteção é feita em duas camadas (defense-in-depth):

1. **Proxy** (`src/proxy.ts`, equivalente ao antigo middleware no Next 16):
   redirect otimista quando o cookie é ausente/inválido.
2. **Layout autenticado** (`src/app/backoffice/(authenticated)/layout.tsx`):
   re-verifica `getBackofficeSession()` no servidor antes de renderizar.

## Fluxo: homepage → backoffice

1. O visitante envia o formulário em `/`.
2. A server action `submitWaitlist` cria o usuário no Supabase Auth com
   `app_metadata.approval_status = "pending"` e insere em
   `waitlist_requests` (status `pending`).
3. O admin abre `/backoffice/requests` e vê a solicitação.
4. Ao clicar **Aprovar**, `approveSignupRequestAction` marca o usuário Auth
   como aprovado, cria/ativa o registro em `customers`, cria a assinatura
   inicial em `subscriptions`, atualiza a solicitação para `approved` e
   registra `waitlist.approve` em `admin_audit_logs`.
5. Se `RESEND_API_KEY` e `TRANSACTIONAL_EMAIL_FROM` estiverem configurados,
   o sistema envia automaticamente um email “Sua conta foi aprovada” com link
   para `/login`. Caso essas variáveis não existam, a aprovação continua
   funcionando e o evento fica registrado na auditoria como email não enviado.
6. Ao clicar **Reprovar**, idem com status `rejected` e ação
   `waitlist.reject`.

Também é possível cadastrar um cliente direto em `/backoffice/customers`. Esse
fluxo cria o usuário Auth, o registro em `customers` e a assinatura inicial sem
passar pela lista de espera.

## Fluxo: convites de editores

1. O usuário master (cliente pagante) convida um editor por e-mail (UI ainda
   não construída — será no app do autor).
2. O convite vai para `editor_invites` com `status = pending` e a permissão
   pedida (`viewer | commenter | editor`).
3. O admin abre `/backoffice/editors`, valida se o plano do master permite e
   aprova/reprova.
4. A permissão pode ser ajustada antes ou depois da aprovação no select da
   linha.
5. Quando aprovado, o RLS no Supabase aplicará viewer/commenter/editor sobre
   os documentos do master — a ser implementado.

## Tabelas Supabase

As tabelas usadas pelo backoffice são criadas pela migration oficial. Resumo
do contrato:

```sql
waitlist_requests: solicitações vindas da landing.
customers: clientes aprovados, com id vinculado a auth.users.id.
subscriptions: assinatura atual de cada cliente.
editor_invites: convites e permissões de editores.
admin_audit_logs: trilha de auditoria administrativa.
```

Enquanto as tabelas não existem, os services do backoffice retornam um erro
amigável (`Falha ao carregar`) e a UI segue navegável.

## Pontos de segurança

- Validação de credenciais **sempre** no servidor (`verifyAdminCredentials`).
- Cookie de sessão é httpOnly, sameSite=lax, secure em produção, com TTL
  curto (8h).
- Mensagem de erro do login é genérica: "Credenciais inválidas." — não
  diferenciamos e-mail e senha incorretos.
- Nada da senha é persistido no cliente (localStorage / sessionStorage /
  Zustand).
- Sessão também é verificada dentro do layout autenticado e nas server
  actions administrativas (não confiamos apenas no proxy).
- Toda ação administrativa de mutação registra entrada em
  `admin_audit_logs` (best-effort).

## Substituição futura

Este login local é temporário. Quando o Supabase Auth estiver pronto para
administração, a substituição é:

1. Criar `admin_users` (ou usar role `service_role` no Supabase Auth).
2. Trocar `verifyAdminCredentials` por `supabase.auth.signInWithPassword`.
3. Trocar `signSessionToken` por refresh/access tokens emitidos pelo
   próprio Supabase.

O restante do backoffice (services, actions, páginas, proxy) permanece
inalterado.
