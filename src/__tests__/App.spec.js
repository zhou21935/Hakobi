import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const state = vi.hoisted(() => ({
  auth: { initialized: true, isAuthenticated: true, signOut: vi.fn() },
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
  })

  it('loads orders when the dashboard is the first protected view and does not duplicate a completed load', async () => {
    const wrapper = mount(App, { global: { stubs: { AppSidebar: true, RouterView: true } } })
    expect(state.orders.loadOrders).toHaveBeenCalledOnce()
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
})
