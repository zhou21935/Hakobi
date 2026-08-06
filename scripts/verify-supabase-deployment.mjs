import { pathToFileURL } from 'node:url'

const requiredNames = [
  'VERIFY_API_URL', 'VERIFY_SUPABASE_URL', 'VERIFY_SUPABASE_ANON_KEY',
  'VERIFY_USER_A_EMAIL', 'VERIFY_USER_A_PASSWORD', 'VERIFY_USER_B_EMAIL', 'VERIFY_USER_B_PASSWORD'
]

const readConfig = (env) => {
  const config = {}
  for (const name of requiredNames) {
    const value = env[name]?.trim()
    if (!value) throw new Error(`Missing required verification setting: ${name}`)
    config[name] = value
  }
  for (const name of ['VERIFY_API_URL', 'VERIFY_SUPABASE_URL']) {
    let parsed
    try { parsed = new URL(config[name]) } catch { throw new Error(`${name} must be a valid URL`) }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`${name} must use HTTP or HTTPS`)
    config[name] = config[name].replace(/\/+$/, '')
  }
  return config
}

const safeRequestError = (label, expected, actual) => new Error(`${label} expected HTTP ${expected}, received ${actual}`)

export const verifyDeployment = async ({ env = process.env, fetchImpl = fetch } = {}) => {
  const config = readConfig(env)
  const signIn = async (email, password) => {
    const response = await fetchImpl(`${config.VERIFY_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: config.VERIFY_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw safeRequestError('Supabase sign-in', 200, response.status)
    const payload = await response.json()
    if (!payload?.access_token) throw new Error('Supabase sign-in returned no access token')
    return payload.access_token
  }

  const api = async (path, { token, method = 'GET', body, expected }) => {
    const response = await fetchImpl(`${config.VERIFY_API_URL}${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    })
    if (response.status !== expected) throw safeRequestError(path, expected, response.status)
    if (expected === 204) return undefined
    return response.json()
  }

  await api('/health', { expected: 200 })
  const [tokenA, tokenB] = await Promise.all([
    signIn(config.VERIFY_USER_A_EMAIL, config.VERIFY_USER_A_PASSWORD),
    signIn(config.VERIFY_USER_B_EMAIL, config.VERIFY_USER_B_PASSWORD)
  ])

  let orderId
  let cleaned = false
  try {
    const created = await api('/api/orders', {
      token: tokenA,
      method: 'POST',
      expected: 201,
      body: { category: 'agent', name: `Hakobi deployment verification ${new Date().toISOString()}`, amount: 1, productCategories: ['other'] }
    })
    orderId = created?.data?.id
    if (!orderId) throw new Error('Create order returned no order ID')

    const path = `/api/orders/${encodeURIComponent(orderId)}`
    await api(path, { token: tokenA, expected: 200 })
    await api(path, { token: tokenA, method: 'PATCH', body: { isPaid: true }, expected: 200 })
    await api(path, { token: tokenB, expected: 404 }).catch((error) => { throw new Error(`Cross-owner GET expected 404: ${error.message}`) })
    await api(path, { token: tokenB, method: 'PATCH', body: { isPaid: true }, expected: 404 }).catch((error) => { throw new Error(`Cross-owner PATCH expected 404: ${error.message}`) })
    await api(path, { token: tokenB, method: 'DELETE', expected: 404 }).catch((error) => { throw new Error(`Cross-owner DELETE expected 404: ${error.message}`) })
    return { health: true, ownerCrud: true, isolation: true, get cleaned() { return cleaned } }
  } finally {
    if (orderId) {
      try {
        await api(`/api/orders/${encodeURIComponent(orderId)}`, { token: tokenA, method: 'DELETE', expected: 204 })
        cleaned = true
      } catch {
        process.stderr.write(`Verification cleanup failed for order ${orderId}\n`)
      }
    }
  }
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isCli) {
  verifyDeployment()
    .then((result) => process.stdout.write(`Deployment verification passed (cleaned=${result.cleaned})\n`))
    .catch((error) => {
      process.stderr.write(`Deployment verification failed: ${error.message}\n`)
      process.exitCode = 1
    })
}
