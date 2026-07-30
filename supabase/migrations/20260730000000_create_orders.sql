create extension if not exists pgcrypto;
create table public.orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 category text not null check (category in ('agent','parcel')), name text not null check (length(btrim(name)) > 0),
 platform text not null default '', product_url text not null default '',
 status text not null default 'AWAITING_SHIPMENT' check (status in ('AWAITING_SHIPMENT','CONSOLIDATING','IN_TRANSIT','ARRIVED','COMPLETED')),
 amount numeric(14,2) not null check (amount > 0), currency text not null default 'TWD' check (currency in ('TWD','USD','KRW','JPY')),
 is_paid boolean not null default false, balance_due numeric(14,2) not null default 0 check (balance_due >= 0),
 order_date date, payment_due_date date, estimated_ship_date date, estimated_arrival_date date, is_preorder boolean not null default false,
 product_categories text[] not null check (cardinality(product_categories) > 0 and product_categories <@ array['merch','book','other']::text[]),
 tracking_number text not null default '', shipping_method text not null default '', notes text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index orders_user_id_status_idx on public.orders (user_id, status);
create index orders_user_id_category_idx on public.orders (user_id, category);
create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
alter table public.orders enable row level security;
create policy "owners select orders" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "owners insert orders" on public.orders for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "owners update orders" on public.orders for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "owners delete orders" on public.orders for delete to authenticated using ((select auth.uid()) = user_id);
