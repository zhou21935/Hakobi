import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue'

const body = () => new DOMWrapper(document.body)
const baseOrder = (overrides = {}) => ({
  id: 'order-a', category: 'agent', name: '限定版畫冊', platform: 'Amazon JP',
  productUrl: 'https://example.com/item/1', status: 'IN_TRANSIT', amount: 12000,
  currency: 'JPY', isPaid: false, orderDate: '2026-08-01', estimatedShipDate: '2026-08-10',
  estimatedArrivalDate: '2026-08-20', isPreorder: true, productCategories: ['book'],
  shippingMethod: '日本郵便 EMS', trackingNumber: 'EN123456789JP', notes: '合併寄送',
  createdAt: '2026-08-01T01:02:03.000Z', updatedAt: '2026-08-02T04:05:06.000Z', ...overrides
})
const mountDetails = (order = baseOrder()) => mount(OrderDetailsModal, {
  props: { modelValue: true, order }, attachTo: document.body
})

beforeEach(() => vi.useRealTimers())
afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); vi.useRealTimers() })

describe('OrderDetailsModal content', () => {
  it('displays complete order information in five sections', () => {
    const wrapper = mountDetails()
    const text = body().text()
    for (const heading of ['基本資料', '訂單資料', '物流資料', '日期資料', '系統資訊']) expect(text).toContain(heading)
    for (const value of ['限定版畫冊', 'Amazon JP', '書籍', 'JPY', '12,000', '未付款', '預購', '運送中', '日本郵便 EMS', 'EN123456789JP', '2026', '合併寄送']) expect(text).toContain(value)
    wrapper.unmount()
  })

  it('uses a consistent fallback for absent optional values', () => {
    const wrapper = mountDetails(baseOrder({ platform: '', productUrl: '', notes: '', orderDate: null, estimatedShipDate: null, estimatedArrivalDate: null, shippingMethod: '', trackingNumber: '' }))
    expect(body().findAll('[data-testid="empty-value"]').length).toBeGreaterThanOrEqual(7)
    expect(body().text()).toContain('尚未填寫')
    expect(body().find('[aria-label="複製追蹤號碼"]').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('OrderDetailsModal actions', () => {
  it('copies the exact tracking number and resets temporary success feedback', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mountDetails()
    await body().find('[aria-label="複製追蹤號碼"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('EN123456789JP')
    expect(body().text()).toContain('已複製 ✓')
    await vi.advanceTimersByTimeAsync(2000)
    expect(body().text()).not.toContain('已複製 ✓')
    wrapper.unmount()
  })

  it('keeps the tracking number visible and reports clipboard failure', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const wrapper = mountDetails()
    await body().find('[aria-label="複製追蹤號碼"]').trigger('click')
    expect(body().text()).toContain('EN123456789JP')
    expect(body().text()).toContain('複製失敗，請手動選取')
    wrapper.unmount()
  })

  it('fails visibly when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    const wrapper = mountDetails()
    await body().find('[aria-label="複製追蹤號碼"]').trigger('click')
    expect(body().text()).toContain('複製失敗，請手動選取')
    wrapper.unmount()
  })

  it.each(['https://example.com/item/1', 'http://example.com/item/1'])('renders a safe product link for %s', (productUrl) => {
    const wrapper = mountDetails(baseOrder({ productUrl }))
    const link = body().find('a[aria-label="開啟商品頁"]')
    expect(link.attributes('href')).toBe(productUrl)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
    expect(link.attributes('rel')).toContain('noreferrer')
    wrapper.unmount()
  })

  it.each(['', 'javascript:alert(1)', 'example.com/item/1'])('does not render a link for unsafe product URL %j', (productUrl) => {
    const wrapper = mountDetails(baseOrder({ productUrl }))
    expect(body().find('a[aria-label="開啟商品頁"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('emits close and edit as separate actions', async () => {
    const wrapper = mountDetails()
    await body().find('button[aria-label="編輯訂單"]').trigger('click')
    expect(wrapper.emitted('edit')).toEqual([[baseOrder()]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })
})

describe('OrderDetailsModal narrow layout', () => {
  it('wraps long values and exposes accessible actions at 375px', () => {
    window.innerWidth = 375
    const wrapper = mountDetails(baseOrder({ shippingMethod: '超長物流方式'.repeat(200) }))
    const content = body().find('[data-testid="order-details-content"]')
    expect(content.attributes('class')).toContain('min-w-0')
    expect(content.findAll('.break-words').length).toBeGreaterThan(0)
    for (const label of ['關閉訂單詳情', '編輯訂單', '複製追蹤號碼', '開啟商品頁']) expect(body().find(`[aria-label="${label}"]`).exists()).toBe(true)
    wrapper.unmount()
  })
})
