import { describe, expect, it } from 'vitest'
import { authRedirectUrl, validateFrontendConfig } from '@/lib/supabase'

const valid = {
  VITE_SUPABASE_URL: 'https://project.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'publishable-anon-key',
  VITE_API_BASE_URL: 'https://api.example.com'
}

describe('frontend configuration', () => {
  it('accepts only the three public browser values', () => {
    expect(validateFrontendConfig({ ...valid, SUPABASE_DB_URL: 'postgresql://secret' })).toEqual(valid)
  })

  it.each(Object.keys(valid))('fails loudly when %s is missing', (name) => {
    expect(() => validateFrontendConfig({ ...valid, [name]: '' })).toThrow(`Missing required frontend configuration: ${name}`)
  })

  it('rejects non-HTTP service URLs', () => {
    expect(() => validateFrontendConfig({ ...valid, VITE_API_BASE_URL: 'javascript:alert(1)' })).toThrow('VITE_API_BASE_URL must use HTTP or HTTPS')
  })

  it('builds only same-origin authentication callbacks', () => {
    expect(authRedirectUrl('/verify-email')).toBe(`${window.location.origin}/verify-email`)
    expect(() => authRedirectUrl('//evil.example')).toThrow('same-origin')
    expect(() => authRedirectUrl('https://evil.example')).toThrow('same-origin')
  })
})
