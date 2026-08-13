import { randomUUID } from 'node:crypto'
import { attachmentLimitReached, attachmentTooLarge, attachmentTypeNotAllowed, resourceNotFound, validationError } from '../../shared/errors.js'
import { toAttachment, type AttachmentRow } from './order-attachments.mapper.js'
import type { NewAttachment } from './order-attachments.repository.js'
import type { AttachmentStorage } from './order-attachments.storage.js'

type AttachmentRepository = {
  ownsOrder(orderId: string, userId: string): Promise<boolean>
  list(orderId: string, userId: string): Promise<AttachmentRow[]>
  find(orderId: string, attachmentId: string, userId: string): Promise<AttachmentRow | null>
  insert(input: NewAttachment): Promise<AttachmentRow>
  delete(attachmentId: string, orderId: string, userId: string): Promise<boolean>
}

export type AttachmentUpload = { name: string; mimeType: string; size: number; bytes: Buffer }
const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png'])
const maxAttachmentSize = 10_485_760
export const validateAttachmentUpload = (file: Pick<AttachmentUpload, 'mimeType' | 'size'>) => {
  if (!allowedMimeTypes.has(file.mimeType)) throw attachmentTypeNotAllowed()
  if (file.size < 1) throw validationError([{ path: ['file'], message: 'File must not be empty' }])
  if (file.size > maxAttachmentSize) throw attachmentTooLarge()
}

export class OrderAttachmentsService {
  constructor(
    private repository: AttachmentRepository,
    private storage: AttachmentStorage,
    private createId: () => string = randomUUID
  ) {}

  private async requireOwnedOrder(orderId: string, userId: string) {
    if (!await this.repository.ownsOrder(orderId, userId)) throw resourceNotFound()
  }

  async list(orderId: string, userId: string) {
    await this.requireOwnedOrder(orderId, userId)
    return (await this.repository.list(orderId, userId)).map(toAttachment)
  }

  async upload(orderId: string, userId: string, file: AttachmentUpload) {
    await this.requireOwnedOrder(orderId, userId)
    validateAttachmentUpload(file)
    const id = this.createId()
    const storagePath = `${userId}/${orderId}/${id}`
    await this.storage.upload(storagePath, file.bytes, file.mimeType)
    let created
    try {
      created = await this.repository.insert({ id, orderId, userId, storagePath, name: file.name, mimeType: file.mimeType, size: file.size })
    } catch (error) {
      try { await this.storage.remove(storagePath) } catch { /* preserve the metadata failure for the caller */ }
      if (error instanceof Error && 'code' in error && error.code === '23514' && error.message === 'attachment limit reached') throw attachmentLimitReached()
      throw error
    }
    return toAttachment(created)
  }

  async download(orderId: string, attachmentId: string, userId: string) {
    await this.requireOwnedOrder(orderId, userId)
    const attachment = await this.repository.find(orderId, attachmentId, userId)
    if (!attachment) throw resourceNotFound()
    return this.storage.createSignedUrl(attachment.storage_path)
  }

  async delete(orderId: string, attachmentId: string, userId: string) {
    await this.requireOwnedOrder(orderId, userId)
    const attachment = await this.repository.find(orderId, attachmentId, userId)
    if (!attachment) throw resourceNotFound()
    await this.storage.remove(attachment.storage_path)
    if (!await this.repository.delete(attachmentId, orderId, userId)) throw resourceNotFound()
  }

  async removeAllForOrder(orderId: string, userId: string) {
    await this.requireOwnedOrder(orderId, userId)
    const attachments = await this.repository.list(orderId, userId)
    await Promise.all(attachments.map((attachment) => this.storage.remove(attachment.storage_path)))
  }
}
