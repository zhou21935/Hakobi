import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const CATEGORIES = {
  PREORDER: 'preorder',
  AGENT: 'agent',
  PARCEL: 'parcel',
  MERCH: 'merch',
  MANGA: 'manga'
}

export const CATEGORY_LABELS = {
  preorder: '預購商品',
  agent: '海外代購',
  parcel: '集運包裹',
  merch: '追星周邊',
  manga: '漫畫小說'
}

export const STATUSES = {
  CONSOLIDATING: { label: '集運中' },
  IN_TRANSIT: { label: '運送中' },
  ARRIVED: { label: '已抵台' },
  COMPLETED: { label: '已完成' }
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      category: orderData.category || '',
      name: orderData.name || '',
      platform: orderData.platform || '',
      productUrl: orderData.productUrl || '',
      status: orderData.status || 'CONSOLIDATING',
      amount: orderData.amount || 0,
      currency: orderData.currency || 'TWD',
      isPaid: orderData.isPaid || false,
      balanceDue: orderData.balanceDue || 0,
      orderDate: orderData.orderDate || null,
      paymentDueDate: orderData.paymentDueDate || null,
      estimatedShipDate: orderData.estimatedShipDate || null,
      estimatedArrivalDate: orderData.estimatedArrivalDate || null,
      isConsolidated: orderData.isConsolidated || false,
      trackingNumber: orderData.trackingNumber || '',
      shippingMethod: orderData.shippingMethod || '',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      ...orderData
    }
    orders.value.push(newOrder)
    return newOrder
  }

  const updateOrder = (id, orderData) => {
    const index = orders.value.findIndex(order => order.id === id)
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        ...orderData
      }
      return orders.value[index]
    }
    return null
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
      
      return result
    }
  })

  const stats = computed(() => {
    return {
      total: orders.value.length,
      byCategory: {
        preorder: orders.value.filter(o => o.category === CATEGORIES.PREORDER).length,
        agent: orders.value.filter(o => o.category === CATEGORIES.AGENT).length,
        parcel: orders.value.filter(o => o.category === CATEGORIES.PARCEL).length,
        merch: orders.value.filter(o => o.category === CATEGORIES.MERCH).length,
        manga: orders.value.filter(o => o.category === CATEGORIES.MANGA).length
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
