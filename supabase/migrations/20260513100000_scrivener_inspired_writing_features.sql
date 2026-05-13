create extension if not exists pgcrypto;

alter type public.document_node_type add value if not exists 'document';

alter type public.document_status add value if not exists 'idea';
alter type public.document_status add value if not exists 'in_progress';
alter type public.document_status add value if not exists 'review';

alter table public.projects
  add column if not exists target_words integer check (target_words is null or target_words > 0);

alter table public.document_nodes
  add column if not exists synopsis text,
  add column if not exists pov text,
  add column if not exists location text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists archived_at timestamptz;

create index if not exists document_nodes_parent_order_idx
  on public.document_nodes (project_id, parent_id, order_index);

create index if not exists document_nodes_status_idx
  on public.document_nodes (status);

create table if not exists public.document_snapshots (
  id uuid primary key default gen_random_uuid(),
  document_node_id uuid not null references public.document_nodes(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.customers(id) on delete cascade,
  label text,
  title text not null,
  content_json jsonb,
  content_html text,
  plain_text text,
  word_count integer not null default 0 check (word_count >= 0),
  character_count integer not null default 0 check (character_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists document_snapshots_document_node_id_idx
  on public.document_snapshots (document_node_id, created_at desc);

create index if not exists document_snapshots_project_id_idx
  on public.document_snapshots (project_id, created_at desc);

create index if not exists document_snapshots_user_id_idx
  on public.document_snapshots (user_id, created_at desc);

create table if not exists public.writing_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.customers(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  document_node_id uuid references public.document_nodes(id) on delete cascade,
  target_words integer not null check (target_words > 0),
  target_type text not null default 'document',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint writing_targets_scope_check check (
    project_id is not null or document_node_id is not null
  )
);

create index if not exists writing_targets_user_id_idx
  on public.writing_targets (user_id);

create index if not exists writing_targets_project_id_idx
  on public.writing_targets (project_id);

create index if not exists writing_targets_document_node_id_idx
  on public.writing_targets (document_node_id);

drop trigger if exists writing_targets_set_updated_at on public.writing_targets;
create trigger writing_targets_set_updated_at
before update on public.writing_targets
for each row execute function public.set_updated_at();

create table if not exists public.project_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.customers(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  unique (project_id, name)
);

create index if not exists project_tags_project_id_idx
  on public.project_tags (project_id);

alter table public.document_snapshots enable row level security;
alter table public.writing_targets enable row level security;
alter table public.project_tags enable row level security;

grant all on table public.document_snapshots to service_role;
grant all on table public.writing_targets to service_role;
grant all on table public.project_tags to service_role;

grant select, insert, delete on table public.document_snapshots to authenticated;
grant select, insert, update, delete on table public.writing_targets to authenticated;
grant select, insert, update, delete on table public.project_tags to authenticated;

drop policy if exists "Users can select own snapshots" on public.document_snapshots;
create policy "Users can select own snapshots"
on public.document_snapshots
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own snapshots" on public.document_snapshots;
create policy "Users can insert own snapshots"
on public.document_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own snapshots" on public.document_snapshots;
create policy "Users can delete own snapshots"
on public.document_snapshots
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can select own writing targets" on public.writing_targets;
create policy "Users can select own writing targets"
on public.writing_targets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own writing targets" on public.writing_targets;
create policy "Users can insert own writing targets"
on public.writing_targets
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own writing targets" on public.writing_targets;
create policy "Users can update own writing targets"
on public.writing_targets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own writing targets" on public.writing_targets;
create policy "Users can delete own writing targets"
on public.writing_targets
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can select own project tags" on public.project_tags;
create policy "Users can select own project tags"
on public.project_tags
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own project tags" on public.project_tags;
create policy "Users can insert own project tags"
on public.project_tags
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own project tags" on public.project_tags;
create policy "Users can update own project tags"
on public.project_tags
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own project tags" on public.project_tags;
create policy "Users can delete own project tags"
on public.project_tags
for delete
to authenticated
using (auth.uid() = user_id);
