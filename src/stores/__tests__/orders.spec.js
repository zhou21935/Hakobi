import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const api = vi.hoisted(() => ({
  listOrders: vi.fn(), createOrder: vi.fn(), updateOrder: vi.fn(), deleteOrder: vi.fn()
}))
const clearSession = vi.hoisted(() => vi.fn())
vi.mock('@/services/ordersApi', () => ({ ...api, OrdersApiError: class OrdersApiError extends Error {} }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ clearSession }) }))

import {
  useOrdersStore, CATEGORIES, CATEGORY_LABELS, PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS
} from '@/stores/orders'

const order = (overrides = {}) => ({
  id: crypto.randomUUID(), category: 'agent', name: 'Book', amount: 10,
  productCategories: ['book'], status: 'AWAITING_SHIPMENT', orderDate: null,
  notes: '', ...overrides
})

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('order constants', () => {
  it('retains the supported categories and product category labels', () => {
    expect(CATEGORIES).toEqual({ AGENT: 'agent', PARCEL: 'parcel' })
    expect(CATEGORY_LABELS).toEqual({ agent: '海外代購', parcel: '集運包裹' })
    expect(PRODUCT_CATEGORIES).toEqual({ MERCH: 'merch', BOOK: 'book', OTHER: 'other' })
    expect(PRODUCT_CATEGORY_LABELS).toEqual({ merch: '周邊', book: '書籍', other: '其他' })
  })
})

describe('remote loading', () => {
  it('replaces the collection after a successful initial load', async () => {
    api.listOrders.mockResolvedValue([order({ name: 'A' }), order({ name: 'B' })])
    const store = useOrdersStore()

    await store.loadOrders()

    expect(store.orders.map(({ name }) => name)).toEqual(['A', 'B'])
    expect(store.isLoading).toBe(false)
    expect(store.initialized).toBe(true)
    expect(store.error).toBeNull()
  })

  it('preserves confirmed data on load failure and supports retry', async () => {
    api.listOrders.mockResolvedValueOnce([order({ name: 'Confirmed' })]).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([order({ name: 'Retried' })])
    const store = useOrdersStore()
    await store.loadOrders()
    await expect(store.loadOrders()).rejects.toThrow('offline')
    expect(store.orders[0].name).toBe('Confirmed')
    expect(store.error).toBe('offline')

    await store.retry()
    expect(store.orders[0].name).toBe('Retried')
  })

  it('clears user-scoped state when the API returns 401', async () => {
    api.listOrders.mockResolvedValueOnce([order({ name: 'Private' })])
    const unauthorized = Object.assign(new Error('請重新登入'), { code: 'AUTH_UNAUTHORIZED', status: 401 })
    api.listOrders.mockRejectedValueOnce(unauthorized)
    const store = useOrdersStore()
    await store.loadOrders()

    await expect(store.loadOrders()).rejects.toBe(unauthorized)

    expect(store.orders).toEqual([])
    expect(clearSession).toHaveBeenCalledOnce()
  })
})

describe('confirmed mutations', () => {
  it('validates locally and adds exactly the server-created UUID order', async () => {
    const created = order({ id: '2b4df07c-4738-4f2e-8f11-8e67687e1057', name: 'Created' })
    api.createOrder.mockResolvedValue(created)
    const store = useOrdersStore()

    await expect(store.addOrder({ name: '', amount: 10, productCategories: ['book'] })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
    expect(api.createOrder).not.toHaveBeenCalled()
    await expect(store.addOrder({ name: ' Created ', amount: '10', productCategories: ['book'] })).resolves.toEqual(created)
    expect(store.orders).toEqual([created])
  })

  it('rejects an unsafe product URL without issuing an API mutation', async () => {
    const store = useOrdersStore()
    await expect(store.addOrder({ name: 'Book', amount: 10, productCategories: ['book'], productUrl: 'javascript:alert(1)' })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
    expect(api.createOrder).not.toHaveBeenCalled()
  })

  it('keeps the confirmed order when update fails', async () => {
    const confirmed = order({ id: 'order-a' })
    api.listOrders.mockResolvedValue([confirmed])
    api.updateOrder.mockRejectedValue(new Error('update failed'))
    const store = useOrdersStore()
    await store.loadOrders()

    await expect(store.updateOrder('order-a', { isPaid: true })).rejects.toThrow('update failed')
    expect(store.orders[0]).toEqual(confirmed)
  })

  it('removes only after delete succeeds and retains on failure', async () => {
    const confirmed = order({ id: 'order-a' })
    api.listOrders.mockResolvedValue([confirmed])
    api.deleteOrder.mockRejectedValueOnce(new Error('delete failed')).mockResolvedValueOnce(undefined)
    const store = useOrdersStore()
    await store.loadOrders()

    await expect(store.deleteOrder('order-a')).rejects.toThrow('delete failed')
    expect(store.orders).toHaveLength(1)
    await store.deleteOrder('order-a')
    expect(store.orders).toHaveLength(0)
  })

  it('does not issue a duplicate mutation while one is active', async () => {
    let resolveCreate
    api.createOrder.mockImplementation(() => new Promise((resolve) => { resolveCreate = resolve }))
    const store = useOrdersStore()
    const pending = store.addOrder({ name: 'Book', amount: 10, productCategories: ['book'] })

    await expect(store.addOrder({ name: 'Other', amount: 20, productCategories: ['book'] })).rejects.toMatchObject({ code: 'MUTATION_IN_PROGRESS' })
    expect(api.createOrder).toHaveBeenCalledOnce()
    resolveCreate(order())
    await pending
  })
})

describe('client-side projections', () => {
  it('filters, searches, sorts, counts, and calculates statistics without API calls', async () => {
    api.listOrders.mockResolvedValue([
      order({ name: 'High widget', notes: 'alpha', amount: 30, orderDate: '2026-02-10' }),
      order({ name: 'Low widget', amount: 10, orderDate: '2026-01-05' }),
      order({ name: 'Parcel', category: 'parcel', amount: 20 })
    ])
    const store = useOrdersStore()
    await store.loadOrders()
    api.listOrders.mockClear()

    expect(store.getFiltered({ category: 'agent', search: 'widget', sort: 'amount-asc' }).map(({ name }) => name)).toEqual(['Low widget', 'High widget'])
    expect(store.getByCategory('parcel')).toHaveLength(1)
    expect(store.stats.total).toBe(3)
    expect(store.stats.byCategory).toEqual({ agent: 2, parcel: 1 })
    expect(store.stats.totalAmount).toBe(60)
    expect(api.listOrders).not.toHaveBeenCalled()
  })
})
