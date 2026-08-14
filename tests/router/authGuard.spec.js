import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { readFileSync } from 'node:fs'

const authState = vi.hoisted(() => ({ initialized: false, isAuthenticated: false, initialize: vi.fn() }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => authState }))

import router, { createAuthGuard, routes } from '@/router'

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
    expect(await guard({ name: 'Register', meta: { public: true, guestOnly: true }, fullPath: '/register' })).toEqual({ name: 'OrderOverview' })
  })
})

describe('route completeness', () => {
  it('keeps the browser tab branded as Hakobi on initial load and navigation', async () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />')
    expect(html).toContain('<title>Hakobi</title>')

    await router.push('/login')
    await router.isReady()
    expect(document.title).toBe('Hakobi')
    await router.push('/register')
    expect(document.title).toBe('Hakobi')
  })

  it('uses the all-orders behavior at home and redirects the legacy orders path', () => {
    expect(routes.find(({ name }) => name === 'OrderOverview')).toMatchObject({
      path: '/',
      meta: { title: '訂單總覽', requiresAuth: true }
    })
    expect(routes.find(({ path }) => path === '/orders')).toMatchObject({
      redirect: { name: 'OrderOverview' }
    })
  })

  it('accepts only agent and parcel category routes and provides a catch-all Not Found route', () => {
    const categoryRoute = routes.find(({ name }) => name === 'OrderList')
    expect(categoryRoute.beforeEnter({ params: { category: 'agent' } })).toBe(true)
    expect(categoryRoute.beforeEnter({ params: { category: 'parcel' } })).toBe(true)
    expect(categoryRoute.beforeEnter({ params: { category: 'unknown' } })).toEqual({ name: 'NotFound' })
    expect(routes.at(-1)).toMatchObject({ path: '/:pathMatch(.*)*', name: 'NotFound' })
    expect(routes.filter(({ name }) => ['Register', 'VerifyEmail', 'ForgotPassword', 'ResetPassword'].includes(name))).toHaveLength(4)
  })
})
