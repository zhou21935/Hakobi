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
    expect(body().find('[data-testid="order-details-content"]').exists()).toBe(false)
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

describe('AllOrders create integration', () => {
  it('renders the consolidated order overview heading', () => {
    const wrapper = mount(AllOrders)
    expect(wrapper.get('h1').text()).toBe('訂單總覽')
  })

  it('places filters and the compact create action in a responsive toolbar before order content', () => {
    const wrapper = mount(AllOrders, { attachTo: document.body })
    const toolbar = wrapper.get('[data-testid="order-toolbar"]')
    const statusFilters = wrapper.get('[data-testid="status-filters"]')
    const createAction = wrapper.get('[data-testid="create-order-action"]')
    const orderContent = wrapper.get('[data-testid="order-content"]')

    expect(statusFilters.element.parentElement).toBe(toolbar.element)
    expect(createAction.element.parentElement).toBe(toolbar.element)
    expect(toolbar.classes()).toEqual(expect.arrayContaining(['max-w-6xl', 'flex-col', 'md:flex-row', 'md:justify-between']))
    expect(toolbar.element.compareDocumentPosition(orderContent.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(createAction.classes()).toContain('justify-end')
    expect(createAction.classes()).toContain('md:shrink-0')
    expect(createAction.get('button').classes()).not.toContain('w-full')

    wrapper.unmount()
  })

  it('creates an order with the category selected in the shared form and keeps the form open on failure', async () => {
    const created = order({ id: 'order-b', category: 'parcel', name: 'Parcel' })
    api.createOrder.mockResolvedValueOnce(created)
    const wrapper = mount(AllOrders, { attachTo: document.body })
    await wrapper.get('[data-testid="create-order"]').trigger('click')
    await body().find('input[placeholder="請輸入商品名稱"]').setValue('Parcel')
    await body().find('input[inputmode="decimal"]').setValue(10)
    await body().find('[data-testid="order-category"]').setValue('parcel')
    const productButton = body().findAll('button').find((button) => button.text() === '請選擇商品分類')
    await productButton.trigger('click')
    await body().findAll('label').find((label) => label.text() === '書籍').find('input').setValue(true)
    await body().findAll('button').find((button) => button.text() === '送出').trigger('click')
    await flushPromises()
    expect(api.createOrder).toHaveBeenCalledWith(expect.objectContaining({ category: 'parcel' }))
    expect(body().findAll('h2').some((heading) => heading.text() === '新增訂單')).toBe(false)

    api.createOrder.mockRejectedValueOnce(new Error('create failed'))
    await wrapper.get('[data-testid="create-order"]').trigger('click')
    await body().find('input[placeholder="請輸入商品名稱"]').setValue('Retry')
    await body().find('input[inputmode="decimal"]').setValue(10)
    await body().find('[data-testid="order-category"]').setValue('agent')
    await body().findAll('button').find((button) => button.text() === '請選擇商品分類').trigger('click')
    await body().findAll('label').find((label) => label.text() === '書籍').find('input').setValue(true)
    await body().findAll('button').find((button) => button.text() === '送出').trigger('click')
    await flushPromises()
    expect(body().text()).toContain('新增訂單')
    expect(body().find('input[placeholder="請輸入商品名稱"]').element.value).toBe('Retry')
    wrapper.unmount()
  })
})

describe('AllOrders delete undo integration', () => {
  it('shows an untimed undo after confirmation and restores without deleting', async () => {
    const wrapper = mount(AllOrders, { attachTo: document.body })
    await wrapper.get('button[aria-label="刪除"]').trigger('click')
    expect(body().text()).toContain('如刪除後欲恢復可使用下方「復原」按鈕取消刪除。')
    const warning = body().find('[data-testid="delete-undo-warning"]')
    expect(warning.text()).toBe('請留意：一旦重新整理或離開本頁面，已刪除之資料將無法再復原。')
    expect(warning.classes()).toContain('text-red-600')
    const prompt = body().find('[data-testid="delete-confirm-prompt"]')
    expect(prompt.classes()).toContain('text-ink')
    expect(prompt.classes()).toContain('font-semibold')
    const title = body().find('[data-testid="modal-title"]')
    expect(title.classes()).toContain('font-semibold')
    await body().findAll('button').find((button) => button.text() === '刪除').trigger('click')
    expect(wrapper.findAll('button[aria-label="刪除"]')).toHaveLength(0)
    expect(body().find('[data-testid="undo-delete"]').exists()).toBe(true)
    expect(body().text()).not.toMatch(/\d+\s*秒/)
    await body().find('[data-testid="undo-delete"]').trigger('click')
    expect(wrapper.findAll('button[aria-label="刪除"]')).toHaveLength(1)
    expect(api.deleteOrder).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('finalizes a pending deletion when the order view unmounts', async () => {
    api.deleteOrder.mockResolvedValue(undefined)
    const wrapper = mount(AllOrders, { attachTo: document.body })
    await wrapper.get('button[aria-label="刪除"]').trigger('click')
    await body().findAll('button').find((button) => button.text() === '刪除').trigger('click')
    wrapper.unmount()
    await flushPromises()
    expect(api.deleteOrder).toHaveBeenCalledWith('order-a', { keepalive: false })
  })
})
