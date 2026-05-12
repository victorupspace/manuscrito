-- ─────────────────────────────────────────────────────────────────────────────
-- Suporte ao fluxo de redefinição de senha do usuário comum (escritor).
--
-- Esta migração é IDEMPOTENTE e SEGURA para rodar mais de uma vez. Ela:
--
--   1. Garante que a tabela `customers` aceite SELECT/UPDATE do próprio
--      usuário via RLS (necessário para que, futuramente, o escritor possa
--      atualizar o próprio perfil — leitura já existia, falta apenas o
--      update controlado de campos não-sensíveis).
--
--   2. Cria uma função utilitária `public.revoke_user_sessions(uuid)` que
--      remove todas as sessões/refresh tokens de um usuário no `auth`. É
--      usada por gatilhos administrativos do backoffice (ex.: ao mover
--      `customers.status` para `suspended`/`removed`), mas também pode ser
--      invocada manualmente após uma redefinição de senha forçada.
--
--   3. Cria um trigger em `public.customers` que, sempre que `status` mudar
--      para `suspended` ou `removed`, encerra todas as sessões ativas do
--      usuário no Supabase Auth — evita que sessões antigas sigam válidas
--      após o backoffice bloquear o acesso.
--
-- Observações
-- ───────────
-- - O fluxo PKCE de reset (Supabase Auth → email → /reset-password?code=…)
--   NÃO depende de tabelas em `public`. Toda a parte de tokens e templates
--   é configurada no painel do Supabase (Auth → URL Configuration / Email
--   Templates) — ver instruções abaixo no arquivo
--   `supabase/auth.config.notes.md` (gerado em paralelo).
-- - Esta migração assume que `20260512120000_backoffice_core.sql` já rodou
--   (tabela `customers` existe com enum `customer_status`).
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. RLS — usuário pode atualizar o próprio perfil (campos não-sensíveis).
do $$
begin
  -- A policy de SELECT já foi criada em backoffice_core. Reaproveitamos.
  if not exists (
    select 1
      from pg_policies
     where schemaname = 'public'
       and tablename  = 'customers'
       and policyname = 'Customers can update own profile'
  ) then
    create policy "Customers can update own profile"
      on public.customers
      for update
      to authenticated
      using (auth.uid() = id)
      with check (
        auth.uid() = id
        -- Bloqueia auto-promoção: status, plan e email só podem ser alterados
        -- pelo service_role (backoffice). O usuário só pode mexer em campos
        -- "operacionais" do perfil — nome e telefone.
        and status = (select status from public.customers where id = auth.uid())
        and plan   is not distinct from (select plan from public.customers where id = auth.uid())
        and email  = (select email  from public.customers where id = auth.uid())
      );
  end if;
end $$;

grant update (full_name, phone) on table public.customers to authenticated;


-- 2. Função utilitária — remove sessões/refresh tokens de um usuário.
create or replace function public.revoke_user_sessions(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Refresh tokens (auth.refresh_tokens) ficam atrelados ao user_id como text.
  delete from auth.refresh_tokens
   where user_id = target_user_id::text;

  -- Sessions (auth.sessions) — disponível a partir do GoTrue moderno.
  delete from auth.sessions
   where user_id = target_user_id;
end;
$$;

revoke all on function public.revoke_user_sessions(uuid) from public, anon, authenticated;
grant execute on function public.revoke_user_sessions(uuid) to service_role;


-- 3. Trigger — encerra sessões quando o status sai de `active`.
create or replace function public.customers_after_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and new.status is distinct from old.status
     and new.status in ('suspended', 'removed') then
    perform public.revoke_user_sessions(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists customers_revoke_sessions_on_block on public.customers;
create trigger customers_revoke_sessions_on_block
after update of status on public.customers
for each row execute function public.customers_after_status_change();
