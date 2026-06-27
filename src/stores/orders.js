import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const CATEGORIES = {
  PREORDER: 'preorder',
  AGENT: 'agent',
  PARCEL: 'parcel',
  MERCH: 'merch',
  MANGA: 'manga'
}

export const STATUSES = {
  PENDING: { label: '待處理', color: '#FFA500' },
  PROCESSING: { label: '處理中', color: '#1890FF' },
  SHIPPED: { label: '已出貨', color: '#52C41A' },
  DELIVERED: { label: '已交付', color: '#722ED1' },
  CANCELLED: { label: '已取消', color: '#F5222D' } 
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      category: orderData.category || '',
      name: orderData.name || '',
      platform: orderData.platform || '',
      status: orderData.status || 'PENDING',
      amount: orderData.amount || 0,
      currency: orderData.currency || 'TWD',
      depositPaid: orderData.depositPaid || 0,
      balanceDue: orderData.balanceDue || 0,
      paymentDueDate: orderData.paymentDueDate || null,
      estimatedArrival: orderData.estimatedArrival || null,
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
      byStatus: {
        pending: orders.value.filter(o => o.status === 'PENDING').length,
        processing: orders.value.filter(o => o.status === 'PROCESSING').length,
        shipped: orders.value.filter(o => o.status === 'SHIPPED').length,
        delivered: orders.value.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.value.filter(o => o.status === 'CANCELLED').length
      },
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
