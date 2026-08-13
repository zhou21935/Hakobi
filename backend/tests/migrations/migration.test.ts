import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = (name: string) =>
  readFileSync(resolve(import.meta.dirname, `../../../supabase/migrations/${name}`), 'utf8').toLowerCase()

describe('migration', () => {
  it('has schema security contract', () => {
    const sql = migration('20260730000000_create_orders.sql')
    expect(sql).toContain('references auth.users(id) on delete cascade')
    expect(sql).toContain('(user_id, created_at desc)')
    expect(sql).toContain('create trigger')
    expect(sql).toContain('enable row level security')
    expect(sql.match(/create policy/g)).toHaveLength(4)
    expect(sql.match(/auth\.uid\(\)/g)?.length).toBeGreaterThanOrEqual(4)
  })

  it('removes only legacy payment detail columns in a forward migration', () => {
    const original = migration('20260730000000_create_orders.sql')
    const sql = migration('20260806000100_remove_order_payment_detail_fields.sql')

    expect(original).toContain('balance_due')
    expect(original).toContain('payment_due_date')
    expect(sql).toContain('alter table public.orders')
    expect(sql).toContain('drop column balance_due')
    expect(sql).toContain('drop column payment_due_date')
    expect(sql).not.toMatch(/drop column (amount|currency|is_paid)/)
    expect(sql.match(/drop column/g)).toHaveLength(2)
  })

  it('creates member profiles with validated normalized uniqueness and owner-only reads', () => {
    const sql = migration('20260811000000_create_member_profiles.sql')

    expect(sql).toContain('create table public.member_profiles')
    expect(sql).toContain('references auth.users(id) on delete cascade')
    expect(sql).toContain('username_normalized text not null unique')
    expect(sql).toContain('char_length(username) between 3 and 20')
    expect(sql).toContain("username ~ '^[a-za-z0-9_一-龥]+$'")
    expect(sql).toContain('username_normalized = lower(btrim(username))')
    expect(sql).toContain('enable row level security')
    expect(sql).toContain('create policy "owners select profile"')
    expect(sql).toContain('using ((select auth.uid()) = user_id)')
    expect(sql).toContain('grant select on public.member_profiles to authenticated')
    expect(sql).not.toMatch(/grant (insert|update|delete|all).*member_profiles/)
  })

  it('exposes only a boolean availability rpc and keeps the unique key as the concurrent-registration arbiter', () => {
    const sql = migration('20260811000000_create_member_profiles.sql')

    expect(sql).toContain('create function public.is_username_available')
    expect(sql).toContain('returns boolean')
    expect(sql).toContain('where username_normalized = lower(btrim(candidate))')
    expect(sql).toContain('grant execute on function public.is_username_available(text) to anon, authenticated')
    expect(sql).not.toMatch(/on conflict \(username_normalized\) do (nothing|update)/)
    expect(sql).toContain('revoke all on function public.is_username_available(text) from public')
  })

  it('creates profiles atomically from validated auth metadata without swallowing username conflicts', () => {
    const sql = migration('20260811000000_create_member_profiles.sql')
    const triggerFunction = sql.slice(
      sql.indexOf('create function public.create_member_profile_for_auth_user()'),
      sql.indexOf('revoke all on function public.create_member_profile_for_auth_user()')
    )

    expect(sql).toContain('create trigger auth_user_create_profile')
    expect(sql).toContain('raw_user_meta_data')
    expect(sql).toContain("raise exception using errcode = '22023'")
    expect(sql).toContain('values (new.id, display_name, lower(display_name))')
    expect(triggerFunction).not.toContain('on conflict')
    expect(sql).toContain('revoke all on function public.create_member_profile_for_auth_user() from public, anon, authenticated')
  })

  it('deterministically backfills every existing auth user and asserts that no orphan remains', () => {
    const sql = migration('20260811000000_create_member_profiles.sql')

    expect(sql).toContain('on conflict (user_id) do nothing')
    expect(sql).toContain("substring(id::text, 1, 8)")
    expect(sql).toContain("raise exception 'existing auth user without a member profile'")
  })

  it('adds a required constrained display name with a valid deterministic backfill', () => {
    const sql = migration('20260812000000_add_member_profile_display_name.sql')

    expect(sql).toContain("add column display_name text not null default '會員'")
    expect(sql).toContain('char_length(display_name) between 2 and 30')
    expect(sql).toContain("display_name ~ '^[a-za-z0-9一-龥]+$'")
    expect(sql).toContain("alter column display_name set default '會員'")
    expect(sql).not.toMatch(/display_name\s+(text\s+)?null/)
  })

  it('allows only owner-scoped profile updates without opening insert or delete', () => {
    const sql = migration('20260812000000_add_member_profile_display_name.sql')

    expect(sql).toContain('create policy "owners update profile"')
    expect(sql).toContain('for update to authenticated')
    expect(sql).toContain('using ((select auth.uid()) = user_id)')
    expect(sql).toContain('with check ((select auth.uid()) = user_id)')
    expect(sql).toMatch(/grant update \(username, username_normalized, display_name\)\s+on public\.member_profiles to authenticated/)
    expect(sql).not.toMatch(/grant (insert|delete|all).*member_profiles/)

    const original = migration('20260811000000_create_member_profiles.sql')
    expect(original).toContain('username_normalized text not null unique')
  })

  it('persists order numbers, optional product categories, and private owned attachments', () => {
    const sql = migration('20260813000000_persist_order_number_and_attachments.sql')

    expect(sql).toContain("add column order_number text not null default ''")
    expect(sql).toContain("alter column product_categories set default '{}'")
    expect(sql).not.toContain('cardinality(product_categories) > 0')
    expect(sql).toContain('create table public.order_attachments')
    expect(sql).toContain('references public.orders(id) on delete cascade')
    expect(sql).toContain('size_bytes between 1 and 10485760')
    expect(sql).toContain("mime_type in ('application/pdf', 'image/jpeg', 'image/png')")
    expect(sql).toContain('create trigger enforce_order_attachment_limit')
    expect(sql).toContain('for update')
    expect(sql).toContain("insert into storage.buckets (id, name, public)")
    expect(sql).toContain("values ('order-attachments', 'order-attachments', false)")
    expect(sql).toContain('enable row level security')
    expect(sql.match(/create policy .*order attachments/g)?.length).toBeGreaterThanOrEqual(4)
  })
})
