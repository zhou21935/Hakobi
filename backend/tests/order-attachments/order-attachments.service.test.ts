import { describe, expect, it, vi } from 'vitest'
import { OrderAttachmentsService } from '../../src/modules/order-attachments/order-attachments.service.js'

const row = {
  id: '00000000-0000-4000-8000-000000000010',
  order_id: '00000000-0000-4000-8000-000000000020',
  user_id: '00000000-0000-4000-8000-000000000001',
  storage_path: 'private/path',
  original_name: 'receipt.pdf',
  mime_type: 'application/pdf',
  size_bytes: 4,
  created_at: new Date('2026-08-13T12:00:00.000Z')
}

const fixture = (owned = true) => {
  const repository = {
    ownsOrder: vi.fn().mockResolvedValue(owned),
    list: vi.fn().mockResolvedValue([row]),
    find: vi.fn().mockResolvedValue(row),
    insert: vi.fn().mockResolvedValue(row),
    delete: vi.fn().mockResolvedValue(true)
  }
  const storage = {
    upload: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    createSignedUrl: vi.fn().mockResolvedValue('https://signed.example.test/file')
  }
  return { repository, storage, service: new OrderAttachmentsService(repository, storage, () => row.id) }
}

describe('OrderAttachmentsService ownership and public shape', () => {
  it('checks ownership, generates the trusted path, and excludes internal fields', async () => {
    const { service, repository, storage } = fixture()
    const attachment = await service.upload(row.order_id, row.user_id, {
      name: row.original_name,
      mimeType: row.mime_type,
      size: row.size_bytes,
      bytes: Buffer.from('test')
    })

    expect(repository.ownsOrder).toHaveBeenCalledWith(row.order_id, row.user_id)
    expect(storage.upload).toHaveBeenCalledWith(`${row.user_id}/${row.order_id}/${row.id}`, expect.any(Buffer), row.mime_type)
    expect(repository.insert).toHaveBeenCalledWith(expect.objectContaining({ storagePath: `${row.user_id}/${row.order_id}/${row.id}` }))
    expect(attachment).toEqual({ id: row.id, orderId: row.order_id, name: row.original_name, mimeType: row.mime_type, size: row.size_bytes, createdAt: row.created_at.toISOString() })
    expect(attachment).not.toHaveProperty('storagePath')
    expect(attachment).not.toHaveProperty('userId')
  })

  it('conceals a non-owned order as the same resource 404 before storage access', async () => {
    const { service, storage } = fixture(false)
    await expect(service.list(row.order_id, '00000000-0000-4000-8000-000000000002')).rejects.toMatchObject({ statusCode: 404, code: 'RESOURCE_NOT_FOUND' })
    expect(storage.upload).not.toHaveBeenCalled()
    expect(storage.remove).not.toHaveBeenCalled()
    expect(storage.createSignedUrl).not.toHaveBeenCalled()
  })
})

describe('OrderAttachmentsService compensation', () => {
  it('removes the uploaded object when metadata insertion fails', async () => {
    const { service, repository, storage } = fixture()
    repository.insert.mockRejectedValueOnce(new Error('metadata failed'))

    await expect(service.upload(row.order_id, row.user_id, { name: row.original_name, mimeType: row.mime_type, size: 4, bytes: Buffer.from('test') })).rejects.toThrow('metadata failed')

    expect(storage.remove).toHaveBeenCalledWith(`${row.user_id}/${row.order_id}/${row.id}`)
  })

  it('maps the database concurrency guard to the stable count-limit error and compensates storage', async () => {
    const { service, repository, storage } = fixture()
    repository.insert.mockRejectedValueOnce(Object.assign(new Error('attachment limit reached'), { code: '23514' }))

    await expect(service.upload(row.order_id, row.user_id, { name: row.original_name, mimeType: row.mime_type, size: 4, bytes: Buffer.from('test') })).rejects.toMatchObject({ statusCode: 409, code: 'ATTACHMENT_LIMIT_REACHED' })
    expect(storage.remove).toHaveBeenCalledWith(`${row.user_id}/${row.order_id}/${row.id}`)
  })

  it('retains metadata when storage deletion fails', async () => {
    const { service, repository, storage } = fixture()
    storage.remove.mockRejectedValueOnce(new Error('storage failed'))

    await expect(service.delete(row.order_id, row.id, row.user_id)).rejects.toThrow('storage failed')

    expect(repository.delete).not.toHaveBeenCalled()
  })

  it('removes every storage object before an owned order is deleted', async () => {
    const second = { ...row, id: '00000000-0000-4000-8000-000000000011', storage_path: 'private/second' }
    const { service, repository, storage } = fixture()
    repository.list.mockResolvedValueOnce([row, second])

    await service.removeAllForOrder(row.order_id, row.user_id)

    expect(storage.remove.mock.calls).toEqual([[row.storage_path], [second.storage_path]])
  })
})
