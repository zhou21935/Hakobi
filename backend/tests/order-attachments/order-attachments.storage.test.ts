import { describe, expect, it, vi } from 'vitest'
import { SupabaseAttachmentStorage } from '../../src/modules/order-attachments/order-attachments.storage.js'

describe('SupabaseAttachmentStorage', () => {
  it('is the single adapter for private bucket upload, removal, and signed URLs', async () => {
    const bucket = {
      upload: vi.fn().mockResolvedValue({ error: null }),
      remove: vi.fn().mockResolvedValue({ error: null }),
      createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://signed.example.test/file' }, error: null })
    }
    const from = vi.fn().mockReturnValue(bucket)
    const storage = new SupabaseAttachmentStorage({ storage: { from } })

    await storage.upload('trusted/path', Buffer.from('pdf'), 'application/pdf')
    await storage.remove('trusted/path')
    await expect(storage.createSignedUrl('trusted/path')).resolves.toBe('https://signed.example.test/file')

    expect(from).toHaveBeenCalledWith('order-attachments')
    expect(bucket.upload).toHaveBeenCalledWith('trusted/path', expect.any(Buffer), { contentType: 'application/pdf', upsert: false })
    expect(bucket.remove).toHaveBeenCalledWith(['trusted/path'])
    expect(bucket.createSignedUrl).toHaveBeenCalledWith('trusted/path', 60)
  })
})
