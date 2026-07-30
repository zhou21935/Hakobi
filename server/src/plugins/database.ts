import fp from 'fastify-plugin'
import { Pool, type PoolConfig } from 'pg'
import type { FastifyPluginAsync } from 'fastify'

declare module 'fastify' { interface FastifyInstance { db: Pool } }

const database: FastifyPluginAsync<{ connectionString: string; pool?: Pool }> = async (app, options) => {
  const config: PoolConfig = { connectionString: options.connectionString, max: 10, ssl: options.connectionString.includes('localhost') ? false : { rejectUnauthorized: false } }
  const pool = options.pool ?? new Pool(config)
  app.decorate('db', pool)
  app.addHook('onClose', async () => { await pool.end() })
}
export const databasePlugin = fp(database)

