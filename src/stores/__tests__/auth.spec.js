import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const auth = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
}))

vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ auth })
}))

import { useAuthStore } from '@/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('establishes the returned session for valid email credentials', async () => {
    const session = { access_token: 'secret-token', user: { id: 'user-a' } }
    auth.signInWithPassword.mockResolvedValue({ data: { session }, error: null })

    const store = useAuthStore()
    await store.signIn('owner@example.com', 'correct-password')

    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@example.com',
      password: 'correct-password'
    })
    expect(store.session).toEqual(session)
    expect(store.error).toBeNull()
  })

  it('uses a safe message when Supabase rejects credentials', async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: new Error('server detail contains secret-token')
    })

    const store = useAuthStore()
    await expect(store.signIn('owner@example.com', 'wrong-password')).rejects.toThrow('電子郵件或密碼不正確')

    expect(store.session).toBeNull()
    expect(store.error).toBe('電子郵件或密碼不正確')
    expect(store.error).not.toContain('secret-token')
  })

  it('restores an existing session before initialization completes', async () => {
    const session = { access_token: 'restored-token', user: { id: 'user-a' } }
    auth.getSession.mockResolvedValue({ data: { session }, error: null })
    const store = useAuthStore()

    await store.initialize()

    expect(store.session).toEqual(session)
    expect(store.initialized).toBe(true)
    expect(auth.onAuthStateChange).toHaveBeenCalledOnce()
  })

  it('initializes without a user when no session exists', async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    const store = useAuthStore()

    await store.initialize()

    expect(store.session).toBeNull()
    expect(store.initialized).toBe(true)
  })

  it('signs out and runs user-scoped cleanup', async () => {
    auth.signOut.mockResolvedValue({ error: null })
    const cleanup = vi.fn()
    const store = useAuthStore()
    store.session = { access_token: 'token', user: { id: 'user-a' } }
    store.setSessionCleanup(cleanup)

    await store.signOut()

    expect(auth.signOut).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(store.session).toBeNull()
  })
})
