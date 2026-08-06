import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderCard from '@/components/orders/OrderCard.vue'

const baseOrder = {
  id: 1,
  name: '測試商品',
  status: 'AWAITING_SHIPMENT',
  amount: 100,
  currency: 'TWD',
  isPreorder: false,
  productCategories: []
}

describe('OrderCard preorder tag', () => {
  it('shows a "預購" tag next to the status badge when isPreorder is true', () => {
    const wrapper = mount(OrderCard, { props: { order: { ...baseOrder, isPreorder: true } } })
    expect(wrapper.text()).toContain('預購')
  })

  it('does not show a "預購" tag when isPreorder is false', () => {
    const wrapper = mount(OrderCard, { props: { order: { ...baseOrder, isPreorder: false } } })
    expect(wrapper.text()).not.toContain('預購')
  })
})

describe('OrderCard product category tags', () => {
  it.each([
    [['merch'], ['周邊']],
    [['book', 'other'], ['書籍', '其他']],
    [['merch', 'book', 'other'], ['周邊', '書籍', '其他']]
  ])('renders tags %j as %j', (productCategories, expectedLabels) => {
    const wrapper = mount(OrderCard, { props: { order: { ...baseOrder, productCategories } } })
    for (const label of expectedLabels) {
      expect(wrapper.text()).toContain(label)
    }
  })

  it('renders tags in the fixed order 周邊, 書籍, 其他 regardless of selection order', () => {
    const wrapper = mount(OrderCard, {
      props: { order: { ...baseOrder, productCategories: ['other', 'merch'] } }
    })
    const text = wrapper.text()
    expect(text.indexOf('周邊')).toBeLessThan(text.indexOf('其他'))
  })

  it('renders no product category tags when productCategories is empty', () => {
    const wrapper = mount(OrderCard, { props: { order: { ...baseOrder, productCategories: [] } } })
    expect(wrapper.text()).not.toContain('周邊')
    expect(wrapper.text()).not.toContain('書籍')
    expect(wrapper.text()).not.toContain('其他')
  })
})

describe('OrderCard narrow viewport layout', () => {
  it('stacks the info and action columns on narrow viewports and rows them on wider viewports', () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    const row = wrapper.get('[data-testid="order-card-row"]')
    expect(row.classes()).toContain('flex-col')
    expect(row.classes()).toContain('sm:flex-row')
  })

  it('keeps the tag container wrapping so tags never overflow the card', () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    expect(wrapper.get('[data-testid="order-card-tags"]').classes()).toContain('flex-wrap')
  })
})

describe('OrderCard actions', () => {
  it('emits distinct details, edit, and delete events only from their controls', async () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    const details = wrapper.get('button[aria-label="查看詳情"]')
    const edit = wrapper.get('button[aria-label="編輯"]')
    const remove = wrapper.get('button[aria-label="刪除"]')
    for (const button of [details, edit, remove]) {
      expect(button.classes()).toContain('w-10')
      expect(button.classes()).toContain('h-10')
    }
    await wrapper.get('[data-testid="order-card-row"]').trigger('click')
    expect(wrapper.emitted('details')).toBeUndefined()
    await details.trigger('click')
    expect(wrapper.emitted('details')).toEqual([[baseOrder]])
    expect(wrapper.emitted('edit')).toBeUndefined()
    expect(wrapper.emitted('request-delete')).toBeUndefined()
    await edit.trigger('click')
    await remove.trigger('click')
    expect(wrapper.emitted('edit')).toEqual([[baseOrder]])
    expect(wrapper.emitted('request-delete')).toEqual([[baseOrder.id]])
  })
})
