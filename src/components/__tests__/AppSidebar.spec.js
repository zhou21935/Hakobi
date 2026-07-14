import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: { template: '<div />' } },
  { path: '/orders/:category', name: 'OrderList', component: { template: '<div />' } }
]

let router

beforeEach(async () => {
  router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/')
  await router.isReady()
})

describe('AppSidebar category navigation', () => {
  it('renders exactly two category links: 代購 and 集運包裹', async () => {
    const wrapper = mount(AppSidebar, { global: { plugins: [router] } })
    const categoryLinks = wrapper.findAll('a[href^="/orders/"]')
    expect(categoryLinks).toHaveLength(2)
    expect(categoryLinks.map((link) => link.text())).toEqual([
      expect.stringContaining('海外代購'),
      expect.stringContaining('集運包裹')
    ])
  })
})

describe('AppSidebar responsive drawer behavior', () => {
  it('is collapsed off-canvas on narrow viewports when open is not set', () => {
    const wrapper = mount(AppSidebar, { global: { plugins: [router] } })
    expect(wrapper.get('aside').classes()).toContain('-translate-x-full')
  })

  it('always renders visible on md+ viewports regardless of open state', () => {
    const wrapper = mount(AppSidebar, { global: { plugins: [router] } })
    expect(wrapper.get('aside').classes()).toContain('md:translate-x-0')
  })

  it('slides into view and shows an overlay when open is true', () => {
    const wrapper = mount(AppSidebar, { props: { open: true }, global: { plugins: [router] } })
    expect(wrapper.get('aside').classes()).toContain('translate-x-0')
    expect(wrapper.find('[data-testid="sidebar-overlay"]').exists()).toBe(true)
  })

  it('does not render the overlay when open is false', () => {
    const wrapper = mount(AppSidebar, { props: { open: false }, global: { plugins: [router] } })
    expect(wrapper.find('[data-testid="sidebar-overlay"]').exists()).toBe(false)
  })

  it('emits update:open false when the overlay is clicked', async () => {
    const wrapper = mount(AppSidebar, { props: { open: true }, global: { plugins: [router] } })
    await wrapper.get('[data-testid="sidebar-overlay"]').trigger('click')
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('emits update:open false when a navigation link is clicked', async () => {
    const wrapper = mount(AppSidebar, { props: { open: true }, global: { plugins: [router] } })
    await wrapper.get('a[href="/"]').trigger('click')
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })
})
