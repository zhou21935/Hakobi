<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 max-w-6xl">
      <div>
        <h1 class="text-2xl md:text-4xl font-heading font-bold text-ink mb-2">{{ categoryLabel }}</h1>
        <p class="text-base md:text-lg text-ink-muted">管理{{ categoryLabel }}分類的訂單</p>
      </div>
      <Button class="w-full md:w-auto" @click="openCreateForm">+ 新增訂單</Button>
    </div>

    <div class="max-w-6xl">
      <StatusFilterTabs v-model="selectedStatus" :counts="counts" />
    </div>

    <div class="max-w-6xl space-y-3 md:space-y-4">
      <p v-if="filteredOrders.length === 0" class="text-ink-muted">尚無訂單,點擊右上角「新增訂單」開始記錄。</p>
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
import { useRoute } from 'vue-router'
import { useOrdersStore, STATUSES, CATEGORY_LABELS } from '@/stores/orders'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import StatusFilterTabs from '@/components/orders/StatusFilterTabs.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFormModal from '@/components/orders/OrderFormModal.vue'

const route = useRoute()
const category = computed(() => route.params.category)
const categoryLabel = computed(() => CATEGORY_LABELS[category.value] || category.value)

const store = useOrdersStore()

const selectedStatus = ref(null)

const categoryOrders = computed(() => store.getByCategory(category.value))

const counts = computed(() => {
  const result = { all: categoryOrders.value.length }
  Object.keys(STATUSES).forEach((key) => {
    result[key] = categoryOrders.value.filter((order) => order.status === key).length
  })
  return result
})

const filteredOrders = computed(() => {
  return store.getFiltered({ category: category.value, status: selectedStatus.value || undefined })
})

const isFormOpen = ref(false)
const editingOrder = ref(null)

const openCreateForm = () => {
  editingOrder.value = null
  isFormOpen.value = true
}

const openEditForm = (order) => {
  editingOrder.value = order
  isFormOpen.value = true
}

const handleSubmit = (payload) => {
  if (editingOrder.value) {
    store.updateOrder(editingOrder.value.id, payload)
  } else {
    store.addOrder({ ...payload, category: category.value })
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
