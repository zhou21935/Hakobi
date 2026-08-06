import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AllOrders from '@/views/AllOrders.vue'
import { useOrdersStore } from '@/stores/orders'

const api = vi.hoisted(() => ({ listOrders: vi.fn(), createOrder: vi.fn(), updateOrder: vi.fn(), deleteOrder: vi.fn() }))
vi.mock('@/services/ordersApi', () => ({ ...api }))

const body = () => new DOMWrapper(document.body)
const order = (overrides = {}) => ({ id: 'order-a', category: 'agent', name: 'Book', platform: '', productUrl: '', status: 'AWAITING_SHIPMENT', amount: 10, currency: 'TWD', isPaid: false, orderDate: null, estimatedShipDate: null, estimatedArrivalDate: null, isPreorder: false, productCategories: ['book'], shippingMethod: 'DHL', trackingNumber: 'OLD', notes: '', createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z', ...overrides })
let store

beforeEach(() => {
  setActivePinia(createPinia())
  store = useOrdersStore()
  store.initialized = true
  store.orders = [order()]
  vi.clearAllMocks()
})
afterEach(() => { document.body.innerHTML = '' })

describe('AllOrders details integration', () => {
  it('opens details from the confirmed collection without another API request and follows replacements by ID', async () => {
    const wrapper = mount(AllOrders, { attachTo: document.body })
    await wrapper.get('button[aria-label="查看詳情"]').trigger('click')
    expect(body().text()).toContain('DHL')
    expect(api.listOrders).not.toHaveBeenCalled()
    store.orders[0] = order({ shippingMethod: '日本郵便 EMS', trackingNumber: 'NEW' })
    await wrapper.vm.$nextTick()
    expect(body().text()).toContain('日本郵便 EMS')
    expect(body().text()).toContain('NEW')
    expect(body().text()).not.toContain('OLD')
    wrapper.unmount()
  })

  it('closes details and opens the existing edit form for the same order', async () => {
    const wrapper = mount(AllOrders, { attachTo: document.body })
    await wrapper.get('button[aria-label="查看詳情"]').trigger('click')
    await body().find('button[aria-label="編輯訂單"]').trigger('click')
    expect(body().text()).not.toContain('訂單詳情')
    expect(body().text()).toContain('編輯訂單')
    expect(body().find('input[placeholder="例如 日本郵便 EMS"]').element.value).toBe('DHL')
    const updated = order({ shippingMethod: '日本郵便 EMS', trackingNumber: 'NEW' })
    api.updateOrder.mockResolvedValue(updated)
    await body().find('input[placeholder="例如 日本郵便 EMS"]').setValue('日本郵便 EMS')
    await body().find('input[placeholder="例如 EN123456789JP"]').setValue('NEW')
    await body().findAll('button').find((button) => button.text() === '送出').trigger('click')
    await flushPromises()
    await wrapper.get('button[aria-label="查看詳情"]').trigger('click')
    expect(body().text()).toContain('日本郵便 EMS')
    expect(body().text()).toContain('NEW')
    wrapper.unmount()
  })
})
