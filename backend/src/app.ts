import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import type { Pool } from 'pg'
import type { JWTVerifyGetKey } from 'jose'
import type { Config } from './config.js'
import { databasePlugin } from './plugins/database.js'
import { authPlugin } from './plugins/auth.js'
import { ordersRoutes } from './modules/orders/orders.routes.js'
import { orderAttachmentsRoutes } from './modules/order-attachments/order-attachments.routes.js'
import { OrderAttachmentsRepository } from './modules/order-attachments/order-attachments.repository.js'
import { OrderAttachmentsService } from './modules/order-attachments/order-attachments.service.js'
import { createSupabaseAttachmentStorage, type AttachmentStorage } from './modules/order-attachments/order-attachments.storage.js'
import { AppError } from './shared/errors.js'

const safeStackFrames = (error: unknown) => error instanceof Error
  ? error.stack?.split('\n').slice(1).filter((line) => /^\s*at\s/.test(line)).slice(0, 8).map((line) => line.trim().slice(0, 500)).join('\n')
  : undefined

export async function buildApp(config: Config, dependencies: { pool?: Pool; getKey?: JWTVerifyGetKey; attachmentStorage?: AttachmentStorage } = {}) {
  const app = Fastify({ logger: true })
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message, ...(error.details === undefined ? {} : { details: error.details }) } })
    app.log.error({ errType: error instanceof Error ? error.name : 'UnknownError', errStack: safeStackFrames(error) }, 'Unhandled request error')
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } })
  })
  await app.register(cors, {
    origin: config.corsOrigin,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  })
  await app.register(databasePlugin, { connectionString: config.databaseUrl, pool: dependencies.pool })
  await app.register(authPlugin, { supabaseUrl: config.supabaseUrl, getKey: dependencies.getKey })
  await app.register(multipart, { limits: { files: 1, fileSize: 10_485_760 } })
  app.get('/health', async () => ({ status: 'ok' }))
  const attachmentStorage = dependencies.attachmentStorage ?? createSupabaseAttachmentStorage(config.supabaseUrl, config.supabaseServiceRoleKey)
  const attachmentService = new OrderAttachmentsService(new OrderAttachmentsRepository(app.db), attachmentStorage)
  await app.register(ordersRoutes, { prefix: '/api/orders', attachmentCleanup: attachmentService })
  await app.register(orderAttachmentsRoutes, { prefix: '/api/orders', service: attachmentService })
  return app
}


