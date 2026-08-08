<template>
  <Modal :model-value="modelValue" title="訂單詳情" @update:model-value="close">
    <div data-testid="order-details-content" class="min-w-0 space-y-4 sm:space-y-5">
      <section data-testid="order-detail-card" class="rounded-card bg-accentcard-from/35 p-5 sm:p-6">
        <h3 class="mb-4 font-heading font-semibold text-ink">基本資料</h3>
        <dl class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <DetailValue label="商品名稱" :value="order.name" />
          <DetailValue label="購買平台" :value="order.platform" />
          <DetailValue label="商品分類" :value="productCategoryText" />
          <div class="min-w-0">
            <dt class="text-ink-muted">商品連結</dt>
            <dd class="mt-1 break-words text-ink">
              <a
                v-if="safeProductUrl"
                :href="safeProductUrl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="開啟商品頁"
                class="text-primary-from underline underline-offset-2"
              >開啟商品頁</a>
              <span v-else data-testid="empty-value">尚未填寫</span>
            </dd>
          </div>
          <DetailValue class="sm:col-span-2" label="備註" :value="order.notes" />
        </dl>
      </section>

      <section data-testid="order-detail-card" class="rounded-card bg-accentcard-from/35 p-5 sm:p-6">
        <h3 class="mb-4 font-heading font-semibold text-ink">訂單資料</h3>
        <dl class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <DetailValue label="訂單類別" :value="categoryLabel" />
          <DetailValue label="金額" :value="formattedAmount" />
          <DetailValue label="付款狀態" :value="order.isPaid ? '已付款' : '未付款'" />
          <DetailValue label="預購狀態" :value="order.isPreorder ? '預購' : '非預購'" />
        </dl>
      </section>

      <section data-testid="order-detail-card" class="rounded-card bg-accentcard-from/35 p-5 sm:p-6">
        <h3 class="mb-4 font-heading font-semibold text-ink">物流資料</h3>
        <dl class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <DetailValue label="貨物狀態" :value="statusLabel" />
          <DetailValue label="物流方式" :value="order.shippingMethod" />
          <div class="min-w-0 sm:col-span-2">
            <dt class="text-ink-muted">追蹤號碼</dt>
            <dd class="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-ink">
              <span v-if="hasTrackingNumber" class="break-all select-all">{{ order.trackingNumber }}</span>
              <span v-else data-testid="empty-value">尚未填寫</span>
              <Button v-if="hasTrackingNumber" size="sm" variant="secondary" aria-label="複製追蹤號碼" @click="copyTrackingNumber">
                {{ copyState === 'success' ? '已複製 ✓' : '複製' }}
              </Button>
            </dd>
            <p v-if="copyState === 'error'" role="alert" class="mt-2 text-sm text-red-600">複製失敗，請手動選取</p>
          </div>
        </dl>
      </section>

      <section data-testid="order-detail-card" class="rounded-card bg-accentcard-from/35 p-5 sm:p-6">
        <h3 class="mb-4 font-heading font-semibold text-ink">日期資料</h3>
        <dl class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <DetailValue label="下單日期" :value="formatDate(order.orderDate)" />
          <DetailValue label="預計出貨日期" :value="formatDate(order.estimatedShipDate)" />
          <DetailValue label="預計到貨日期" :value="formatDate(order.estimatedArrivalDate)" />
        </dl>
      </section>

      <section data-testid="order-system-info" class="border-t border-card-border pt-5 text-ink-muted">
        <h3 class="mb-4 font-heading text-sm font-semibold">系統資訊</h3>
        <dl class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 text-xs sm:grid-cols-2">
          <DetailValue label="建立時間" :value="formatTimestamp(order.createdAt)" />
          <DetailValue label="最後更新時間" :value="formatTimestamp(order.updatedAt)" />
        </dl>
      </section>
    </div>

    <template #footer>
      <Button variant="secondary" size="sm" aria-label="關閉訂單詳情" @click="close">關閉</Button>
      <Button size="sm" aria-label="編輯訂單" @click="edit">編輯訂單</Button>
    </template>
  </Modal>
</template>

<script>
import { defineComponent, h } from 'vue'

const empty = (value) => value === null || value === undefined || value === ''

export const DetailValue = defineComponent({
  name: 'DetailValue',
  props: { label: { type: String, required: true }, value: { type: [String, Number], default: '' } },
  setup(props) {
    return () => h('div', { class: 'min-w-0' }, [
      h('dt', { class: 'text-ink-muted' }, props.label),
      h('dd', { class: 'mt-1 break-words text-ink', ...(empty(props.value) ? { 'data-testid': 'empty-value' } : {}) }, empty(props.value) ? '尚未填寫' : String(props.value))
    ])
  }
})
</script>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { CATEGORY_LABELS, PRODUCT_CATEGORY_LABELS, STATUSES } from '@/stores/orders'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  order: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'edit'])

const copyState = ref('idle')
let copyResetTimer
const hasTrackingNumber = computed(() => typeof props.order.trackingNumber === 'string' && props.order.trackingNumber.length > 0)
const categoryLabel = computed(() => CATEGORY_LABELS[props.order.category] || props.order.category)
const statusLabel = computed(() => STATUSES[props.order.status]?.label || props.order.status)
const productCategoryText = computed(() => (props.order.productCategories || []).map((value) => PRODUCT_CATEGORY_LABELS[value] || value).join('、'))
const formattedAmount = computed(() => `${props.order.currency} ${new Intl.NumberFormat('zh-TW').format(props.order.amount)}`)
const safeProductUrl = computed(() => {
  if (typeof props.order.productUrl !== 'string' || props.order.productUrl === '') return null
  try {
    const url = new URL(props.order.productUrl)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null
  } catch {
    return null
  }
})

const formatDate = (value) => {
  if (!value) return ''
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? `${match[1]}/${match[2]}/${match[3]}` : String(value)
}
const timestampFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})
const formatTimestamp = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const parts = Object.fromEntries(timestampFormatter.formatToParts(date).map(({ type, value: part }) => [type, part]))
  return `${parts.year}/${parts.month}/${parts.day} ${parts.hour}:${parts.minute}`
}
const close = () => emit('update:modelValue', false)
const edit = () => { emit('update:modelValue', false); emit('edit', props.order) }
const copyTrackingNumber = async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(props.order.trackingNumber)
    copyState.value = 'success'
    clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => { copyState.value = 'idle' }, 2000)
  } catch {
    copyState.value = 'error'
  }
}
onUnmounted(() => clearTimeout(copyResetTimer))
</script>
