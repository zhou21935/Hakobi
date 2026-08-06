import { createClient } from '@supabase/supabase-js'

let client

const requiredEnv = (env, name) => {
  const value = env[name]?.trim()
  if (!value) throw new Error(`Missing required frontend configuration: ${name}`)
  return value
}

const serviceUrl = (value, name) => {
  let url
  try { url = new URL(value) } catch { throw new Error(`${name} must be a valid URL`) }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`${name} must use HTTP or HTTPS`)
  return value.replace(/\/+$/, '')
}

export const validateFrontendConfig = (env) => {
  const supabaseUrl = requiredEnv(env, 'VITE_SUPABASE_URL')
  const anonKey = requiredEnv(env, 'VITE_SUPABASE_ANON_KEY')
  const apiBaseUrl = requiredEnv(env, 'VITE_API_BASE_URL')
  return {
    VITE_SUPABASE_URL: serviceUrl(supabaseUrl, 'VITE_SUPABASE_URL'),
    VITE_SUPABASE_ANON_KEY: anonKey,
    VITE_API_BASE_URL: serviceUrl(apiBaseUrl, 'VITE_API_BASE_URL')
  }
}

export const getFrontendConfig = () => validateFrontendConfig(import.meta.env)

export const getSupabase = () => {
  if (!client) {
    const config = getFrontendConfig()
    client = createClient(
      config.VITE_SUPABASE_URL,
      config.VITE_SUPABASE_ANON_KEY
    )
  }
  return client
}
