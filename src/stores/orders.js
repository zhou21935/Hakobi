import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { normalizeOrderInput, validateOrder } from '@/domain/orderValidation'
import * as ordersApi from '@/services/ordersApi'
import { useAuthStore } from '@/stores/auth'

const PENDING_DELETE_STORAGE_KEY = 'hakobi.pending-order-deletes'

const readPersistedDeleteIds = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(PENDING_DELETE_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id) => typeof id === 'string' && id.length > 0))] : []
  } catch {
    return []
  }
}

const writePersistedDeleteIds = (ids) => {
  try {
    if (ids.length > 0) localStorage.setItem(PENDING_DELETE_STORAGE_KEY, JSON.stringify(ids))
    else localStorage.removeItem(PENDING_DELETE_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

const persistDeleteId = (id) => writePersistedDeleteIds([...new Set([...readPersistedDeleteIds(), id])])
const forgetDeleteId = (id) => writePersistedDeleteIds(readPersistedDeleteIds().filter((storedId) => storedId !== id))

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
  const isLoading = ref(false)
  const isMutating = ref(false)
  const initialized = ref(false)
  const error = ref(null)
  const pendingDelete = ref(null)
  const attachmentStatuses = ref({})

  const storeError = (caught) => {
    if (caught?.status === 401 || caught?.code === 'AUTH_UNAUTHORIZED') {
      clearOrders()
      useAuthStore().clearSession()
    }
    error.value = caught?.message || '訂單操作失敗'
    return caught
  }

  const localError = (code, message) => Object.assign(new Error(message), { code, status: null })

  const loadOrders = async () => {
    if (isLoading.value) return
    isLoading.value = true
    error.value = null
    try {
      const deletionIdsAtLoadStart = readPersistedDeleteIds()
      await finalizePersistedDeletes()
      const persistedDeleteIds = new Set([...deletionIdsAtLoadStart, ...readPersistedDeleteIds()])
      orders.value = (await ordersApi.listOrders()).filter(({ id }) => !persistedDeleteIds.has(id))
    } catch (caught) {
      throw storeError(caught)
    } finally {
      isLoading.value = false
      initialized.value = true
    }
  }

  const retry = () => loadOrders()

  const mutate = async (operation) => {
    if (isMutating.value) throw localError('MUTATION_IN_PROGRESS', '已有訂單操作進行中')
    isMutating.value = true
    error.value = null
    try { return await operation() } catch (caught) { throw storeError(caught) } finally { isMutating.value = false }
  }

  const finalizePersistedDeletes = async () => {
    await Promise.all(readPersistedDeleteIds().map(async (id) => {
      try {
        await ordersApi.deleteOrder(id, { keepalive: true })
        forgetDeleteId(id)
      } catch (caught) {
        if (caught?.status === 404) forgetDeleteId(id)
      }
    }))
  }

  const uploadFiles = async (orderId, files) => {
    const settled = await Promise.allSettled(files.map((file) => ordersApi.uploadAttachment(orderId, file)))
    const confirmed = []
    const failed = []
    settled.forEach((result, index) => {
      if (result.status === 'fulfilled') confirmed.push(result.value)
      else failed.push({ file: files[index], name: files[index].name, code: result.reason?.code || 'UPLOAD_FAILED', message: result.reason?.message || '附件上傳失敗' })
    })
    attachmentStatuses.value[orderId] = { confirmed, failed }
    return attachmentStatuses.value[orderId]
  }

  const attachmentStatusFor = (orderId) => attachmentStatuses.value[orderId] || { confirmed: [], failed: [] }

  const retryAttachment = async (orderId, file) => {
    const status = attachmentStatusFor(orderId)
    try {
      const confirmed = await ordersApi.uploadAttachment(orderId, file)
      attachmentStatuses.value[orderId] = { confirmed: [...status.confirmed, confirmed], failed: status.failed.filter((failure) => failure.file !== file) }
      return confirmed
    } catch (caught) {
      attachmentStatuses.value[orderId] = { confirmed: status.confirmed, failed: status.failed.map((failure) => failure.file === file ? { ...failure, code: caught?.code || 'UPLOAD_FAILED', message: caught?.message || '附件上傳失敗' } : failure) }
      throw storeError(caught)
    }
  }

  const loadAttachments = async (orderId) => {
    try {
      const confirmed = await ordersApi.listAttachments(orderId)
      attachmentStatuses.value[orderId] = { confirmed, failed: attachmentStatusFor(orderId).failed }
      return confirmed
    } catch (caught) { throw storeError(caught) }
  }

  const downloadAttachment = async (orderId, attachmentId) => {
    try { return await ordersApi.downloadAttachment(orderId, attachmentId) } catch (caught) { throw storeError(caught) }
  }

  const deleteAttachment = async (orderId, attachmentId) => {
    try {
      await ordersApi.deleteAttachment(orderId, attachmentId)
      const status = attachmentStatusFor(orderId)
      attachmentStatuses.value[orderId] = { ...status, confirmed: status.confirmed.filter(({ id }) => id !== attachmentId) }
    } catch (caught) { throw storeError(caught) }
  }

  const addOrder = async (orderData, files = []) => {
    const normalized = normalizeOrderInput(orderData)
    const { isValid } = validateOrder(normalized)
    if (!isValid) throw localError('VALIDATION_ERROR', '訂單資料驗證失敗')
    return mutate(async () => {
      const created = await ordersApi.createOrder(normalized)
      orders.value.push(created)
      if (files.length > 0) await uploadFiles(created.id, files)
      return created
    })
  }

  const updateOrder = async (id, orderData, files = []) => {
    const index = orders.value.findIndex(order => order.id === id)
    if (index === -1) throw localError('ORDER_NOT_FOUND', '找不到訂單')

    const merged = { ...orders.value[index], ...orderData }
    const normalized = normalizeOrderInput(merged)
    const { isValid } = validateOrder(normalized)
    if (!isValid) throw localError('VALIDATION_ERROR', '訂單資料驗證失敗')
    return mutate(async () => {
      const updated = await ordersApi.updateOrder(id, orderData)
      orders.value[index] = updated
      if (files.length > 0) await uploadFiles(updated.id, files)
      return updated
    })
  }

  const deleteOrder = async (id) => {
    const index = orders.value.findIndex(order => order.id === id)
    if (index === -1) throw localError('ORDER_NOT_FOUND', '找不到訂單')
    return mutate(async () => {
      await ordersApi.deleteOrder(id)
      orders.value.splice(index, 1)
    })
  }

  const finalizePendingDelete = async ({ keepalive = false, restoreOnFailure = !keepalive } = {}) => {
    if (!pendingDelete.value) return
    const snapshot = pendingDelete.value
    pendingDelete.value = null
    attachmentStatuses.value = {}
    try {
      await mutate(() => ordersApi.deleteOrder(snapshot.order.id, { keepalive }))
      forgetDeleteId(snapshot.order.id)
    } catch (caught) {
      if (restoreOnFailure) {
        forgetDeleteId(snapshot.order.id)
        const restoreAt = Math.min(snapshot.index, orders.value.length)
        if (!orders.value.some(({ id }) => id === snapshot.order.id)) orders.value.splice(restoreAt, 0, snapshot.order)
      }
      throw caught
    }
  }

  const stageDelete = async (id) => {
    if (pendingDelete.value) await finalizePendingDelete()
    const index = orders.value.findIndex(order => order.id === id)
    if (index === -1) throw localError('ORDER_NOT_FOUND', '找不到訂單')
    const [order] = orders.value.splice(index, 1)
    if (!persistDeleteId(order.id)) {
      orders.value.splice(index, 0, order)
      throw localError('DELETE_PERSIST_FAILED', '無法建立可復原的刪除狀態')
    }
    pendingDelete.value = { order, index }
  }

  const undoDelete = () => {
    if (!pendingDelete.value) return false
    const { order, index } = pendingDelete.value
    pendingDelete.value = null
    forgetDeleteId(order.id)
    if (!orders.value.some(({ id }) => id === order.id)) orders.value.splice(Math.min(index, orders.value.length), 0, order)
    return true
  }

  const clearOrders = () => {
    orders.value = []
    error.value = null
    initialized.value = false
    pendingDelete.value = null
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
    isLoading,
    isMutating,
    initialized,
    error,
    pendingDelete,
    attachmentStatuses,
    loadOrders,
    retry,
    clearOrders,
    addOrder,
    attachmentStatusFor,
    retryAttachment,
    loadAttachments,
    downloadAttachment,
    deleteAttachment,
    updateOrder,
    deleteOrder,
    stageDelete,
    undoDelete,
    finalizePendingDelete,
    getByCategory,
    getFiltered,
    stats
  }
})
