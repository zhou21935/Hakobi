import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue'

const body = () => new DOMWrapper(document.body)
const baseOrder = (overrides = {}) => ({
  id: 'order-a', category: 'agent', name: '限定版畫冊', platform: 'Amazon JP',
  productUrl: 'https://example.com/item/1', status: 'IN_TRANSIT', amount: 12000,
  currency: 'JPY', isPaid: false, orderDate: '2026-08-01', estimatedShipDate: '2026-08-10',
  estimatedArrivalDate: '2026-08-20', isPreorder: true, productCategories: ['book'],
  orderNumber: '114-2938471-0038', shippingMethod: '日本郵便 EMS', trackingNumber: 'EN123456789JP', notes: '合併寄送',
  createdAt: '2026-08-01T01:02:03.000Z', updatedAt: '2026-08-02T04:05:06.000Z', ...overrides
})
const mountDetails = (order = baseOrder(), extraProps = {}) => mount(OrderDetailsModal, {
  props: { modelValue: true, order, ...extraProps }, attachTo: document.body
})

beforeEach(() => vi.useRealTimers())
afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); vi.useRealTimers() })

describe('OrderDetailsModal content', () => {
  it('displays complete order information in five sections', () => {
    const wrapper = mountDetails()
    const text = body().text()
    for (const heading of ['基本資料', '訂單資料', '物流資料', '日期資料', '系統資訊']) expect(text).toContain(heading)
    for (const value of ['限定版畫冊', 'Amazon JP', '書籍', '114-2938471-0038', 'JPY', '12,000', '未付款', '預購', '運送中', '日本郵便 EMS', 'EN123456789JP', '2026', '合併寄送']) expect(text).toContain(value)
    wrapper.unmount()
  })

  it('uses a consistent fallback for absent optional values', () => {
    const wrapper = mountDetails(baseOrder({ platform: '', productUrl: '', notes: '', orderDate: null, estimatedShipDate: null, estimatedArrivalDate: null, shippingMethod: '', trackingNumber: '' }))
    expect(body().findAll('[data-testid="empty-value"]').length).toBeGreaterThanOrEqual(7)
    expect(body().text()).toContain('尚未填寫')
    expect(body().find('[aria-label="複製 追蹤號碼"]').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('OrderDetailsModal actions', () => {
  it('shows confirmed attachments and emits download and delete actions', async () => {
    const attachment = { id: 'attachment-a', orderId: 'order-a', name: 'receipt.pdf', mimeType: 'application/pdf', size: 4, createdAt: '2026-08-13T12:00:00.000Z' }
    const wrapper = mountDetails(baseOrder(), { attachments: [attachment] })

    expect(body().text()).toContain('receipt.pdf')
    await body().find('[aria-label="下載 receipt.pdf"]').trigger('click')
    await body().find('[aria-label="刪除 receipt.pdf"]').trigger('click')

    expect(wrapper.emitted('download-attachment')).toEqual([[attachment]])
    expect(wrapper.emitted('delete-attachment')).toEqual([[attachment]])
    wrapper.unmount()
  })

  it('copies the exact tracking number and resets temporary success feedback', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mountDetails()
    await body().find('[aria-label="複製 追蹤號碼"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('EN123456789JP')
    expect(body().text()).toContain('已複製 ✓')
    await vi.advanceTimersByTimeAsync(2000)
    expect(body().text()).not.toContain('已複製 ✓')
    wrapper.unmount()
  })

  it('copies the exact order number independently from the tracking number', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mountDetails()

    await body().find('[aria-label="複製 訂單號碼"]').trigger('click')

    expect(writeText).toHaveBeenCalledWith('114-2938471-0038')
    expect(body().find('[aria-label="複製 訂單號碼"]').text()).toBe('已複製 ✓')
    expect(body().find('[aria-label="複製 追蹤號碼"]').text()).toBe('複製')
    wrapper.unmount()
  })

  it('keeps the tracking number visible and reports clipboard failure', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const wrapper = mountDetails()
    await body().find('[aria-label="複製 追蹤號碼"]').trigger('click')
    expect(body().text()).toContain('EN123456789JP')
    expect(body().text()).toContain('複製失敗，請手動選取')
    wrapper.unmount()
  })

  it('fails visibly when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    const wrapper = mountDetails()
    await body().find('[aria-label="複製 追蹤號碼"]').trigger('click')
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
    for (const label of ['關閉訂單詳情', '編輯訂單', '複製 訂單號碼', '複製 追蹤號碼', '開啟商品頁']) expect(body().find(`[aria-label="${label}"]`).exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('OrderDetailsModal responsive information groups', () => {
  it('renders four warm-purple cards with one-column mobile and two-column desktop grids', () => {
    const wrapper = mountDetails()
    const cards = body().findAll('[data-testid="order-detail-card"]')

    expect(cards).toHaveLength(4)
    for (const card of cards) {
      expect(card.classes()).toContain('rounded-card')
      expect(card.classes()).toContain('bg-accentcard-from/35')
      const fields = card.find('dl')
      expect(fields.classes()).toContain('grid-cols-1')
      expect(fields.classes()).toContain('sm:grid-cols-2')
    }
    wrapper.unmount()
  })

  it('renders lower-emphasis system information outside the primary cards', () => {
    const wrapper = mountDetails()
    const systemInfo = body().find('[data-testid="order-system-info"]')

    expect(systemInfo.classes()).toContain('border-t')
    expect(systemInfo.classes()).toContain('text-ink-muted')
    expect(systemInfo.attributes('data-testid')).not.toBe('order-detail-card')
    wrapper.unmount()
  })

  it('keeps footer actions outside the independently scrolling content region', () => {
    const wrapper = mountDetails()
    const scrollArea = body().find('.modal-scroll-area')
    const detailsContent = body().find('[data-testid="order-details-content"]')

    expect(scrollArea.find('[aria-label="關閉訂單詳情"]').exists()).toBe(false)
    expect(body().find('[aria-label="關閉訂單詳情"]').exists()).toBe(true)
    expect(detailsContent.classes()).not.toContain('overflow-x-hidden')
    wrapper.unmount()
  })

  it('shows business dates without time and system timestamps in Taipei 24-hour format', () => {
    const wrapper = mountDetails(baseOrder({
      orderDate: '2026-08-05T16:00:00.000Z',
      estimatedShipDate: '2026-08-09T16:00:00.000Z',
      estimatedArrivalDate: '2026-08-11T16:00:00.000Z',
      createdAt: '2026-08-06T14:55:00.000Z',
      updatedAt: '2026-08-06T14:55:00.000Z'
    }))
    const text = body().text()

    for (const date of ['2026/08/05', '2026/08/09', '2026/08/11']) expect(text).toContain(date)
    expect(text).not.toContain('16:00')
    expect(text.match(/2026\/08\/06 22:55/g)).toHaveLength(2)
    wrapper.unmount()
  })
})
