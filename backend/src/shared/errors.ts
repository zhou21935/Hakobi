export class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string, public details?: unknown) {
    super(message)
  }
}

export const unauthorized = () => new AppError(401, 'AUTH_UNAUTHORIZED', 'Authentication required')
export const notFound = () => new AppError(404, 'ORDER_NOT_FOUND', 'Order not found')
export const validationError = (details?: unknown) => new AppError(400, 'VALIDATION_ERROR', 'Invalid request', details)
