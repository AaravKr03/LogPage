-- V1YKsBuilds: one-time database setup.
-- Supabase Dashboard -> SQL Editor -> New query -> paste ALL of this -> Run.
-- Passwords are handled entirely by Supabase Auth (auth.users). Nothing here stores them.

create schema if not exists private;  -- not exposed through the Data API

-- 1) Profiles: one row per registered user (holds the username) --------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

alter table public.profiles enable row level security;

-- Signed-in users may read only their own row. No writes from the browser.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- Creates the profile row automatically when someone registers.
-- (The username is only copied for display; never use user_metadata for authorization.)
create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'));
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- 2) Contracts: the list shown after login ---------------------------------------
create table public.contracts (
  id bigint generated always as identity primary key,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint contracts_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

alter table public.contracts enable row level security;

-- Any signed-in user may READ the list (intentional: using (true)).
-- Nobody can insert/update/delete from the app; you manage rows in the dashboard.
revoke all on public.contracts from anon, authenticated;
grant select on public.contracts to authenticated;

create policy "contracts_select_authenticated" on public.contracts
  for select to authenticated
  using (true);

-- Add people to the list afterwards (run separately, with real usernames):
-- insert into public.contracts (username) values ('your_username'), ('another_user');
