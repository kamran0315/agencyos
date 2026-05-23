-- AgencyOS initial schema
-- Run this in Supabase SQL editor (or via `supabase db push`)

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- =========================================================
-- USERS (extends auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'admin' check (role in ('admin','member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- CLIENTS
-- =========================================================
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  company text,
  email text,
  phone text,
  fiverr_url text,
  upwork_url text,
  website text,
  notes text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clients_owner_idx on public.clients(owner_id);
create index if not exists clients_name_trgm on public.clients using gin (name gin_trgm_ops);

-- =========================================================
-- PROJECTS
-- =========================================================
do $$ begin
  create type project_status as enum (
    'discussion','in_progress','waiting_client','revision','completed','cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type priority_level as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  status project_status not null default 'discussion',
  priority priority_level not null default 'medium',
  budget numeric(12,2),
  deadline date,
  progress int not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists projects_client_idx on public.projects(client_id);
create index if not exists projects_status_idx on public.projects(status);

-- =========================================================
-- TASKS
-- =========================================================
do $$ begin
  create type task_status as enum ('todo','in_progress','review','done');
exception when duplicate_object then null; end $$;

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  assignee_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority priority_level not null default 'medium',
  due_date date,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists tasks_status_idx on public.tasks(status);

create table if not exists public.task_comments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- NOTES
-- =========================================================
do $$ begin
  create type note_category as enum (
    'requirement','revision','hosting','credential','meeting','internal'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  body text,
  category note_category not null default 'internal',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_owner_idx on public.notes(owner_id);
create index if not exists notes_project_idx on public.notes(project_id);

-- =========================================================
-- PROPOSALS
-- =========================================================
do $$ begin
  create type proposal_category as enum (
    'upwork','fiverr','discovery','onboarding','followup'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.proposals (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  category proposal_category not null default 'upwork',
  tags text[] not null default '{}',
  use_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists proposals_owner_idx on public.proposals(owner_id);
create index if not exists proposals_category_idx on public.proposals(category);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
do $$ begin
  create type notification_type as enum (
    'deadline','task_assigned','status_change','project_update','client_message'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_unread_idx
  on public.notifications(user_id, read);

-- =========================================================
-- FILES (metadata; binary stored in Supabase Storage)
-- =========================================================
create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);
create index if not exists files_owner_idx on public.files(owner_id);
create index if not exists files_project_idx on public.files(project_id);

-- =========================================================
-- TRIGGERS - updated_at
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  for t in
    select unnest(array['profiles','clients','projects','tasks','notes','proposals'])
  loop
    execute format('drop trigger if exists set_%I_updated on public.%I', t, t);
    execute format(
      'create trigger set_%I_updated before update on public.%I
       for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- =========================================================
-- ROW LEVEL SECURITY (owner-scoped)
-- =========================================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.notes enable row level security;
alter table public.proposals enable row level security;
alter table public.notifications enable row level security;
alter table public.files enable row level security;

drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "owned_clients" on public.clients;
create policy "owned_clients" on public.clients
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "owned_projects" on public.projects;
create policy "owned_projects" on public.projects
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "owned_tasks" on public.tasks;
create policy "owned_tasks" on public.tasks
  for all using (
    exists (select 1 from public.projects p
            where p.id = tasks.project_id and p.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.projects p
            where p.id = tasks.project_id and p.owner_id = auth.uid())
  );

drop policy if exists "owned_task_comments" on public.task_comments;
create policy "owned_task_comments" on public.task_comments
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

drop policy if exists "owned_notes" on public.notes;
create policy "owned_notes" on public.notes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "owned_proposals" on public.proposals;
create policy "owned_proposals" on public.proposals
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "owned_notifications" on public.notifications;
create policy "owned_notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "owned_files" on public.files;
create policy "owned_files" on public.files
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- =========================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
