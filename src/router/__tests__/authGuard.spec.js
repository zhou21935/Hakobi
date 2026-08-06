import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const authState = vi.hoisted(() => ({ initialized: false, isAuthenticated: false, initialize: vi.fn() }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => authState }))

import { createAuthGuard } from '@/router'

describe('authentication route guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    authState.initialized = false
    authState.isAuthenticated = false
    authState.initialize.mockReset()
    authState.initialize.mockImplementation(async () => { authState.initialized = true })
  })

  it('waits for session restoration and permits protected navigation with a session', async () => {
    authState.initialize.mockImplementation(async () => {
      authState.initialized = true
      authState.isAuthenticated = true
    })
    const guard = createAuthGuard(createPinia())

    const result = await guard({ meta: { requiresAuth: true }, fullPath: '/orders' })

    expect(authState.initialize).toHaveBeenCalledOnce()
    expect(result).toBe(true)
  })

  it('redirects unauthenticated protected navigation to login', async () => {
    const guard = createAuthGuard(createPinia())

    const result = await guard({ meta: { requiresAuth: true }, fullPath: '/orders' })

    expect(result).toEqual({ name: 'Login', query: { redirect: '/orders' } })
  })
})
