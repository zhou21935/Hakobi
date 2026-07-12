import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrdersStore, CATEGORIES, CATEGORY_LABELS, PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from '@/stores/orders'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('CATEGORIES', () => {
  it('only contains agent and parcel', () => {
    expect(CATEGORIES).toEqual({ AGENT: 'agent', PARCEL: 'parcel' })
  })

  it('CATEGORY_LABELS only has labels for agent and parcel', () => {
    expect(CATEGORY_LABELS).toEqual({ agent: '海外代購', parcel: '集運包裹' })
  })
})

describe('addOrder isPreorder', () => {
  it('defaults isPreorder to false and does not include isConsolidated', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10 })
    expect(order.isPreorder).toBe(false)
    expect(order).not.toHaveProperty('isConsolidated')
  })

  it('accepts an explicit isPreorder value', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10, isPreorder: true })
    expect(order.isPreorder).toBe(true)
  })
})

describe('PRODUCT_CATEGORIES', () => {
  it('has exactly merch, book, and other', () => {
    expect(PRODUCT_CATEGORIES).toEqual({ MERCH: 'merch', BOOK: 'book', OTHER: 'other' })
  })

  it('PRODUCT_CATEGORY_LABELS has the corresponding Traditional Chinese labels', () => {
    expect(PRODUCT_CATEGORY_LABELS).toEqual({ merch: '周邊', book: '書籍', other: '其他' })
  })
})

describe('addOrder productCategories', () => {
  it('defaults productCategories to an empty array', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10 })
    expect(order.productCategories).toEqual([])
  })

  it('accepts an explicit productCategories array', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10, productCategories: ['merch', 'book'] })
    expect(order.productCategories).toEqual(['merch', 'book'])
  })
})
