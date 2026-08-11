<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="max-w-6xl">
      <h1 class="text-2xl md:text-4xl font-heading font-bold text-ink mb-2">全部訂單</h1>
      <p class="text-base md:text-lg text-ink-muted">跨分類檢視所有訂單</p>
    </div>

    <div class="max-w-6xl">
      <SearchSortControls v-model:search="searchQuery" v-model:sort="sortOption" />
    </div>

    <div data-testid="order-toolbar" class="flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div data-testid="status-filters" class="min-w-0 md:flex-1">
        <StatusFilterTabs v-model="selectedStatus" :counts="counts" />
      </div>
      <div data-testid="create-order-action" class="flex justify-end md:shrink-0">
        <Button data-testid="create-order" @click="openCreateForm">+ 新增訂單</Button>
      </div>
    </div>

    <div data-testid="order-content" class="max-w-6xl space-y-4">
      <div v-if="store.error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ store.error }}
        <Button v-if="store.initialized" data-testid="retry-orders" variant="secondary" size="sm" class="ml-2" @click="retryLoad">重試</Button>
      </div>
      <p v-if="store.isLoading && !store.initialized" class="text-ink-muted">載入訂單中…</p>
      <p v-else-if="!store.error && filteredOrders.length === 0" class="text-ink-muted">尚無訂單。</p>
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @details="openDetails"
        @edit="openEditForm"
        @request-delete="requestDelete"
      />
    </div>

    <OrderFormModal v-model="isFormOpen" :order="editingOrder" :pending="store.isMutating" @submit="handleSubmit" />
    <OrderDetailsModal v-if="selectedOrder" v-model="isDetailsOpen" :order="selectedOrder" @edit="openEditFromDetails" />
    <DeleteUndoToast v-if="store.pendingDelete" :order-name="store.pendingDelete.order.name" @undo="store.undoDelete" />

    <Modal v-model="isConfirmOpen" title="確認刪除" title-class="font-semibold">
      <div class="space-y-2">
        <p data-testid="delete-confirm-prompt" class="font-semibold text-ink">確定要刪除這筆訂單嗎？如刪除後欲恢復可使用下方「復原」按鈕取消刪除。</p>
        <p data-testid="delete-undo-warning" class="text-sm text-red-600">
          請留意：一旦重新整理或離開本頁面，已刪除之資料將無法再復原。
        </p>
      </div>
      <template #footer>
        <Button variant="secondary" size="sm" @click="isConfirmOpen = false">取消</Button>
        <Button variant="danger" size="sm" :disabled="store.isMutating" @click="confirmDelete">{{ store.isMutating ? '刪除中…' : '刪除' }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useOrdersStore, STATUSES } from '@/stores/orders'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import StatusFilterTabs from '@/components/orders/StatusFilterTabs.vue'
import SearchSortControls from '@/components/orders/SearchSortControls.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFormModal from '@/components/orders/OrderFormModal.vue'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue'
import DeleteUndoToast from '@/components/orders/DeleteUndoToast.vue'

const store = useOrdersStore()
onMounted(() => {
  if (!store.initialized && !store.isLoading) store.loadOrders().catch(() => {})
})
const retryLoad = () => store.retry().catch(() => {})

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
const isDetailsOpen = ref(false)
const selectedOrderId = ref(null)
const selectedOrder = computed(() => store.orders.find((order) => order.id === selectedOrderId.value) || null)

const openDetails = (order) => {
  selectedOrderId.value = order.id
  isDetailsOpen.value = true
}

const openEditForm = (order) => {
  editingOrder.value = order
  isFormOpen.value = true
}

const openCreateForm = () => {
  editingOrder.value = null
  isFormOpen.value = true
}

const handleSubmit = async (payload) => {
  try {
    if (editingOrder.value) await store.updateOrder(editingOrder.value.id, payload)
    else await store.addOrder(payload)
    isFormOpen.value = false
  } catch {}
}

const isConfirmOpen = ref(false)
const pendingDeleteId = ref(null)

const requestDelete = (id) => {
  pendingDeleteId.value = id
  isConfirmOpen.value = true
}

const confirmDelete = async () => {
  try {
    await store.stageDelete(pendingDeleteId.value)
    isConfirmOpen.value = false
    pendingDeleteId.value = null
  } catch {}
}

onBeforeUnmount(() => { store.finalizePendingDelete().catch(() => {}) })

const openEditFromDetails = (order) => {
  isDetailsOpen.value = false
  openEditForm(order)
}
</script>
