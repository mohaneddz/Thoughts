-- Thoughts schema (mock-first foundation)
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key,
  email text not null unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null,
  estimated_minutes int not null,
  depth text not null,
  tone text not null,
  questions_json jsonb not null,
  scoring_json jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  test_id uuid not null references public.tests(id) on delete cascade,
  answers_json jsonb not null,
  scores_json jsonb not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_interpretations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  result_id uuid not null references public.test_results(id) on delete cascade,
  mode text not null,
  prompt text not null,
  response text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mood int not null,
  stress int not null,
  energy int not null,
  sleep int not null,
  focus int not null,
  motivation int not null,
  social_battery int not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_thoughts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  source_type text not null,
  source_id uuid,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.test_results enable row level security;
alter table public.ai_interpretations enable row level security;
alter table public.check_ins enable row level security;
alter table public.saved_thoughts enable row level security;
alter table public.tests enable row level security;

create policy if not exists "profiles own read" on public.profiles
for select using (auth.uid() = id);
create policy if not exists "profiles own write" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists "tests public read" on public.tests
for select using (true);

create policy if not exists "test_results own access" on public.test_results
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "ai_interpretations own access" on public.ai_interpretations
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "check_ins own access" on public.check_ins
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "saved_thoughts own access" on public.saved_thoughts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

