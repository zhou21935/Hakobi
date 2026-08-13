export class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string, public details?: unknown) {
    super(message)
  }
}

export const unauthorized = () => new AppError(401, 'AUTH_UNAUTHORIZED', 'Authentication required')
export const notFound = () => new AppError(404, 'ORDER_NOT_FOUND', 'Order not found')
export const resourceNotFound = () => new AppError(404, 'RESOURCE_NOT_FOUND', 'Resource not found')
export const validationError = (details?: unknown) => new AppError(400, 'VALIDATION_ERROR', 'Invalid request', details)
export const attachmentTypeNotAllowed = () => new AppError(400, 'ATTACHMENT_TYPE_NOT_ALLOWED', 'Attachment type is not allowed')
export const attachmentTooLarge = () => new AppError(413, 'ATTACHMENT_TOO_LARGE', 'Attachment exceeds 10 MB')
export const attachmentLimitReached = () => new AppError(409, 'ATTACHMENT_LIMIT_REACHED', 'Attachment limit reached')
