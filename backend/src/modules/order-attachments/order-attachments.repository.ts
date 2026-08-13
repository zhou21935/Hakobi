import type { Pool } from 'pg'
import type { AttachmentRow } from './order-attachments.mapper.js'

export type NewAttachment = {
  id: string
  orderId: string
  userId: string
  storagePath: string
  name: string
  mimeType: string
  size: number
}

export class OrderAttachmentsRepository {
  constructor(private db: Pick<Pool, 'query'>) {}

  async ownsOrder(orderId: string, userId: string) {
    const result = await this.db.query('SELECT 1 FROM public.orders WHERE id = $1 AND user_id = $2', [orderId, userId])
    return (result.rowCount ?? 0) > 0
  }

  async list(orderId: string, userId: string) {
    const result = await this.db.query<AttachmentRow>('SELECT * FROM public.order_attachments WHERE order_id = $1 AND user_id = $2 ORDER BY created_at ASC', [orderId, userId])
    return result.rows
  }

  async find(orderId: string, attachmentId: string, userId: string) {
    const result = await this.db.query<AttachmentRow>('SELECT * FROM public.order_attachments WHERE id = $1 AND order_id = $2 AND user_id = $3', [attachmentId, orderId, userId])
    return result.rows[0] ?? null
  }

  async insert(input: NewAttachment) {
    const result = await this.db.query<AttachmentRow>(
      'INSERT INTO public.order_attachments (id, order_id, user_id, storage_path, original_name, mime_type, size_bytes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [input.id, input.orderId, input.userId, input.storagePath, input.name, input.mimeType, input.size]
    )
    return result.rows[0]
  }

  async delete(attachmentId: string, orderId: string, userId: string) {
    const result = await this.db.query('DELETE FROM public.order_attachments WHERE id = $1 AND order_id = $2 AND user_id = $3', [attachmentId, orderId, userId])
    return (result.rowCount ?? 0) > 0
  }
}
