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
  productCategories: [],
  estimatedShipDate: null
}

const completeOrder = {
  ...baseOrder,
  name: 'test',
  amount: 50,
  isPreorder: true,
  productCategories: ['merch'],
  estimatedShipDate: '2026-08-09T16:00:00.000Z'
}

describe('OrderCard three-row information layout', () => {
  it('groups tags, primary information and actions, then the estimated ship date', () => {
    const wrapper = mount(OrderCard, { props: { order: completeOrder } })
    const tags = wrapper.get('[data-testid="order-card-tags"]')
    const primary = wrapper.get('[data-testid="order-card-primary"]')
    const shipping = wrapper.get('[data-testid="order-card-shipping"]')

    expect(tags.text()).toContain('待出貨')
    expect(tags.text()).toContain('預購')
    expect(tags.text()).toContain('周邊')
    expect(primary.text()).toContain('test')
    expect(primary.text()).toContain('NT$50')
    expect(primary.findAll('button')).toHaveLength(3)
    expect(shipping.text()).toBe('預計出貨日 2026-08-09')
    expect(shipping.text()).not.toContain('T16:00:00.000Z')
  })

  it('omits optional tag and shipping content without placeholders', () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    expect(wrapper.get('[data-testid="order-card-tags"]').text()).not.toContain('預購')
    expect(wrapper.get('[data-testid="order-card-tags"]').text()).not.toContain('周邊')
    expect(wrapper.find('[data-testid="order-card-shipping"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('預計出貨日')
  })
})

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
  it('uses a mobile grid and restores the existing primary flex row at the sm breakpoint', () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    const body = wrapper.get('[data-testid="order-card-body"]')
    const primary = wrapper.get('[data-testid="order-card-primary"]')
    expect(body.classes()).toContain('grid')
    expect(body.classes()).toContain('sm:block')
    expect(primary.classes()).toContain('contents')
    expect(primary.classes()).toContain('sm:flex-row')
  })

  it('keeps the tag container wrapping so tags never overflow the card', () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    expect(wrapper.get('[data-testid="order-card-tags"]').classes()).toContain('flex-wrap')
  })

  it('keeps action controls grouped and shipping information in its own final row', () => {
    const wrapper = mount(OrderCard, { props: { order: completeOrder } })
    expect(wrapper.get('[data-testid="order-card-actions"]').classes()).toContain('row-start-2')
    expect(wrapper.get('[data-testid="order-card-shipping"]').classes()).toContain('row-start-2')
    expect(wrapper.get('[data-testid="order-card-shipping"]').classes()).not.toContain('border-t')
  })
})

describe('OrderCard actions', () => {
  it('renders details as text and edit and delete as inline SVG icons without emoji', () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    const details = wrapper.get('button[aria-label="查看詳情"]')
    const edit = wrapper.get('button[aria-label="編輯"]')
    const remove = wrapper.get('button[aria-label="刪除"]')

    expect(details.text()).toBe('訂單詳情')
    expect(details.find('svg').exists()).toBe(false)
    for (const button of [edit, remove]) {
      expect(button.find('svg').exists()).toBe(true)
    }
    expect(wrapper.text()).not.toMatch(/[👁✏🗑]/u)
  })

  it('emits distinct details, edit, and delete events only from their controls', async () => {
    const wrapper = mount(OrderCard, { props: { order: baseOrder } })
    const details = wrapper.get('button[aria-label="查看詳情"]')
    const edit = wrapper.get('button[aria-label="編輯"]')
    const remove = wrapper.get('button[aria-label="刪除"]')
    for (const button of [details, edit, remove]) {
      expect(button.classes()).toContain('h-10')
    }
    for (const button of [edit, remove]) {
      expect(button.classes()).toContain('w-10')
    }
    await wrapper.get('[data-testid="order-card-primary"]').trigger('click')
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
