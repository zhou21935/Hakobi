alter table public.orders
  add column order_number text not null default '';

alter table public.orders
  drop constraint if exists orders_product_categories_check;

alter table public.orders
  alter column product_categories set default '{}';

alter table public.orders
  add constraint orders_product_categories_check
  check (product_categories <@ array['merch', 'book', 'other']::text[]);

create table public.order_attachments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique check (length(btrim(storage_path)) > 0),
  original_name text not null check (char_length(original_name) between 1 and 255),
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  created_at timestamptz not null default now()
);

create index order_attachments_order_id_created_at_idx
  on public.order_attachments (order_id, created_at);
create index order_attachments_user_id_idx
  on public.order_attachments (user_id);

create function public.validate_order_attachment_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_id uuid;
  attachment_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.order_id::text, 0));

  select user_id into owner_id
  from public.orders
  where id = new.order_id;

  if owner_id is null or owner_id <> new.user_id then
    raise exception 'attachment owner does not own order' using errcode = '23514';
  end if;

  select count(*) into attachment_count
  from public.order_attachments
  where order_id = new.order_id;

  if attachment_count >= 10 then
    raise exception 'attachment limit reached' using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger enforce_order_attachment_limit
before insert or update on public.order_attachments
for each row execute function public.validate_order_attachment_insert();

alter table public.order_attachments enable row level security;

create policy "owners select order attachments"
on public.order_attachments for select to authenticated
using ((select auth.uid()) = user_id);

create policy "owners insert order attachments"
on public.order_attachments for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "owners update order attachments"
on public.order_attachments for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "owners delete order attachments"
on public.order_attachments for delete to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.order_attachments to authenticated;

insert into storage.buckets (id, name, public)
values ('order-attachments', 'order-attachments', false)
on conflict (id) do update set public = excluded.public;

revoke all on function public.validate_order_attachment_insert() from public, anon, authenticated;
