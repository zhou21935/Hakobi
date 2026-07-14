import { describe, it, expect, beforeEach } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import OrderList from '@/views/OrderList.vue'
import { useOrdersStore } from '@/stores/orders'

const body = () => new DOMWrapper(document.body)

const routes = [{ path: '/orders/:category', name: 'OrderList', component: OrderList }]

let router
let store

beforeEach(async () => {
  setActivePinia(createPinia())
  store = useOrdersStore()
  router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/orders/agent')
  await router.isReady()
})

const mountOrderList = () => mount(OrderList, { global: { plugins: [router] }, attachTo: document.body })

describe('OrderList category route sync', () => {
  it('updates the page title when navigating from one category route to another', async () => {
    const wrapper = mountOrderList()
    expect(wrapper.get('h1').text()).toBe('海外代購')

    await router.push('/orders/parcel')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('h1').text()).toBe('集運包裹')

    wrapper.unmount()
  })

  it('updates the displayed order list and status counts when navigating from one category route to another', async () => {
    store.addOrder({ name: 'agent order', category: 'agent', amount: 10 })
    store.addOrder({ name: 'parcel order 1', category: 'parcel', amount: 20 })
    store.addOrder({ name: 'parcel order 2', category: 'parcel', amount: 30 })

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
    await body().find('input[type="number"]').setValue(50)

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
