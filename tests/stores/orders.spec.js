import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const api = vi.hoisted(() => ({
  listOrders: vi.fn(), createOrder: vi.fn(), updateOrder: vi.fn(), deleteOrder: vi.fn(),
  listAttachments: vi.fn(), uploadAttachment: vi.fn(), downloadAttachment: vi.fn(), deleteAttachment: vi.fn()
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
  api.deleteOrder.mockReset()
  localStorage.clear()
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
  it('accepts empty categories and stores the backend-confirmed order number', async () => {
    const created = order({ orderNumber: 'A-100', productCategories: [] })
    api.createOrder.mockResolvedValue(created)
    const store = useOrdersStore()

    await store.addOrder({ category: 'agent', name: 'Book', amount: '35.29', orderNumber: 'A-100', productCategories: [] })

    expect(api.createOrder).toHaveBeenCalledWith(expect.objectContaining({ amount: 35.29, orderNumber: 'A-100', productCategories: [] }))
    expect(store.orders).toEqual([created])
  })

  it('retains a confirmed order and records per-file outcomes when attachment uploads partially fail', async () => {
    const created = order({ id: 'order-a', orderNumber: 'A-100', productCategories: [] })
    const first = new File(['one'], 'one.pdf', { type: 'application/pdf' })
    const second = new File(['two'], 'two.pdf', { type: 'application/pdf' })
    const confirmedAttachment = { id: 'attachment-a', orderId: 'order-a', name: 'one.pdf' }
    api.createOrder.mockResolvedValue(created)
    api.uploadAttachment.mockResolvedValueOnce(confirmedAttachment).mockRejectedValueOnce(Object.assign(new Error('檔案過大'), { code: 'ATTACHMENT_TOO_LARGE' }))
    const store = useOrdersStore()

    await expect(store.addOrder({ category: 'agent', name: 'Book', amount: 10, productCategories: [] }, [first, second])).resolves.toEqual(created)

    expect(store.orders).toEqual([created])
    expect(store.attachmentStatusFor('order-a')).toMatchObject({
      confirmed: [confirmedAttachment],
      failed: [{ file: second, name: 'two.pdf', code: 'ATTACHMENT_TOO_LARGE', message: '檔案過大' }]
    })
  })

  it('loads, retries, downloads, and deletes only backend-confirmed attachments', async () => {
    const file = new File(['pdf'], 'receipt.pdf', { type: 'application/pdf' })
    const attachment = { id: 'attachment-a', orderId: 'order-a', name: 'receipt.pdf' }
    api.listAttachments.mockResolvedValue([attachment])
    api.uploadAttachment.mockResolvedValue(attachment)
    api.downloadAttachment.mockResolvedValue(new Blob(['pdf']))
    api.deleteAttachment.mockResolvedValue(undefined)
    const store = useOrdersStore()

    await store.loadAttachments('order-a')
    await store.retryAttachment('order-a', file)
    await expect(store.downloadAttachment('order-a', 'attachment-a')).resolves.toBeInstanceOf(Blob)
    await store.deleteAttachment('order-a', 'attachment-a')

    expect(store.attachmentStatusFor('order-a').confirmed).toEqual([])
  })

  it('validates locally and adds exactly the server-created UUID order', async () => {
    const created = order({ id: '2b4df07c-4738-4f2e-8f11-8e67687e1057', name: 'Created' })
    api.createOrder.mockResolvedValue(created)
    const store = useOrdersStore()

    await expect(store.addOrder({ category: 'agent', name: '', amount: 10, productCategories: ['book'] })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
    expect(api.createOrder).not.toHaveBeenCalled()
    await expect(store.addOrder({ category: 'agent', name: ' Created ', amount: '10', productCategories: ['book'] })).resolves.toEqual(created)
    expect(store.orders).toEqual([created])
  })

  it('rejects an unsafe product URL without issuing an API mutation', async () => {
    const store = useOrdersStore()
    await expect(store.addOrder({ category: 'agent', name: 'Book', amount: 10, productCategories: ['book'], productUrl: 'javascript:alert(1)' })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
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
    const pending = store.addOrder({ category: 'agent', name: 'Book', amount: 10, productCategories: ['book'] })

    await expect(store.addOrder({ category: 'agent', name: 'Other', amount: 20, productCategories: ['book'] })).rejects.toMatchObject({ code: 'MUTATION_IN_PROGRESS' })
    expect(api.createOrder).toHaveBeenCalledOnce()
    resolveCreate(order())
    await pending
  })
})

describe('view-scoped delete undo', () => {
  it('removes immediately and restores the same order at its original index without calling the API', async () => {
    const a = order({ id: 'order-a', name: 'A' })
    const b = order({ id: 'order-b', name: 'B' })
    api.listOrders.mockResolvedValue([a, b])
    const store = useOrdersStore()
    await store.loadOrders()
    const activeA = store.orders[0]

    await store.stageDelete('order-a')
    expect(JSON.parse(localStorage.getItem('hakobi.pending-order-deletes'))).toEqual(['order-a'])
    expect(store.orders.map(({ id }) => id)).toEqual(['order-b'])
    expect(store.pendingDelete.order).toBe(activeA)
    store.undoDelete()
    expect(store.orders[0]).toBe(activeA)
    expect(store.orders).toEqual([a, b])
    expect(store.pendingDelete).toBeNull()
    expect(localStorage.getItem('hakobi.pending-order-deletes')).toBeNull()
    expect(api.deleteOrder).not.toHaveBeenCalled()
  })

  it('finalizes persisted deletions before reload data can reappear', async () => {
    localStorage.setItem('hakobi.pending-order-deletes', JSON.stringify(['order-a']))
    api.deleteOrder.mockResolvedValue(undefined)
    api.listOrders.mockResolvedValue([order({ id: 'order-a' }), order({ id: 'order-b' })])
    const store = useOrdersStore()

    await store.loadOrders()

    expect(api.deleteOrder).toHaveBeenCalledWith('order-a', { keepalive: true })
    expect(store.orders.map(({ id }) => id)).toEqual(['order-b'])
    expect(localStorage.getItem('hakobi.pending-order-deletes')).toBeNull()
  })

  it('keeps failed persisted deletions hidden and retries them on a later load', async () => {
    localStorage.setItem('hakobi.pending-order-deletes', JSON.stringify(['order-a']))
    api.deleteOrder.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined)
    api.listOrders.mockResolvedValue([order({ id: 'order-a' }), order({ id: 'order-b' })])
    const store = useOrdersStore()

    await store.loadOrders()
    expect(store.orders.map(({ id }) => id)).toEqual(['order-b'])
    expect(JSON.parse(localStorage.getItem('hakobi.pending-order-deletes'))).toEqual(['order-a'])

    await store.loadOrders()
    expect(api.deleteOrder).toHaveBeenCalledTimes(2)
    expect(localStorage.getItem('hakobi.pending-order-deletes')).toBeNull()
  })

  it('finalizes the first pending order exactly once before staging a second', async () => {
    api.deleteOrder.mockResolvedValue(undefined)
    api.listOrders.mockResolvedValue([order({ id: 'order-a' }), order({ id: 'order-b' })])
    const store = useOrdersStore()
    await store.loadOrders()
    await store.stageDelete('order-a')
    await store.stageDelete('order-b')
    expect(api.deleteOrder).toHaveBeenCalledTimes(1)
    expect(api.deleteOrder).toHaveBeenCalledWith('order-a', { keepalive: false })
    expect(store.pendingDelete.order.id).toBe('order-b')
  })

  it('keeps a permanent deletion hidden for retry when keepalive finalization fails', async () => {
    const confirmed = order({ id: 'order-a' })
    api.listOrders.mockResolvedValue([confirmed])
    api.deleteOrder.mockRejectedValue(new Error('delete failed'))
    const store = useOrdersStore()
    await store.loadOrders()
    await store.stageDelete('order-a')
    await expect(store.finalizePendingDelete({ keepalive: true, restoreOnFailure: false })).rejects.toThrow('delete failed')
    expect(api.deleteOrder).toHaveBeenCalledWith('order-a', { keepalive: true })
    expect(store.orders).toEqual([])
    expect(store.pendingDelete).toBeNull()
    expect(store.error).toBe('delete failed')
    expect(JSON.parse(localStorage.getItem('hakobi.pending-order-deletes'))).toEqual(['order-a'])
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
