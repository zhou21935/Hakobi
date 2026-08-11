alter table public.member_profiles
  add column display_name text not null default '會員',
  add constraint member_profiles_display_name_length
    check (char_length(display_name) between 2 and 30),
  add constraint member_profiles_display_name_format
    check (display_name ~ '^[A-Za-z0-9一-龥]+$');

alter table public.member_profiles
  alter column display_name set default '會員';

create policy "owners update profile"
on public.member_profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant update (username, username_normalized, display_name)
on public.member_profiles to authenticated;
