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
      <SearchSortControls v-model:search="searchQuery" v-model:sort="sortOption" />
    </div>

    <div class="max-w-6xl">
      <StatusFilterTabs v-model="selectedStatus" :counts="counts" />
    </div>

    <div class="max-w-6xl space-y-3 md:space-y-4">
      <div v-if="store.error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ store.error }}
        <Button v-if="store.initialized" data-testid="retry-orders" variant="secondary" size="sm" class="ml-2" @click="retryLoad">重試</Button>
      </div>
      <p v-if="store.isLoading && !store.initialized" class="text-ink-muted">載入訂單中…</p>
      <p v-else-if="!store.error && filteredOrders.length === 0" class="text-ink-muted">尚無訂單,點擊右上角「新增訂單」開始記錄。</p>
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

    <Modal v-model="isConfirmOpen" title="確認刪除">
      <p class="text-ink-muted">確定要刪除這筆訂單嗎?此操作無法復原。</p>
      <template #footer>
        <Button variant="secondary" size="sm" @click="isConfirmOpen = false">取消</Button>
        <Button variant="danger" size="sm" :disabled="store.isMutating" @click="confirmDelete">{{ store.isMutating ? '刪除中…' : '刪除' }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore, STATUSES, CATEGORY_LABELS } from '@/stores/orders'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import StatusFilterTabs from '@/components/orders/StatusFilterTabs.vue'
import SearchSortControls from '@/components/orders/SearchSortControls.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderFormModal from '@/components/orders/OrderFormModal.vue'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue'

const route = useRoute()
const category = computed(() => route.params.category)
const categoryLabel = computed(() => CATEGORY_LABELS[category.value] || category.value)

const store = useOrdersStore()
onMounted(() => {
  if (!store.initialized && !store.isLoading) store.loadOrders().catch(() => {})
})
const retryLoad = () => store.retry().catch(() => {})

const selectedStatus = ref(null)
const searchQuery = ref('')
const sortOption = ref('')

watch(category, () => {
  searchQuery.value = ''
  sortOption.value = ''
})

const categoryOrders = computed(() => store.getByCategory(category.value))

const counts = computed(() => {
  const result = { all: categoryOrders.value.length }
  Object.keys(STATUSES).forEach((key) => {
    result[key] = categoryOrders.value.filter((order) => order.status === key).length
  })
  return result
})

const filteredOrders = computed(() => {
  return store.getFiltered({
    category: category.value,
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

const openCreateForm = () => {
  editingOrder.value = null
  isFormOpen.value = true
}

const openEditForm = (order) => {
  editingOrder.value = order
  isFormOpen.value = true
}

const handleSubmit = async (payload) => {
  try {
    if (editingOrder.value) await store.updateOrder(editingOrder.value.id, payload)
    else await store.addOrder({ ...payload, category: category.value })
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
    await store.deleteOrder(pendingDeleteId.value)
    isConfirmOpen.value = false
    pendingDeleteId.value = null
  } catch {}
}

const openEditFromDetails = (order) => {
  isDetailsOpen.value = false
  openEditForm(order)
}
</script>
