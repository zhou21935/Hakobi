import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppSidebar from '@/components/common/AppSidebar.vue'

const routes = [
  { path: '/', name: 'OrderOverview', component: { template: '<div />' } },
  { path: '/orders/:category', name: 'OrderList', component: { template: '<div />' } },
  { path: '/profile', name: 'Profile', component: { template: '<div />' } }
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

  it('omits the development-only UI showcase destination', () => {
    const wrapper = mount(AppSidebar, { global: { plugins: [router] } })
    expect(wrapper.find('a[href="/ui-showcase"]').exists()).toBe(false)
    expect(wrapper.find('a[href="/"]').text()).toContain('總覽')
    expect(wrapper.find('a[href="/orders"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('全部訂單')
  })

  it('renders personal profile in a member section after order categories', async () => {
    await router.push('/profile')
    const wrapper = mount(AppSidebar, { props: { open: true }, global: { plugins: [router] } })
    const memberSection = wrapper.get('[data-testid="member-navigation"]')
    const profileLink = memberSection.get('a[href="/profile"]')

    expect(memberSection.text()).toContain('會員')
    expect(profileLink.text()).toContain('個人資料')
    expect(profileLink.classes()).toContain('text-white')
    const destinations = wrapper.findAll('nav a').map(link => link.attributes('href'))
    expect(destinations.indexOf('/profile')).toBeGreaterThan(destinations.indexOf('/orders/parcel'))

    await profileLink.trigger('click')
    expect(wrapper.emitted('update:open')).toContainEqual([false])
  })
})

describe('AppSidebar responsive drawer behavior', () => {
  it('preserves the identity row without rendering text while identity is loading', () => {
    const wrapper = mount(AppSidebar, { props: { identityLoading: true, identityFallback: 'owner@example.com' }, global: { plugins: [router] } })
    const identity = wrapper.get('[data-testid="member-identity"]')

    expect(identity.exists()).toBe(true)
    expect(identity.text()).toBe('')
    expect(identity.classes()).toEqual(expect.arrayContaining(['mb-1', 'h-5', 'text-sm']))
    expect(identity.attributes('aria-busy')).toBe('true')
    expect(wrapper.text()).not.toContain('owner@example.com')
  })

  it('shows a neutral member identity when profile identity is still loading', () => {
    const wrapper = mount(AppSidebar, { props: { username: '', identityFallback: '' }, global: { plugins: [router] } })
    const identity = wrapper.get('[data-testid="member-identity"]')

    expect(identity.text()).toBe('會員')
    expect(wrapper.text()).not.toContain('owner@example.com')
  })

  it('shows the member username and offers profile retry', async () => {
    const wrapper = mount(AppSidebar, { props: { username: 'Hakobi', identityFallback: 'owner@example.com', profileError: 'failed' }, global: { plugins: [router] } })
    const identity = wrapper.get('[data-testid="member-identity"]')
    expect(identity.text()).toBe('Hakobi')
    expect(identity.classes()).toEqual(expect.arrayContaining(['text-center', 'truncate']))
    await wrapper.get('button.text-red-700').trigger('click')
    expect(wrapper.emitted('retry-profile')).toHaveLength(1)
  })
  it('emits logout when the logout control is activated', async () => {
    const wrapper = mount(AppSidebar, { global: { plugins: [router] } })
    await wrapper.get('[data-testid="logout-button"]').trigger('click')
    expect(wrapper.emitted('logout')).toHaveLength(1)
  })

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
