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
