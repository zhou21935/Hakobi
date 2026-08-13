import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppError, resourceNotFound } from '../../src/shared/errors.js'
import { orderAttachmentsRoutes } from '../../src/modules/order-attachments/order-attachments.routes.js'

const orderId = '00000000-0000-4000-8000-000000000020'
const attachmentId = '00000000-0000-4000-8000-000000000010'
const attachment = { id: attachmentId, orderId, name: 'receipt.pdf', mimeType: 'application/pdf', size: 4, createdAt: '2026-08-13T12:00:00.000Z' }
const apps: Array<ReturnType<typeof Fastify>> = []

const multipartBody = (content: Buffer, filename = 'receipt.pdf', mimeType = 'application/pdf') => {
  const boundary = '----hakobi-test-boundary'
  return {
    payload: Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
      content,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]),
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` }
  }
}

const fixture = async () => {
  const service = {
    list: vi.fn().mockResolvedValue([attachment]),
    upload: vi.fn().mockResolvedValue(attachment),
    download: vi.fn().mockResolvedValue('https://signed.example.test/file'),
    delete: vi.fn().mockResolvedValue(undefined)
  }
  const app = Fastify()
  apps.push(app)
  app.decorateRequest('userId', '')
  app.decorate('authenticate', async (request: { userId: string }) => { request.userId = '00000000-0000-4000-8000-000000000001' })
  app.setErrorHandler((error, _request, reply) => error instanceof AppError
    ? reply.code(error.statusCode).send({ error: { code: error.code, message: error.message } })
    : reply.code(500).send({ error: { code: 'INTERNAL_ERROR' } }))
  await app.register(multipart, { limits: { files: 1, fileSize: 10_485_760 } })
  await app.register(orderAttachmentsRoutes, { prefix: '/api/orders', service })
  return { app, service }
}

afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())))

describe('order attachment routes', () => {
  it('lists, uploads one file, redirects download, and deletes', async () => {
    const { app, service } = await fixture()
    expect((await app.inject({ method: 'GET', url: `/api/orders/${orderId}/attachments` })).json()).toEqual({ data: [attachment] })

    const upload = await app.inject({ method: 'POST', url: `/api/orders/${orderId}/attachments`, ...multipartBody(Buffer.from('test')) })
    expect(upload.statusCode).toBe(201)
    expect(upload.json()).toEqual({ data: attachment })
    expect(service.upload).toHaveBeenCalledWith(orderId, expect.any(String), expect.objectContaining({ name: 'receipt.pdf', mimeType: 'application/pdf', size: 4 }))

    const download = await app.inject({ method: 'GET', url: `/api/orders/${orderId}/attachments/${attachmentId}/download` })
    expect(download.statusCode).toBe(302)
    expect(download.headers.location).toBe('https://signed.example.test/file')
    expect((await app.inject({ method: 'DELETE', url: `/api/orders/${orderId}/attachments/${attachmentId}` })).statusCode).toBe(204)
  })

  it('returns stable errors for unsupported, empty, oversized, and count-limited uploads', async () => {
    const { app, service } = await fixture()
    const unsupported = await app.inject({ method: 'POST', url: `/api/orders/${orderId}/attachments`, ...multipartBody(Buffer.from('text'), 'notes.txt', 'text/plain') })
    expect(unsupported.statusCode).toBe(400)
    expect(unsupported.json().error.code).toBe('ATTACHMENT_TYPE_NOT_ALLOWED')

    const empty = await app.inject({ method: 'POST', url: `/api/orders/${orderId}/attachments`, ...multipartBody(Buffer.alloc(0)) })
    expect(empty.statusCode).toBe(400)
    expect(empty.json().error.code).toBe('VALIDATION_ERROR')

    const oversized = await app.inject({ method: 'POST', url: `/api/orders/${orderId}/attachments`, ...multipartBody(Buffer.alloc(10_485_761)) })
    expect(oversized.statusCode).toBe(413)
    expect(oversized.json().error.code).toBe('ATTACHMENT_TOO_LARGE')

    service.upload.mockRejectedValueOnce(new AppError(409, 'ATTACHMENT_LIMIT_REACHED', 'Attachment limit reached'))
    const limited = await app.inject({ method: 'POST', url: `/api/orders/${orderId}/attachments`, ...multipartBody(Buffer.from('test')) })
    expect(limited.statusCode).toBe(409)
    expect(limited.json().error.code).toBe('ATTACHMENT_LIMIT_REACHED')
  })

  it('conceals non-owned resources with one 404 contract', async () => {
    const { app, service } = await fixture()
    service.list.mockRejectedValueOnce(resourceNotFound())
    const response = await app.inject({ method: 'GET', url: `/api/orders/${orderId}/attachments` })
    expect(response.statusCode).toBe(404)
    expect(response.json().error.code).toBe('RESOURCE_NOT_FOUND')
  })
})
