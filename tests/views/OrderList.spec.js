import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import OrderList from '@/views/OrderList.vue'
import { useOrdersStore } from '@/stores/orders'

const api = vi.hoisted(() => ({ listOrders: vi.fn(), createOrder: vi.fn(), updateOrder: vi.fn(), deleteOrder: vi.fn() }))
vi.mock('@/services/ordersApi', () => ({ ...api }))

let nextId = 1
const seed = (data) => store.orders.push({
  id: `order-${nextId++}`, status: 'AWAITING_SHIPMENT', orderDate: null, notes: '', ...data
})

const body = () => new DOMWrapper(document.body)

const routes = [{ path: '/orders/:category', name: 'OrderList', component: OrderList }]

let router
let store

beforeEach(async () => {
  setActivePinia(createPinia())
  store = useOrdersStore()
  store.initialized = true
  api.listOrders.mockReset().mockResolvedValue([])
  api.createOrder.mockReset().mockImplementation(async (input) => ({ id: `order-${nextId++}`, ...input }))
  api.updateOrder.mockReset()
  api.deleteOrder.mockReset()
  router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/orders/agent')
  await router.isReady()
})

const mountOrderList = () => mount(OrderList, { global: { plugins: [router] }, attachTo: document.body })

describe('OrderList category route sync', () => {
  it('shows only the category heading without the explanatory subtitle', async () => {
    const wrapper = mountOrderList()

    expect(wrapper.get('h1').text()).toBe('海外代購')
    expect(wrapper.text()).not.toContain('管理海外代購分類的訂單')

    await router.push('/orders/parcel')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('h1').text()).toBe('集運包裹')
    expect(wrapper.text()).not.toContain('管理集運包裹分類的訂單')

    wrapper.unmount()
  })

  it('places filters and the compact create action in a responsive toolbar before order content', () => {
    const wrapper = mountOrderList()
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
    expect(orderContent.text()).not.toContain('右上角')
    expect(orderContent.text()).toContain('點擊「新增訂單」開始記錄')

    wrapper.unmount()
  })

  it('updates the page title when navigating from one category route to another', async () => {
    const wrapper = mountOrderList()
    expect(wrapper.get('h1').text()).toBe('海外代購')

    await router.push('/orders/parcel')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('h1').text()).toBe('集運包裹')

    wrapper.unmount()
  })

  it('updates the displayed order list and status counts when navigating from one category route to another', async () => {
    seed({ name: 'agent order', category: 'agent', amount: 10, productCategories: ['merch'] })
    seed({ name: 'parcel order 1', category: 'parcel', amount: 20, productCategories: ['merch'] })
    seed({ name: 'parcel order 2', category: 'parcel', amount: 30, productCategories: ['merch'] })

    const wrapper = mountOrderList()
    expect(wrapper.text()).toContain('agent order')
    expect(wrapper.text()).not.toContain('parcel order 1')

    await router.push('/orders/parcel')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('agent order')
    expect(wrapper.text()).toContain('parcel order 1')
    expect(wrapper.text()).toContain('parcel order 2')

    const allTabButton = wrapper.findAll('button').find((b) => b.text().includes('全部'))
    expect(allTabButton).toBeTruthy()
    expect(allTabButton.text()).toContain('2')

    wrapper.unmount()
  })

  it('writes newly created orders to the currently active route category, not the category active at mount time', async () => {
    const wrapper = mountOrderList()

    await router.push('/orders/parcel')
    await wrapper.vm.$nextTick()

    const createButton = wrapper.findAll('button').find((b) => b.text().includes('新增訂單'))
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    await body().find('input[placeholder="請輸入商品名稱"]').setValue('切換後新增的訂單')
    await body().find('input[inputmode="decimal"]').setValue(50)

    const multiSelectButton = body()
      .findAll('button')
      .find((b) => b.text() !== '取消' && b.text() !== '送出' && b.text() === '請選擇商品分類')
    await multiSelectButton.trigger('click')
    const optionLabel = body().findAll('label').find((l) => l.text() === '周邊')
    await optionLabel.find('input[type="checkbox"]').setValue(true)

    const submitButton = body().findAll('button').find((b) => b.text() === '送出')
    await submitButton.trigger('click')
    await wrapper.vm.$nextTick()

    const created = store.orders.find((order) => order.name === '切換後新增的訂單')
    expect(created).toBeTruthy()
    expect(created.category).toBe('parcel')

    wrapper.unmount()
  })
})

describe('OrderList search and sort', () => {
  it('filters the list by search keyword', async () => {
    seed({ name: 'Widget Alpha', category: 'agent', amount: 10, productCategories: ['merch'] })
    seed({ name: 'Gadget Beta', category: 'agent', amount: 20, productCategories: ['merch'] })

    const wrapper = mountOrderList()
    await wrapper.get('input[placeholder="搜尋名稱或備註"]').setValue('Widget')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Widget Alpha')
    expect(wrapper.text()).not.toContain('Gadget Beta')

    wrapper.unmount()
  })

  it('sorts the list by amount when a sort option is selected', async () => {
    seed({ name: 'high', category: 'agent', amount: 30, productCategories: ['merch'] })
    seed({ name: 'low', category: 'agent', amount: 10, productCategories: ['merch'] })

    const wrapper = mountOrderList()
    await wrapper.get('select').setValue('amount-asc')
    await wrapper.vm.$nextTick()

    const names = wrapper.findAll('h3').map((h) => h.text())
    expect(names).toEqual(['low', 'high'])

    wrapper.unmount()
  })

  it('resets search and sort to defaults when navigating to a different category route', async () => {
    const wrapper = mountOrderList()
    await wrapper.get('input[placeholder="搜尋名稱或備註"]').setValue('some keyword')
    await wrapper.get('select').setValue('amount-asc')
    await wrapper.vm.$nextTick()

    await router.push('/orders/parcel')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('input[placeholder="搜尋名稱或備註"]').element.value).toBe('')
    expect(wrapper.get('select').element.value).toBe('')

    wrapper.unmount()
  })
})

describe('OrderList asynchronous states', () => {
  it('shows loading instead of the empty message while initial loading is active', () => {
    store.initialized = false
    store.isLoading = true
    const wrapper = mountOrderList()
    expect(wrapper.text()).toContain('載入訂單中')
    expect(wrapper.text()).not.toContain('尚無訂單')
    wrapper.unmount()
  })

  it('shows a load error and a retry control', async () => {
    store.error = '無法載入訂單'
    const wrapper = mountOrderList()
    expect(wrapper.get('[role="alert"]').text()).toContain('無法載入訂單')
    await wrapper.get('[data-testid="retry-orders"]').trigger('click')
    expect(api.listOrders).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})

describe('OrderList details integration', () => {
  it('uses the selected ID for live details and transitions to edit without another list request', async () => {
    seed({ id: 'selected-order', name: 'Tracked Book', category: 'agent', amount: 10, currency: 'TWD', isPaid: false, productCategories: ['book'], shippingMethod: 'DHL', trackingNumber: 'OLD', createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' })
    const wrapper = mountOrderList()
    await wrapper.get('button[aria-label="查看詳情"]').trigger('click')
    expect(api.listOrders).not.toHaveBeenCalled()
    const index = store.orders.findIndex(({ id }) => id === 'selected-order')
    store.orders[index] = { ...store.orders[index], shippingMethod: '日本郵便 EMS', trackingNumber: 'NEW' }
    await wrapper.vm.$nextTick()
    expect(body().text()).toContain('日本郵便 EMS')
    expect(body().text()).not.toContain('OLD')
    await body().find('button[aria-label="編輯訂單"]').trigger('click')
    expect(body().find('[data-testid="order-details-content"]').exists()).toBe(false)
    expect(body().text()).toContain('編輯訂單')
    expect(body().find('input[placeholder="例如 日本郵便 EMS"]').element.value).toBe('日本郵便 EMS')
    wrapper.unmount()
  })
})
