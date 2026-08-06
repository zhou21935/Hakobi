import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = (name: string) =>
  readFileSync(resolve(import.meta.dirname, `../../supabase/migrations/${name}`), 'utf8').toLowerCase()

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
})
