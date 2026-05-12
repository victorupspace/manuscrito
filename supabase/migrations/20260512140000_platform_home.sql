do $$
begin
  create type public.project_type as enum ('short_story', 'book', 'draft');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.project_status as enum ('active', 'paused', 'completed', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.customers(id) on delete cascade,
  type public.project_type not null,
  title text not null,
  description text,
  status public.project_status not null default 'active',
  word_count integer not null default 0 check (word_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_opened_at timestamptz
);

create index if not exists projects_user_status_updated_at_idx
  on public.projects (user_id, status, updated_at desc);

create index if not exists projects_user_type_updated_at_idx
  on public.projects (user_id, type, updated_at desc);

create table if not exists public.writing_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.customers(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists writing_tasks_user_completed_created_at_idx
  on public.writing_tasks (user_id, completed, created_at desc);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists writing_tasks_set_updated_at on public.writing_tasks;
create trigger writing_tasks_set_updated_at
before update on public.writing_tasks
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.writing_tasks enable row level security;

grant all on table public.projects to service_role;
grant all on table public.writing_tasks to service_role;

grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.writing_tasks to authenticated;

drop policy if exists "Users can read own projects" on public.projects;
create policy "Users can read own projects"
on public.projects
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own projects" on public.projects;
create policy "Users can create own projects"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own projects" on public.projects;
create policy "Users can update own projects"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects"
on public.projects
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own writing tasks" on public.writing_tasks;
create policy "Users can read own writing tasks"
on public.writing_tasks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own writing tasks" on public.writing_tasks;
create policy "Users can create own writing tasks"
on public.writing_tasks
for insert
to authenticated
with check (
  auth.uid() = user_id
  and (
    project_id is null
    or exists (
      select 1
        from public.projects
       where projects.id = writing_tasks.project_id
         and projects.user_id = auth.uid()
    )
  )
);

drop policy if exists "Users can update own writing tasks" on public.writing_tasks;
create policy "Users can update own writing tasks"
on public.writing_tasks
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    project_id is null
    or exists (
      select 1
        from public.projects
       where projects.id = writing_tasks.project_id
         and projects.user_id = auth.uid()
    )
  )
);

drop policy if exists "Users can delete own writing tasks" on public.writing_tasks;
create policy "Users can delete own writing tasks"
on public.writing_tasks
for delete
to authenticated
using (auth.uid() = user_id);
