import type { FastifyPluginAsync } from 'fastify'
import { ZodError } from 'zod'
import { validationError } from '../../shared/errors.js'
import { OrdersRepository } from './orders.repository.js'
import { OrdersService } from './orders.service.js'
import { createOrderSchema, idSchema, patchOrderSchema } from './orders.schema.js'

type Options = { attachmentCleanup?: { removeAllForOrder(orderId: string, userId: string): Promise<void> } }

export const ordersRoutes: FastifyPluginAsync<Options> = async (app, options) => {
  const service = new OrdersService(new OrdersRepository(app.db), options.attachmentCleanup)
  const parse = <T>(fn: () => T) => { try { return fn() } catch (error) { if (error instanceof ZodError) throw validationError(error.issues); throw error } }
  app.addHook('preHandler', app.authenticate)
  app.get('/', async (request) => { const data = await service.list(request.userId); return { data, meta: { count: data.length } } })
  app.get('/:id', async (request) => { const id = parse(() => idSchema.parse((request.params as { id: string }).id)); return { data: await service.find(id, request.userId) } })
  app.post('/', async (request, reply) => { const input = parse(() => createOrderSchema.parse(request.body)); return reply.code(201).send({ data: await service.create(input, request.userId) }) })
  app.patch('/:id', async (request) => { const id = parse(() => idSchema.parse((request.params as { id: string }).id)); const input = parse(() => patchOrderSchema.parse(request.body)); return { data: await service.update(id, input, request.userId) } })
  app.delete('/:id', async (request, reply) => { const id = parse(() => idSchema.parse((request.params as { id: string }).id)); await service.delete(id, request.userId); return reply.code(204).send() })
}
