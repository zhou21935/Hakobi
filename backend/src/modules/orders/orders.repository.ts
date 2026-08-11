import type { Pool } from 'pg'
import { toColumns, toOrder } from './orders.mapper.js'
import type { CreateOrder, PatchOrder } from './orders.schema.js'

export class OrdersRepository {
  constructor(private db: Pick<Pool, 'query'>) {}
  async list(userId: string) { const r = await this.db.query('SELECT * FROM public.orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]); return r.rows.map(toOrder) }
  async find(id: string, userId: string) { const r = await this.db.query('SELECT * FROM public.orders WHERE id = $1 AND user_id = $2', [id, userId]); return r.rows[0] ? toOrder(r.rows[0]) : null }
  async create(input: CreateOrder, userId: string) {
    const values = { user_id: userId, ...toColumns(input) }; const keys = Object.keys(values)
    const r = await this.db.query(`INSERT INTO public.orders (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`, Object.values(values))
    return toOrder(r.rows[0])
  }
  async update(id: string, userId: string, patch: PatchOrder) {
    const values = toColumns(patch); const keys = Object.keys(values); const params = Object.values(values)
    const set = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    const r = await this.db.query(`UPDATE public.orders SET ${set} WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING *`, [...params, id, userId])
    return r.rows[0] ? toOrder(r.rows[0]) : null
  }
  async delete(id: string, userId: string) { const r = await this.db.query('DELETE FROM public.orders WHERE id = $1 AND user_id = $2', [id, userId]); return (r.rowCount ?? 0) > 0 }
}
