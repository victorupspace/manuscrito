create extension if not exists pgcrypto;

do $$
begin
  create type public.waitlist_request_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.customer_status as enum ('active', 'suspended', 'removed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_plan as enum ('free', 'solo', 'studio', 'atelier');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_status as enum ('active', 'trialing', 'canceled', 'past_due');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.editor_permission as enum ('viewer', 'commenter', 'editor');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.editor_invite_status as enum ('pending', 'approved', 'rejected', 'revoked');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.waitlist_requests (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  status public.waitlist_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by text,
  metadata jsonb not null default '{}'::jsonb,
  constraint waitlist_requests_email_unique unique (email),
  constraint waitlist_requests_email_lowercase check (email = lower(email))
);

create index if not exists waitlist_requests_status_created_at_idx
  on public.waitlist_requests (status, created_at desc);

create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  status public.customer_status not null default 'active',
  plan public.subscription_plan default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_email_unique unique (email),
  constraint customers_email_lowercase check (email = lower(email))
);

create index if not exists customers_status_created_at_idx
  on public.customers (status, created_at desc);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  customer_email text not null,
  customer_name text not null,
  plan public.subscription_plan not null default 'free',
  status public.subscription_status not null default 'trialing',
  started_at timestamptz not null default now(),
  renews_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint subscriptions_customer_id_unique unique (customer_id),
  constraint subscriptions_customer_email_lowercase check (customer_email = lower(customer_email))
);

create index if not exists subscriptions_status_started_at_idx
  on public.subscriptions (status, started_at desc);

create table if not exists public.editor_invites (
  id uuid primary key default gen_random_uuid(),
  master_user_id uuid not null references public.customers(id) on delete cascade,
  master_user_name text not null,
  master_user_email text not null,
  editor_email text not null,
  permission public.editor_permission not null default 'viewer',
  status public.editor_invite_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint editor_invites_master_editor_unique unique (master_user_id, editor_email),
  constraint editor_invites_master_email_lowercase check (master_user_email = lower(master_user_email)),
  constraint editor_invites_editor_email_lowercase check (editor_email = lower(editor_email))
);

create index if not exists editor_invites_status_created_at_idx
  on public.editor_invites (status, created_at desc);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action text not null,
  target_type text,
  target_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.waitlist_requests enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.editor_invites enable row level security;
alter table public.admin_audit_logs enable row level security;

grant usage on schema public to anon, authenticated, service_role;

grant all on table public.waitlist_requests to service_role;
grant all on table public.customers to service_role;
grant all on table public.subscriptions to service_role;
grant all on table public.editor_invites to service_role;
grant all on table public.admin_audit_logs to service_role;

grant select on table public.customers to authenticated;
grant select on table public.subscriptions to authenticated;
grant select on table public.editor_invites to authenticated;

drop policy if exists "Customers can read own profile" on public.customers;
create policy "Customers can read own profile"
on public.customers
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Customers can read own subscriptions" on public.subscriptions;
create policy "Customers can read own subscriptions"
on public.subscriptions
for select
to authenticated
using (auth.uid() = customer_id);

drop policy if exists "Customers can read own editor invites" on public.editor_invites;
create policy "Customers can read own editor invites"
on public.editor_invites
for select
to authenticated
using (auth.uid() = master_user_id);
