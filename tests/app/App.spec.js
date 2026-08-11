import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const state = vi.hoisted(() => ({
  auth: { initialized: true, isAuthenticated: true, profile: null, profileLoading: false, profileError: null, user: { email: 'owner@example.com' }, loadProfile: vi.fn(), signOut: vi.fn() },
  orders: { initialized: false, isLoading: false, loadOrders: vi.fn(), finalizePendingDelete: vi.fn() },
  route: { meta: { requiresAuth: true }, name: 'Dashboard' },
  router: { replace: vi.fn() }
}))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => state.auth }))
vi.mock('@/stores/orders', () => ({ useOrdersStore: () => state.orders }))
vi.mock('vue-router', () => ({ useRoute: () => state.route, useRouter: () => state.router }))

import App from '@/App.vue'

describe('application order initialization', () => {
  beforeEach(() => {
    state.orders.initialized = false
    state.orders.isLoading = false
    state.orders.loadOrders.mockReset().mockResolvedValue(undefined)
    state.orders.finalizePendingDelete.mockReset().mockResolvedValue(undefined)
    state.auth.signOut.mockReset().mockResolvedValue(undefined)
    state.auth.profile = null
    state.auth.profileLoading = false
    state.auth.profileError = null
    state.auth.user = { email: 'owner@example.com' }
    state.auth.loadProfile.mockReset().mockResolvedValue(undefined)
    state.route.meta = { requiresAuth: true }
    state.route.name = 'Dashboard'
  })

  it('loads orders when the dashboard is the first protected view and does not duplicate a completed load', async () => {
    const wrapper = mount(App, { global: { stubs: { AppSidebar: true, RouterView: true } } })
    expect(state.orders.loadOrders).toHaveBeenCalledOnce()
    expect(state.auth.loadProfile).toHaveBeenCalledOnce()
    state.orders.initialized = true
    await wrapper.vm.$nextTick()
    expect(state.orders.loadOrders).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('finalizes pending deletion with keepalive on unload and before sign-out', async () => {
    const wrapper = mount(App, { global: { stubs: { AppSidebar: true, RouterView: true } } })
    window.dispatchEvent(new Event('beforeunload'))
    expect(state.orders.finalizePendingDelete).toHaveBeenCalledWith({ keepalive: true })
    wrapper.findComponent({ name: 'AppSidebar' }).vm.$emit('logout')
    await flushPromises()
    expect(state.orders.finalizePendingDelete).toHaveBeenCalledWith()
    expect(state.auth.signOut).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('loads the owned profile when the personal profile route is entered directly', () => {
    state.route.name = 'Profile'
    const wrapper = mount(App, { global: { stubs: { AppSidebar: true, RouterView: true } } })

    expect(state.auth.loadProfile).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('passes only confirmed profile identity and safe fallback state to the sidebar', () => {
    state.auth.profile = { userId: 'user-a', username: 'Hakobi_02', displayName: '王小明' }
    const wrapper = mount(App, { global: { stubs: { AppSidebar: true, RouterView: true } } })
    const sidebar = wrapper.findComponent({ name: 'AppSidebar' })

    expect(sidebar.props('username')).toBe('Hakobi_02')
    expect(sidebar.props('identityFallback')).toBe('owner@example.com')
    expect(sidebar.props('profileError')).toBeNull()
    wrapper.unmount()
  })

  it('does not pass a stale username when profile loading fails', () => {
    state.auth.profile = null
    state.auth.profileError = '會員資料載入失敗，請重試'
    const wrapper = mount(App, { global: { stubs: { AppSidebar: true, RouterView: true } } })
    const sidebar = wrapper.findComponent({ name: 'AppSidebar' })

    expect(sidebar.props('username')).toBe('')
    expect(sidebar.props('identityFallback')).toBe('owner@example.com')
    expect(sidebar.props('profileError')).toBe('會員資料載入失敗，請重試')
    wrapper.unmount()
  })
})
