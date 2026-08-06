import { getFrontendConfig, getSupabase } from '@/lib/supabase'

export class OrdersApiError extends Error {
  constructor(code, message, status = null) {
    super(message)
    this.name = 'OrdersApiError'
    this.code = code
    this.status = status
  }
}

const safeMessages = {
  AUTH_UNAUTHORIZED: '請重新登入',
  NETWORK_ERROR: '無法連線至伺服器，請稍後再試',
  INVALID_RESPONSE: '伺服器回應格式錯誤'
}

const normalizeBaseUrl = (value) => {
  const trimmed = value?.trim().replace(/\/+$/, '')
  let url
  try { url = new URL(trimmed) } catch { throw new Error('VITE_API_BASE_URL must be a valid URL') }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('VITE_API_BASE_URL must use HTTP or HTTPS')
  return url.toString().replace(/\/$/, '')
}

const parseJson = async (response) => {
  try { return await response.json() } catch { throw new OrdersApiError('INVALID_RESPONSE', safeMessages.INVALID_RESPONSE, response.status) }
}

export const createOrdersApi = ({ baseUrl, fetchImpl = fetch, getSession }) => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  const request = async (path, { method = 'GET', body, expectedStatus }) => {
    const session = await getSession()
    if (!session?.access_token) throw new OrdersApiError('AUTH_UNAUTHORIZED', safeMessages.AUTH_UNAUTHORIZED, 401)

    let response
    try {
      response = await fetchImpl(`${normalizedBaseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      })
    } catch {
      throw new OrdersApiError('NETWORK_ERROR', safeMessages.NETWORK_ERROR)
    }

    if (!response.ok || (expectedStatus && response.status !== expectedStatus)) {
      let payload
      try { payload = await response.json() } catch { payload = null }
      const code = response.status === 401 ? 'AUTH_UNAUTHORIZED' : (payload?.error?.code || 'REQUEST_FAILED')
      const message = response.status === 401 ? safeMessages.AUTH_UNAUTHORIZED : (payload?.error?.message || '請求失敗，請稍後再試')
      throw new OrdersApiError(code, message, response.status)
    }
    if (response.status === 204) return undefined
    return parseJson(response)
  }

  return {
    async listOrders() {
      const payload = await request('/api/orders', { expectedStatus: 200 })
      if (!Array.isArray(payload?.data)) throw new OrdersApiError('INVALID_RESPONSE', safeMessages.INVALID_RESPONSE, 200)
      return payload.data
    },
    async createOrder(input) {
      const payload = await request('/api/orders', { method: 'POST', body: input, expectedStatus: 201 })
      if (!payload?.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) throw new OrdersApiError('INVALID_RESPONSE', safeMessages.INVALID_RESPONSE, 201)
      return payload.data
    },
    async updateOrder(id, patch) {
      const payload = await request(`/api/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, expectedStatus: 200 })
      if (!payload?.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) throw new OrdersApiError('INVALID_RESPONSE', safeMessages.INVALID_RESPONSE, 200)
      return payload.data
    },
    async deleteOrder(id) {
      await request(`/api/orders/${encodeURIComponent(id)}`, { method: 'DELETE', expectedStatus: 204 })
    }
  }
}

let defaultApi
const getDefaultApi = () => {
  if (!defaultApi) {
    defaultApi = createOrdersApi({
      baseUrl: getFrontendConfig().VITE_API_BASE_URL,
      getSession: async () => (await getSupabase().auth.getSession()).data.session
    })
  }
  return defaultApi
}

export const listOrders = (...args) => getDefaultApi().listOrders(...args)
export const createOrder = (...args) => getDefaultApi().createOrder(...args)
export const updateOrder = (...args) => getDefaultApi().updateOrder(...args)
export const deleteOrder = (...args) => getDefaultApi().deleteOrder(...args)
