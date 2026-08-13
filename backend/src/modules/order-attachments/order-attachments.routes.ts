import type { FastifyPluginAsync } from 'fastify'
import { z, ZodError } from 'zod'
import { attachmentTooLarge, validationError } from '../../shared/errors.js'
import { OrderAttachmentsRepository } from './order-attachments.repository.js'
import { OrderAttachmentsService, validateAttachmentUpload, type AttachmentUpload } from './order-attachments.service.js'
import type { AttachmentStorage } from './order-attachments.storage.js'

type AttachmentService = {
  list(orderId: string, userId: string): Promise<unknown[]>
  upload(orderId: string, userId: string, file: AttachmentUpload): Promise<unknown>
  download(orderId: string, attachmentId: string, userId: string): Promise<string>
  delete(orderId: string, attachmentId: string, userId: string): Promise<void>
}

type Options = { service?: AttachmentService; storage?: AttachmentStorage }
const idSchema = z.uuid()
const parseId = (value: string) => {
  try { return idSchema.parse(value) } catch (error) {
    if (error instanceof ZodError) throw validationError(error.issues)
    throw error
  }
}

export const orderAttachmentsRoutes: FastifyPluginAsync<Options> = async (app, options) => {
  const service = options.service ?? (options.storage
    ? new OrderAttachmentsService(new OrderAttachmentsRepository(app.db), options.storage)
    : null)
  if (!service) throw new Error('Attachment storage is required')

  app.addHook('preHandler', app.authenticate)
  app.get('/:orderId/attachments', async (request) => {
    const orderId = parseId((request.params as { orderId: string }).orderId)
    return { data: await service.list(orderId, request.userId) }
  })
  app.post('/:orderId/attachments', async (request, reply) => {
    const orderId = parseId((request.params as { orderId: string }).orderId)
    let part
    try { part = await request.file() } catch (error) {
      if (error instanceof app.multipartErrors.RequestFileTooLargeError) throw attachmentTooLarge()
      throw error
    }
    if (!part || part.fieldname !== 'file') throw validationError([{ path: ['file'], message: 'One file is required' }])
    validateAttachmentUpload({ mimeType: part.mimetype, size: 1 })
    let bytes
    try { bytes = await part.toBuffer() } catch (error) {
      if (error instanceof app.multipartErrors.RequestFileTooLargeError) throw attachmentTooLarge()
      throw error
    }
    if (part.file.truncated) throw attachmentTooLarge()
    const file = { name: part.filename, mimeType: part.mimetype, size: bytes.length, bytes }
    validateAttachmentUpload(file)
    return reply.code(201).send({ data: await service.upload(orderId, request.userId, file) })
  })
  app.get('/:orderId/attachments/:attachmentId/download', async (request, reply) => {
    const params = request.params as { orderId: string; attachmentId: string }
    const url = await service.download(parseId(params.orderId), parseId(params.attachmentId), request.userId)
    return reply.code(302).header('location', url).send()
  })
  app.delete('/:orderId/attachments/:attachmentId', async (request, reply) => {
    const params = request.params as { orderId: string; attachmentId: string }
    await service.delete(parseId(params.orderId), parseId(params.attachmentId), request.userId)
    return reply.code(204).send()
  })
}
