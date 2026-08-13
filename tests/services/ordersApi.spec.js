import { describe, expect, it, vi } from 'vitest'
import { createOrdersApi } from '@/services/ordersApi'

const jsonResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(body)
})

const blobResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  blob: vi.fn().mockResolvedValue(body)
})

const setup = (responses, tokens = ['token-a']) => {
  const fetchImpl = vi.fn()
  for (const response of responses) fetchImpl.mockResolvedValueOnce(response)
  let index = 0
  const getSession = vi.fn(async () => ({ access_token: tokens[Math.min(index++, tokens.length - 1)] }))
  return { fetchImpl, getSession, api: createOrdersApi({ baseUrl: 'https://api.example.test/', fetchImpl, getSession }) }
}

describe('orders API client', () => {
  it('reads the current token for every list request', async () => {
    const { api, fetchImpl } = setup([
      jsonResponse(200, { data: [], meta: { count: 0 } }),
      jsonResponse(200, { data: [], meta: { count: 0 } })
    ], ['old-token', 'refreshed-token'])

    await api.listOrders()
    await api.listOrders()

    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe('Bearer old-token')
    expect(fetchImpl.mock.calls[1][1].headers.Authorization).toBe('Bearer refreshed-token')
  })

  it('uses the documented methods, paths, and JSON payloads', async () => {
    const order = { id: '2b4df07c-4738-4f2e-8f11-8e67687e1057', name: 'Book' }
    const { api, fetchImpl } = setup([
      jsonResponse(201, { data: order }),
      jsonResponse(200, { data: { ...order, isPaid: true } }),
      { ok: true, status: 204, json: vi.fn() }
    ])

    expect(await api.createOrder({ name: 'Book' })).toEqual(order)
    expect(await api.updateOrder(order.id, { isPaid: true })).toMatchObject({ isPaid: true })
    await expect(api.deleteOrder(order.id)).resolves.toBeUndefined()

    expect(fetchImpl.mock.calls.map(([url, options]) => [url, options.method])).toEqual([
      ['https://api.example.test/api/orders', 'POST'],
      [`https://api.example.test/api/orders/${order.id}`, 'PATCH'],
      [`https://api.example.test/api/orders/${order.id}`, 'DELETE']
    ])
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({ name: 'Book' })
  })

  it('preserves order number and optional categories in create and patch payloads', async () => {
    const created = { id: 'order-a', orderNumber: 'A-100', productCategories: [] }
    const { api, fetchImpl } = setup([
      jsonResponse(201, { data: created }),
      jsonResponse(200, { data: { ...created, orderNumber: '' } })
    ])

    await api.createOrder({ orderNumber: 'A-100', productCategories: [] })
    await api.updateOrder('order-a', { orderNumber: '', productCategories: [] })

    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({ orderNumber: 'A-100', productCategories: [] })
    expect(JSON.parse(fetchImpl.mock.calls[1][1].body)).toEqual({ orderNumber: '', productCategories: [] })
  })

  it('opts into fetch keepalive only when finalizing during document unload', async () => {
    const { api, fetchImpl } = setup([{ ok: true, status: 204, json: vi.fn() }])
    await api.deleteOrder('order-a', { keepalive: true })
    expect(fetchImpl.mock.calls[0][1]).toMatchObject({ method: 'DELETE', keepalive: true })
  })

  it.each([
    [400, 'VALIDATION_ERROR', 'Invalid order'],
    [401, 'AUTH_UNAUTHORIZED', '請重新登入'],
    [500, 'INTERNAL_ERROR', 'An unexpected error occurred']
  ])('normalizes HTTP %i errors', async (status, code, message) => {
    const { api } = setup([jsonResponse(status, { error: { code, message: status === 401 ? 'secret token detail' : message } })])

    await expect(api.listOrders()).rejects.toMatchObject({ code, message, status })
  })

  it('rejects malformed success payloads with a stable safe error', async () => {
    const { api } = setup([jsonResponse(200, { unexpected: true })])
    await expect(api.listOrders()).rejects.toMatchObject({ code: 'INVALID_RESPONSE', status: 200 })
  })

  it('normalizes network failures without exposing their details', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('socket failed with secret-token'))
    const api = createOrdersApi({ baseUrl: 'https://api.example.test', fetchImpl, getSession: async () => ({ access_token: 'secret-token' }) })

    const error = await api.listOrders().catch((caught) => caught)
    expect(error).toMatchObject({ code: 'NETWORK_ERROR', status: null })
    expect(error.message).not.toContain('secret-token')
  })

  it('fails locally when no authenticated session exists', async () => {
    const fetchImpl = vi.fn()
    const api = createOrdersApi({ baseUrl: 'https://api.example.test', fetchImpl, getSession: async () => null })

    await expect(api.listOrders()).rejects.toMatchObject({ code: 'AUTH_UNAUTHORIZED', status: 401 })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('uses FormData without setting Content-Type and encodes attachment identifiers', async () => {
    const file = new File(['pdf'], 'receipt.pdf', { type: 'application/pdf' })
    const downloaded = new Blob(['pdf'], { type: 'application/pdf' })
    const { api, fetchImpl } = setup([
      jsonResponse(200, { data: [] }),
      jsonResponse(201, { data: { id: 'attachment/id' } }),
      blobResponse(200, downloaded),
      { ok: true, status: 204, json: vi.fn() }
    ])

    await api.listAttachments('order/id')
    await api.uploadAttachment('order/id', file)
    await expect(api.downloadAttachment('order/id', 'attachment/id')).resolves.toBe(downloaded)
    await api.deleteAttachment('order/id', 'attachment/id')

    const uploadOptions = fetchImpl.mock.calls[1][1]
    expect(uploadOptions.body).toBeInstanceOf(FormData)
    expect(uploadOptions.body.get('file')).toBe(file)
    expect(uploadOptions.headers).not.toHaveProperty('Content-Type')
    expect(fetchImpl.mock.calls.map(([url]) => url)).toEqual([
      'https://api.example.test/api/orders/order%2Fid/attachments',
      'https://api.example.test/api/orders/order%2Fid/attachments',
      'https://api.example.test/api/orders/order%2Fid/attachments/attachment%2Fid/download',
      'https://api.example.test/api/orders/order%2Fid/attachments/attachment%2Fid'
    ])
  })
})
