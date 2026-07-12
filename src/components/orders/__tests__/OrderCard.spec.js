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
