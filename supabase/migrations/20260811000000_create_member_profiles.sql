create table public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  username_normalized text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint member_profiles_username_length check (char_length(username) between 3 and 20),
  constraint member_profiles_username_format check (username ~ '^[A-Za-z0-9_一-龥]+$'),
  constraint member_profiles_username_normalized check (username_normalized = lower(btrim(username)))
);

create trigger member_profiles_set_updated_at
before update on public.member_profiles
for each row execute function public.set_updated_at();

alter table public.member_profiles enable row level security;

create policy "owners select profile"
on public.member_profiles for select to authenticated
using ((select auth.uid()) = user_id);

grant select on public.member_profiles to authenticated;

create function public.is_username_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    char_length(btrim(candidate)) between 3 and 20
    and btrim(candidate) ~ '^[A-Za-z0-9_一-龥]+$'
    and not exists (
      select 1 from public.member_profiles
      where username_normalized = lower(btrim(candidate))
    );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;

create function public.create_member_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  display_name text := btrim(new.raw_user_meta_data ->> 'username');
begin
  if display_name is null
    or char_length(display_name) not between 3 and 20
    or display_name !~ '^[A-Za-z0-9_一-龥]+$'
  then
    raise exception using errcode = '22023', message = 'invalid member username';
  end if;

  insert into public.member_profiles (user_id, username, username_normalized)
  values (new.id, display_name, lower(display_name));
  return new;
end;
$$;

revoke all on function public.create_member_profile_for_auth_user() from public, anon, authenticated;
grant execute on function public.create_member_profile_for_auth_user() to supabase_auth_admin;

insert into public.member_profiles (user_id, username, username_normalized)
select
  id,
  case
    when clean_name = '' then 'user_' || substring(id::text, 1, 8)
    else substring(clean_name, 1, 11) || '_' || substring(id::text, 1, 8)
  end,
  case
    when clean_name = '' then 'user_' || substring(id::text, 1, 8)
    else substring(clean_name, 1, 11) || '_' || substring(id::text, 1, 8)
  end
from (
  select id, regexp_replace(lower(split_part(coalesce(email, 'user'), '@', 1)), '[^a-z0-9_]', '', 'g') as clean_name
  from auth.users
) existing_users
on conflict (user_id) do nothing;

do $$
begin
  if exists (
    select 1
    from auth.users auth_user
    left join public.member_profiles profile on profile.user_id = auth_user.id
    where profile.user_id is null
  ) then
    raise exception 'existing auth user without a member profile';
  end if;
end;
$$;

create trigger auth_user_create_profile
after insert on auth.users
for each row execute function public.create_member_profile_for_auth_user();
