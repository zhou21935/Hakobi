import { describe, expect, it, vi } from 'vitest'
import { OrdersService } from '../../src/modules/orders/orders.service.js'

describe('OrdersService attachment cleanup', () => {
  it('removes storage objects before deleting the order row', async () => {
    const calls: string[] = []
    const repository = { delete: vi.fn(async () => { calls.push('order'); return true }) }
    const attachmentCleanup = { removeAllForOrder: vi.fn(async () => { calls.push('attachments') }) }
    const service = new OrdersService(repository as never, attachmentCleanup)

    await service.delete('order-a', 'user-a')

    expect(calls).toEqual(['attachments', 'order'])
  })

  it('does not delete the order row when storage cleanup fails', async () => {
    const repository = { delete: vi.fn().mockResolvedValue(true) }
    const attachmentCleanup = { removeAllForOrder: vi.fn().mockRejectedValue(new Error('storage failed')) }
    const service = new OrdersService(repository as never, attachmentCleanup)

    await expect(service.delete('order-a', 'user-a')).rejects.toThrow('storage failed')
    expect(repository.delete).not.toHaveBeenCalled()
  })
})
