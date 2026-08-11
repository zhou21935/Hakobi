import fp from 'fastify-plugin'
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { unauthorized } from '../shared/errors.js'

declare module 'fastify' {
  interface FastifyRequest { userId: string }
  interface FastifyInstance { authenticate(request: FastifyRequest): Promise<void> }
}

const claimsSchema = z.object({ sub: z.uuid(), role: z.literal('authenticated') })

const auth: FastifyPluginAsync<{ supabaseUrl: string; getKey?: JWTVerifyGetKey }> = async (app, options) => {
  const issuer = `${options.supabaseUrl}/auth/v1`
  const getKey = options.getKey ?? createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`))
  app.decorateRequest('userId', '')
  app.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      const header = request.headers.authorization
      if (!header || !/^Bearer [^\s]+$/.test(header)) throw unauthorized()
      const { payload } = await jwtVerify(header.slice(7), getKey, { issuer, audience: 'authenticated' })
      request.userId = claimsSchema.parse(payload).sub
    } catch {
      throw unauthorized()
    }
  })
}
export const authPlugin = fp(auth)

