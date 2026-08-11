import { notFound } from '../../shared/errors.js'
import type { CreateOrder, PatchOrder } from './orders.schema.js'
import type { OrdersRepository } from './orders.repository.js'

export class OrdersService {
  constructor(private repository: OrdersRepository) {}
  list(userId: string) { return this.repository.list(userId) }
  async find(id: string, userId: string) { const value = await this.repository.find(id, userId); if (!value) throw notFound(); return value }
  create(input: CreateOrder, userId: string) { return this.repository.create(input, userId) }
  async update(id: string, input: PatchOrder, userId: string) { await this.find(id, userId); const value = await this.repository.update(id, userId, input); if (!value) throw notFound(); return value }
  async delete(id: string, userId: string) { if (!await this.repository.delete(id, userId)) throw notFound() }
}
