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
          <CopyableDetailValue label="訂單號碼" :value="order.orderNumber" />
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
          <CopyableDetailValue class="sm:col-span-2" label="追蹤號碼" :value="order.trackingNumber" />
          <div v-if="attachments.length" class="min-w-0 sm:col-span-2">
            <dt class="text-ink-muted">附件</dt>
            <dd v-for="attachment in attachments" :key="attachment.id" class="mt-2 flex items-center gap-2 rounded-lg border border-card-border bg-white p-2">
              <span class="min-w-0 flex-1 truncate">{{ attachment.name }}</span>
              <Button size="sm" variant="secondary" :aria-label="`下載 ${attachment.name}`" @click="$emit('download-attachment', attachment)">下載</Button>
              <Button size="sm" variant="secondary" :aria-label="`刪除 ${attachment.name}`" @click="$emit('delete-attachment', attachment)">刪除</Button>
            </dd>
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
import { computed } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import CopyableDetailValue from '@/components/ui/CopyableDetailValue.vue'
import { CATEGORY_LABELS, PRODUCT_CATEGORY_LABELS, STATUSES } from '@/stores/orders'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  order: { type: Object, required: true },
  attachments: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'edit', 'download-attachment', 'delete-attachment'])

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
</script>
