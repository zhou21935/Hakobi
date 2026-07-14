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
    const order = store.addOrder({ name: 'test', amount: 10, productCategories: ['merch'] })
    expect(order.isPreorder).toBe(false)
    expect(order).not.toHaveProperty('isConsolidated')
  })

  it('accepts an explicit isPreorder value', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10, productCategories: ['merch'], isPreorder: true })
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
  it('rejects an order created without productCategories, since an omitted list is no longer defaulted', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10 })
    expect(order).toBeNull()
  })

  it('accepts an explicit productCategories array', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10, productCategories: ['merch', 'book'] })
    expect(order.productCategories).toEqual(['merch', 'book'])
  })
})

describe('addOrder validation', () => {
  it('rejects an empty name and does not add the order', () => {
    const store = useOrdersStore()
    const result = store.addOrder({ name: '', amount: 10, productCategories: ['merch'] })
    expect(result).toBeNull()
    expect(store.orders).toHaveLength(0)
  })

  it('rejects a non-positive amount and does not add the order', () => {
    const store = useOrdersStore()
    const result = store.addOrder({ name: 'test', amount: 0, productCategories: ['merch'] })
    expect(result).toBeNull()
    expect(store.orders).toHaveLength(0)
  })

  it('rejects an empty productCategories array and does not add the order', () => {
    const store = useOrdersStore()
    const result = store.addOrder({ name: 'test', amount: 10, productCategories: [] })
    expect(result).toBeNull()
    expect(store.orders).toHaveLength(0)
  })

  it('normalizes name and amount before storing a valid order', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: '  test  ', amount: '10', productCategories: ['merch'] })
    expect(order.name).toBe('test')
    expect(order.amount).toBe(10)
  })
})

describe('getFiltered sort', () => {
  it('sorts by amount ascending', () => {
    const store = useOrdersStore()
    store.addOrder({ name: 'c', amount: 30, productCategories: ['merch'] })
    store.addOrder({ name: 'a', amount: 10, productCategories: ['merch'] })
    store.addOrder({ name: 'b', amount: 20, productCategories: ['merch'] })

    const result = store.getFiltered({ sort: 'amount-asc' })

    expect(result.map((o) => o.amount)).toEqual([10, 20, 30])
  })

  it('sorts by amount descending', () => {
    const store = useOrdersStore()
    store.addOrder({ name: 'c', amount: 30, productCategories: ['merch'] })
    store.addOrder({ name: 'a', amount: 10, productCategories: ['merch'] })
    store.addOrder({ name: 'b', amount: 20, productCategories: ['merch'] })

    const result = store.getFiltered({ sort: 'amount-desc' })

    expect(result.map((o) => o.amount)).toEqual([30, 20, 10])
  })

  it('returns the unsorted filtered order when sort is omitted or not a recognized value', () => {
    const store = useOrdersStore()
    store.addOrder({ name: 'c', amount: 30, productCategories: ['merch'] })
    store.addOrder({ name: 'a', amount: 10, productCategories: ['merch'] })
    store.addOrder({ name: 'b', amount: 20, productCategories: ['merch'] })

    const withoutSort = store.getFiltered({})
    const withInvalidSort = store.getFiltered({ sort: 'not-a-real-option' })

    expect(withoutSort.map((o) => o.name)).toEqual(['c', 'a', 'b'])
    expect(withInvalidSort.map((o) => o.name)).toEqual(['c', 'a', 'b'])
  })

  it('does not mutate the underlying orders array order', () => {
    const store = useOrdersStore()
    store.addOrder({ name: 'c', amount: 30, productCategories: ['merch'] })
    store.addOrder({ name: 'a', amount: 10, productCategories: ['merch'] })
    store.addOrder({ name: 'b', amount: 20, productCategories: ['merch'] })

    store.getFiltered({ sort: 'amount-asc' })

    expect(store.orders.map((o) => o.name)).toEqual(['c', 'a', 'b'])
  })

  it('sorts by orderDate ascending, with orders missing an orderDate placed last', () => {
    const store = useOrdersStore()
    store.addOrder({ name: 'no-date', amount: 10, productCategories: ['merch'], orderDate: '' })
    store.addOrder({ name: 'later', amount: 10, productCategories: ['merch'], orderDate: '2026-02-10' })
    store.addOrder({ name: 'earlier', amount: 10, productCategories: ['merch'], orderDate: '2026-01-05' })

    const result = store.getFiltered({ sort: 'date-asc' })

    expect(result.map((o) => o.name)).toEqual(['earlier', 'later', 'no-date'])
  })

  it('sorts by orderDate descending, with orders missing an orderDate still placed last', () => {
    const store = useOrdersStore()
    store.addOrder({ name: 'no-date', amount: 10, productCategories: ['merch'], orderDate: '' })
    store.addOrder({ name: 'later', amount: 10, productCategories: ['merch'], orderDate: '2026-02-10' })
    store.addOrder({ name: 'earlier', amount: 10, productCategories: ['merch'], orderDate: '2026-01-05' })

    const result = store.getFiltered({ sort: 'date-desc' })

    expect(result.map((o) => o.name)).toEqual(['later', 'earlier', 'no-date'])
  })
})

describe('updateOrder validation', () => {
  it('rejects an update that would make the name empty and leaves the order unchanged', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10, productCategories: ['merch'] })

    const result = store.updateOrder(order.id, { name: '' })

    expect(result).toBeNull()
    expect(store.orders.find((o) => o.id === order.id).name).toBe('test')
  })

  it('accepts a partial update that omits name/amount/productCategories when the merged result stays valid', () => {
    const store = useOrdersStore()
    const order = store.addOrder({ name: 'test', amount: 10, productCategories: ['merch'] })

    const result = store.updateOrder(order.id, { isPaid: true })

    expect(result).not.toBeNull()
    expect(result.isPaid).toBe(true)
    expect(result.name).toBe('test')
    expect(result.amount).toBe(10)
    expect(result.productCategories).toEqual(['merch'])
  })
})
