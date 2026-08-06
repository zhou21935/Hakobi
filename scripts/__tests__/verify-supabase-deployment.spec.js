import { describe, expect, it, vi } from 'vitest'
import { verifyDeployment } from '../verify-supabase-deployment.mjs'

const env = {
  VERIFY_API_URL: 'https://api.example.test',
  VERIFY_SUPABASE_URL: 'https://project.supabase.co',
  VERIFY_SUPABASE_ANON_KEY: 'anon-key',
  VERIFY_USER_A_EMAIL: 'a@example.test', VERIFY_USER_A_PASSWORD: 'password-a',
  VERIFY_USER_B_EMAIL: 'b@example.test', VERIFY_USER_B_PASSWORD: 'password-b'
}

const response = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(body)
})

const createFetch = ({ unsafeRead = false } = {}) => {
  let cleaned = false
  let currentOrder
  const fetchImpl = vi.fn(async (url, options = {}) => {
    if (url.includes('/auth/v1/token')) {
      const body = JSON.parse(options.body)
      return response(200, { access_token: body.email.startsWith('a@') ? 'token-a' : 'token-b' })
    }
    if (url.endsWith('/health')) return response(200, { status: 'ok' })
    const auth = options.headers?.Authorization
    if (url.endsWith('/api/orders') && options.method === 'POST') {
      currentOrder = { id: '2b4df07c-4738-4f2e-8f11-8e67687e1057', ...JSON.parse(options.body) }
      return response(201, { data: currentOrder })
    }
    if (auth === 'Bearer token-b') {
      if (unsafeRead && (!options.method || options.method === 'GET')) return response(200, { data: { id: 'private-order' } })
      return response(404, { error: { code: 'ORDER_NOT_FOUND', message: 'Not found' } })
    }
    if (options.method === 'DELETE') { cleaned = true; return { ok: true, status: 204, json: vi.fn() } }
    if (options.method === 'PATCH') { currentOrder = { ...currentOrder, ...JSON.parse(options.body) }; return response(200, { data: currentOrder }) }
    return response(200, { data: currentOrder })
  })
  return { fetchImpl, wasCleaned: () => cleaned }
}

describe('deployment verifier', () => {
  it('passes health, owner CRUD, and all three cross-owner isolation checks', async () => {
    const { fetchImpl, wasCleaned } = createFetch()
    await expect(verifyDeployment({ env, fetchImpl })).resolves.toMatchObject({ isolation: true, cleaned: true })
    expect(wasCleaned()).toBe(true)
    expect(fetchImpl.mock.calls.filter(([, options]) => options?.headers?.Authorization === 'Bearer token-b')).toHaveLength(3)
    const ownerWrites = fetchImpl.mock.calls.filter(([url, options]) => url.includes('/api/orders') && ['POST', 'PATCH'].includes(options?.method))
    expect(JSON.parse(ownerWrites[0][1].body)).toMatchObject({ shippingMethod: '日本郵便 EMS', trackingNumber: 'EN123456789JP' })
    expect(JSON.parse(ownerWrites[1][1].body)).toMatchObject({ shippingMethod: 'DHL', trackingNumber: 'UPDATED-TRACKING' })
  })

  it('fails unsafe isolation without leaking tokens and still cleans up', async () => {
    const { fetchImpl, wasCleaned } = createFetch({ unsafeRead: true })
    const error = await verifyDeployment({ env, fetchImpl }).catch((caught) => caught)
    expect(error.message).toContain('Cross-owner GET expected 404')
    expect(error.message).not.toContain('token-a')
    expect(error.message).not.toContain('token-b')
    expect(wasCleaned()).toBe(true)
  })
})
