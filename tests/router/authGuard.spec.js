import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const authState = vi.hoisted(() => ({ initialized: false, isAuthenticated: false, initialize: vi.fn() }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => authState }))

import { createAuthGuard, routes } from '@/router'

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

  it('protects the personal profile route and preserves it as the return destination', async () => {
    const profileRoute = routes.find(({ name }) => name === 'Profile')
    expect(profileRoute).toMatchObject({ path: '/profile', meta: { requiresAuth: true } })

    const guard = createAuthGuard(createPinia())
    expect(await guard({ meta: profileRoute.meta, fullPath: '/profile' })).toEqual({
      name: 'Login',
      query: { redirect: '/profile' }
    })

    authState.initialized = true
    authState.isAuthenticated = true
    expect(await guard({ meta: profileRoute.meta, fullPath: '/profile' })).toBe(true)
  })

  it('redirects an authenticated member away from guest-only account routes', async () => {
    authState.initialized = true
    authState.isAuthenticated = true
    const guard = createAuthGuard(createPinia())
    expect(await guard({ name: 'Register', meta: { public: true, guestOnly: true }, fullPath: '/register' })).toEqual({ name: 'AllOrders' })
  })
})

describe('route completeness', () => {
  it('accepts only agent and parcel category routes and provides a catch-all Not Found route', () => {
    const categoryRoute = routes.find(({ name }) => name === 'OrderList')
    expect(categoryRoute.beforeEnter({ params: { category: 'agent' } })).toBe(true)
    expect(categoryRoute.beforeEnter({ params: { category: 'parcel' } })).toBe(true)
    expect(categoryRoute.beforeEnter({ params: { category: 'unknown' } })).toEqual({ name: 'NotFound' })
    expect(routes.at(-1)).toMatchObject({ path: '/:pathMatch(.*)*', name: 'NotFound' })
    expect(routes.filter(({ name }) => ['Register', 'VerifyEmail', 'ForgotPassword', 'ResetPassword'].includes(name))).toHaveLength(4)
  })
})
