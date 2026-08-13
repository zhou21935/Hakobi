export type AttachmentRow = {
  id: string
  order_id: string
  user_id: string
  storage_path: string
  original_name: string
  mime_type: string
  size_bytes: number
  created_at: string | Date
}

export const toAttachment = (row: AttachmentRow) => ({
  id: row.id,
  orderId: row.order_id,
  name: row.original_name,
  mimeType: row.mime_type,
  size: Number(row.size_bytes),
  createdAt: new Date(row.created_at).toISOString()
})
