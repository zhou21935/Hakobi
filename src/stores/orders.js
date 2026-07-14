import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { normalizeOrderInput, validateOrder } from '@/domain/orderValidation'

export const CATEGORIES = {
  AGENT: 'agent',
  PARCEL: 'parcel'
}

export const CATEGORY_LABELS = {
  agent: '海外代購',
  parcel: '集運包裹'
}

export const PRODUCT_CATEGORIES = {
  MERCH: 'merch',
  BOOK: 'book',
  OTHER: 'other'
}

export const PRODUCT_CATEGORY_LABELS = {
  merch: '周邊',
  book: '書籍',
  other: '其他'
}

export const STATUSES = {
  AWAITING_SHIPMENT: { label: '待出貨' },
  CONSOLIDATING: { label: '集運中' },
  IN_TRANSIT: { label: '運送中' },
  ARRIVED: { label: '已抵台' },
  COMPLETED: { label: '已完成' }
}

const compareOrderDate = (a, b, direction) => {
  const aHasDate = !!a.orderDate
  const bHasDate = !!b.orderDate
  if (!aHasDate && !bHasDate) return 0
  if (!aHasDate) return 1
  if (!bHasDate) return -1
  return direction * a.orderDate.localeCompare(b.orderDate)
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  const addOrder = (orderData) => {
    const normalized = normalizeOrderInput(orderData)
    const { isValid } = validateOrder(normalized)
    if (!isValid) {
      return null
    }

    const newOrder = {
      id: Date.now(),
      category: normalized.category || '',
      name: normalized.name || '',
      platform: normalized.platform || '',
      productUrl: normalized.productUrl || '',
      status: normalized.status || 'AWAITING_SHIPMENT',
      amount: normalized.amount || 0,
      currency: normalized.currency || 'TWD',
      isPaid: normalized.isPaid || false,
      balanceDue: normalized.balanceDue || 0,
      orderDate: normalized.orderDate || null,
      paymentDueDate: normalized.paymentDueDate || null,
      estimatedShipDate: normalized.estimatedShipDate || null,
      estimatedArrivalDate: normalized.estimatedArrivalDate || null,
      isPreorder: normalized.isPreorder || false,
      productCategories: normalized.productCategories || [],
      trackingNumber: normalized.trackingNumber || '',
      shippingMethod: normalized.shippingMethod || '',
      notes: normalized.notes || '',
      createdAt: new Date().toISOString(),
      ...normalized
    }
    orders.value.push(newOrder)
    return newOrder
  }

  const updateOrder = (id, orderData) => {
    const index = orders.value.findIndex(order => order.id === id)
    if (index === -1) {
      return null
    }

    const merged = { ...orders.value[index], ...orderData }
    const normalized = normalizeOrderInput(merged)
    const { isValid } = validateOrder(normalized)
    if (!isValid) {
      return null
    }

    orders.value[index] = normalized
    return orders.value[index]
  }

  const deleteOrder = (id) => {
    const index = orders.value.findIndex(order => order.id === id)
    if (index !== -1) {
      orders.value.splice(index, 1)
      return true
    }
    return false
  }

  const getByCategory = computed(() => {
    return (category) => {
      return orders.value.filter(order => order.category === category)
    }
  })

  const SORT_COMPARATORS = {
    'amount-asc': (a, b) => (a.amount || 0) - (b.amount || 0),
    'amount-desc': (a, b) => (b.amount || 0) - (a.amount || 0),
    'date-asc': (a, b) => compareOrderDate(a, b, 1),
    'date-desc': (a, b) => compareOrderDate(a, b, -1)
  }

  const getFiltered = computed(() => {
    return (filters) => {
      let result = orders.value

      if (filters.category) {
        result = result.filter(order => order.category === filters.category)
      }

      if (filters.status) {
        result = result.filter(order => order.status === filters.status)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(order =>
          order.name?.toLowerCase().includes(searchLower) ||
          order.notes?.toLowerCase().includes(searchLower)
        )
      }

      const comparator = SORT_COMPARATORS[filters.sort]
      if (comparator) {
        result = [...result].sort(comparator)
      }

      return result
    }
  })

  const stats = computed(() => {
    return {
      total: orders.value.length,
      byCategory: {
        agent: orders.value.filter(o => o.category === CATEGORIES.AGENT).length,
        parcel: orders.value.filter(o => o.category === CATEGORIES.PARCEL).length
      },
      byStatus: Object.keys(STATUSES).reduce((acc, key) => {
        acc[key] = orders.value.filter(o => o.status === key).length
        return acc
      }, {}),
      totalAmount: orders.value.reduce((sum, order) => sum + (order.amount || 0), 0)
    }
  })

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getByCategory,
    getFiltered,
    stats
  }
}, {
  persist: true
})
