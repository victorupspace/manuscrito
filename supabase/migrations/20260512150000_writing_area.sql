do $$
begin
  create type public.document_node_type as enum (
    'part',
    'chapter',
    'scene',
    'note',
    'research',
    'draft',
    'short_story_main'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.document_status as enum (
    'draft',
    'in_review',
    'completed',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.document_nodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.customers(id) on delete cascade,
  parent_id uuid references public.document_nodes(id) on delete cascade,
  type public.document_node_type not null default 'draft',
  title text not null,
  content_json jsonb,
  content_html text,
  plain_text text,
  summary text,
  order_index integer not null default 0,
  status public.document_status not null default 'draft',
  word_count integer not null default 0 check (word_count >= 0),
  character_count integer not null default 0 check (character_count >= 0),
  reading_time integer not null default 0 check (reading_time >= 0),
  target_words integer check (target_words is null or target_words > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_saved_at timestamptz,
  last_synced_at timestamptz
);

create index if not exists document_nodes_project_order_idx
  on public.document_nodes (project_id, order_index, created_at);

create index if not exists document_nodes_user_updated_at_idx
  on public.document_nodes (user_id, updated_at desc);

drop trigger if exists document_nodes_set_updated_at on public.document_nodes;
create trigger document_nodes_set_updated_at
before update on public.document_nodes
for each row execute function public.set_updated_at();

alter table public.document_nodes enable row level security;

grant all on table public.document_nodes to service_role;
grant select, insert, update, delete on table public.document_nodes to authenticated;

drop policy if exists "Users can read own document nodes" on public.document_nodes;
create policy "Users can read own document nodes"
on public.document_nodes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own document nodes" on public.document_nodes;
create policy "Users can create own document nodes"
on public.document_nodes
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
      from public.projects
     where projects.id = document_nodes.project_id
       and projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own document nodes" on public.document_nodes;
create policy "Users can update own document nodes"
on public.document_nodes
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
      from public.projects
     where projects.id = document_nodes.project_id
       and projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own document nodes" on public.document_nodes;
create policy "Users can delete own document nodes"
on public.document_nodes
for delete
to authenticated
using (auth.uid() = user_id);
