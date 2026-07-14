<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="max-w-6xl">
      <h1 class="text-2xl md:text-4xl font-heading font-bold text-ink mb-2">全部訂單</h1>
      <p class="text-base md:text-lg text-ink-muted">跨分類檢視所有訂單</p>
    </div>

    <div class="max-w-6xl">
      <SearchSortControls v-model:search="searchQuery" v-model:sort="sortOption" />
    </div>

    <div class="max-w-6xl flex flex-col md:flex-row gap-3">
      <StatusFilterTabs v-model="selectedStatus" :counts="counts" />
    </div>

    <div class="max-w-6xl space-y-4">
      <p v-if="filteredOrders.length === 0" class="text-ink-muted">尚無訂單。</p>
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @edit="openEditForm"
        @request-delete="requestDelete"
      />
    </div>

    <OrderFormModal v-model="isFormOpen" :order="editingOrder" @submit="handleSubmit" />

    <Modal v-model="isConfirmOpen" title="確認刪除">
      <p class="text-ink-muted">確定要刪除這筆訂單嗎?此操作無法復原。</p>
      <template #footer>
        <Button variant="secondary" size="sm" @click="isConfirmOpen = false">取消</Button>
        <Button variant="danger" size="sm" @click="confirmDelete">刪除</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useOrdersStore, STATUSES } from '@/stores/orders'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import StatusFilterTabs from '@/components/orders/StatusFilterTabs.vue'
import SearchSortControls from '@/components/orders/SearchSortControls.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFormModal from '@/components/orders/OrderFormModal.vue'

const store = useOrdersStore()

const selectedStatus = ref(null)
const searchQuery = ref('')
const sortOption = ref('')

const counts = computed(() => {
  const result = { all: store.orders.length }
  Object.keys(STATUSES).forEach((key) => {
    result[key] = store.orders.filter((order) => order.status === key).length
  })
  return result
})

const filteredOrders = computed(() => {
  return store.getFiltered({
    status: selectedStatus.value || undefined,
    search: searchQuery.value || undefined,
    sort: sortOption.value || undefined
  })
})

const isFormOpen = ref(false)
const editingOrder = ref(null)

const openEditForm = (order) => {
  editingOrder.value = order
  isFormOpen.value = true
}

const handleSubmit = (payload) => {
  if (editingOrder.value) {
    store.updateOrder(editingOrder.value.id, payload)
  }
  isFormOpen.value = false
}

const isConfirmOpen = ref(false)
const pendingDeleteId = ref(null)

const requestDelete = (id) => {
  pendingDeleteId.value = id
  isConfirmOpen.value = true
}

const confirmDelete = () => {
  store.deleteOrder(pendingDeleteId.value)
  isConfirmOpen.value = false
  pendingDeleteId.value = null
}
</script>
