import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { Pool } from 'pg'
import type { JWTVerifyGetKey } from 'jose'
import type { Config } from './config.js'
import { databasePlugin } from './plugins/database.js'
import { authPlugin } from './plugins/auth.js'
import { ordersRoutes } from './modules/orders/orders.routes.js'
import { AppError } from './shared/errors.js'

export async function buildApp(config: Config, dependencies: { pool?: Pool; getKey?: JWTVerifyGetKey } = {}) {
  const app = Fastify({ logger: true })
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message, ...(error.details === undefined ? {} : { details: error.details }) } })
    app.log.error(error)
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } })
  })
  await app.register(cors, { origin: config.corsOrigin })
  await app.register(databasePlugin, { connectionString: config.databaseUrl, pool: dependencies.pool })
  await app.register(authPlugin, { supabaseUrl: config.supabaseUrl, getKey: dependencies.getKey })
  app.get('/health', async () => ({ status: 'ok' }))
  await app.register(ordersRoutes, { prefix: '/api/orders' })
  return app
}


