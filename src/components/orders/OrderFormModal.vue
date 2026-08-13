<template>
  <Modal
    :model-value="modelValue"
    :title="isEditMode ? '編輯訂單' : '新增訂單'"
    overlay-class="items-end justify-center p-0 sm:items-center sm:p-6"
    panel-class="h-[92dvh] max-h-[92dvh] rounded-t-[28px] rounded-b-none sm:h-auto sm:max-h-[88dvh] sm:max-w-[560px] sm:rounded-card lg:max-w-[880px]"
    header-class="border-b border-card-border bg-white px-5 py-4 sm:bg-sidebar-from sm:px-[30px] sm:py-5"
    content-class="bg-page-bg p-4 sm:bg-white sm:p-5 lg:px-[30px] lg:py-6"
    footer-class="border-t border-card-border bg-white px-4 pt-3.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-[30px] sm:py-4"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-3.5 lg:grid lg:grid-cols-2 lg:gap-[18px]">
      <section data-testid="order-section-product" class="overflow-hidden rounded-2xl border border-card-border bg-white lg:col-span-2">
        <div class="flex items-center gap-2.5 border-b border-card-border bg-sidebar-from px-4 py-3">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">商品</h3>
          <span class="text-[11px] text-ink-muted">PRODUCT</span>
        </div>
        <div class="flex flex-col gap-3.5 p-4 lg:grid lg:grid-cols-3 lg:p-[18px]">
          <div v-if="showCategorySelect">
            <Select v-model="form.category" label="訂單分類" placeholder="請選擇訂單分類" test-id="order-category" :options="categoryOptions" />
            <p v-if="categoryError" class="mt-1 text-sm text-red-600">{{ categoryError }}</p>
          </div>
          <Input v-model="form.name" label="商品名稱" placeholder="請輸入商品名稱" :error="nameError" />
          <Input v-model="form.platform" label="購買平台" placeholder="例如 Amazon" />
          <div class="lg:col-span-2">
            <Input v-model="form.productUrl" label="商品連結" placeholder="https://" :error="productUrlError" />
          </div>
          <MultiSelect v-model="form.productCategories" label="商品分類" placeholder="請選擇商品分類" :options="productCategoryOptions" :error="productCategoriesError" />
          <div class="grid grid-cols-[1.3fr_0.8fr] gap-2.5 lg:col-span-2">
            <Input v-model="form.amount" type="number" label="金額" placeholder="0" :error="amountError" />
            <Select v-model="form.currency" label="幣別" :options="currencyOptions" />
          </div>
          <Input data-testid="order-number" v-model="orderNumber" label="訂單號碼" placeholder="例如 114-2938471-0038" />
          <div class="flex items-end gap-3">
            <Checkbox v-model="form.isPaid" label="已付款" />
            <Checkbox v-model="form.isPreorder" label="預購商品" />
          </div>
        </div>
      </section>

      <section data-testid="order-section-cargo" class="overflow-hidden rounded-2xl border border-card-border bg-white">
        <div class="flex items-center gap-2.5 border-b border-card-border bg-sidebar-from px-4 py-3">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">貨物</h3>
          <span class="text-[11px] text-ink-muted">CARGO</span>
        </div>
        <div class="grid grid-cols-1 gap-3.5 p-4 sm:grid-cols-2 lg:p-[18px]">
          <Input v-model="form.orderDate" type="date" label="下單日期" />
          <Select v-model="form.status" label="貨物狀態" :options="statusOptions" />
          <Input v-model="form.estimatedShipDate" type="date" label="預計出貨日期" />
          <Input v-model="form.estimatedArrivalDate" type="date" label="預計到貨日期" />
        </div>
      </section>

      <section data-testid="order-section-shipping" class="overflow-hidden rounded-2xl border border-card-border bg-white">
        <div class="flex items-center gap-2.5 border-b border-card-border bg-sidebar-from px-4 py-3">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">物流</h3>
          <span class="text-[11px] text-ink-muted">SHIPPING</span>
        </div>
        <div class="flex flex-col gap-3.5 p-4 lg:p-[18px]">
          <Input v-model="form.shippingMethod" label="物流方式" placeholder="例如 日本郵便 EMS" :maxlength="2000" />
          <Input v-model="form.trackingNumber" label="追蹤號碼" placeholder="例如 EN123456789JP" :maxlength="2000" />
        </div>
      </section>

      <section data-testid="order-section-notes" class="overflow-hidden rounded-2xl border border-card-border bg-white lg:col-span-2">
        <div class="flex items-center gap-2.5 border-b border-card-border bg-sidebar-from px-4 py-3">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">備註</h3>
          <span class="text-[11px] text-ink-muted">NOTES</span>
        </div>
        <div class="flex flex-col gap-3 p-4 lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-4 lg:p-[18px]">
          <Input v-model="form.notes" label="備註內容" placeholder="選填：尺寸、賣家回覆、拆單資訊…" />
          <div class="flex flex-col gap-2.5">
            <button type="button" class="flex items-center gap-3 rounded-xl border border-dashed border-card-border-accent bg-page-bg p-3.5 text-left text-ink transition-colors hover:border-primary-from" @click="fileInput?.click()">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-accentcard-to text-primary-from">＋</span>
              <span>
                <span class="block text-[13px] font-medium">選擇附件</span>
                <span class="block text-[11px] text-ink-muted">PDF / JPG / PNG</span>
              </span>
            </button>
            <input ref="fileInput" data-testid="order-attachments" type="file" multiple accept=".pdf,image/*" class="hidden" @change="handleAttachmentChange" />
            <div v-for="(attachment, index) in attachments" :key="attachment.key" class="flex items-center gap-2.5 rounded-lg border border-card-border bg-white px-3 py-2.5">
              <span class="rounded bg-ink px-1.5 py-0.5 text-[10px] text-white">{{ attachment.type }}</span>
              <span class="min-w-0 flex-1 truncate text-[13px]">{{ attachment.name }}</span>
              <button type="button" :data-testid="`remove-attachment-${index}`" class="text-ink-muted hover:text-primary-from" :aria-label="`移除 ${attachment.name}`" @click="attachments.splice(index, 1)">×</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <Button variant="secondary" size="sm" :disabled="pending" @click="$emit('update:modelValue', false)">取消</Button>
      <Button class="flex-1 sm:flex-none" size="sm" :disabled="pending" @click="handleSubmit">{{ pending ? '儲存中…' : '送出' }}</Button>
    </template>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Button from '@/components/ui/Button.vue'
import MultiSelect from '@/components/ui/MultiSelect.vue'
import { STATUSES, PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from '@/stores/orders'
import { normalizeOrderInput, validateOrder } from '@/domain/orderValidation'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: null
  },
  pending: { type: Boolean, default: false },
  category: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isEditMode = computed(() => props.order !== null)
const showCategorySelect = computed(() => !isEditMode.value && !props.category)
const categoryOptions = [
  { value: 'agent', label: '海外代購' },
  { value: 'parcel', label: '集運包裹' }
]

const currencyOptions = [
  { value: 'TWD', label: 'TWD' },
  { value: 'USD', label: 'USD' },
  { value: 'KRW', label: 'KRW' },
  { value: 'JPY', label: 'JPY' }
]

const statusOptions = Object.keys(STATUSES).map((key) => ({
  value: key,
  label: STATUSES[key].label
}))

const productCategoryOptions = Object.values(PRODUCT_CATEGORIES).map((value) => ({
  value,
  label: PRODUCT_CATEGORY_LABELS[value]
}))

const emptyForm = () => ({
  category: '',
  name: '',
  platform: '',
  productUrl: '',
  amount: '',
  currency: 'TWD',
  isPaid: false,
  status: 'AWAITING_SHIPMENT',
  orderDate: '',
  estimatedShipDate: '',
  estimatedArrivalDate: '',
  shippingMethod: '',
  trackingNumber: '',
  isPreorder: false,
  productCategories: [],
  notes: ''
})

const form = reactive(emptyForm())
const orderNumber = ref('')
const attachments = ref([])
const fileInput = ref(null)
const nameError = ref('')
const amountError = ref('')
const productCategoriesError = ref('')
const productUrlError = ref('')
const categoryError = ref('')

const toDateOnly = (value) => {
  if (!value) return ''
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/)
  return match ? match[0] : ''
}

const resetForm = () => {
  orderNumber.value = ''
  attachments.value = []
  nameError.value = ''
  amountError.value = ''
  productCategoriesError.value = ''
  productUrlError.value = ''
  categoryError.value = ''
  if (props.order) {
    Object.assign(form, emptyForm(), {
      name: props.order.name || '',
      category: props.order.category || props.category || '',
      platform: props.order.platform || '',
      productUrl: props.order.productUrl || '',
      amount: props.order.amount ?? '',
      currency: props.order.currency || 'TWD',
      isPaid: props.order.isPaid ?? false,
      status: props.order.status || 'AWAITING_SHIPMENT',
      orderDate: toDateOnly(props.order.orderDate),
      estimatedShipDate: toDateOnly(props.order.estimatedShipDate),
      estimatedArrivalDate: toDateOnly(props.order.estimatedArrivalDate),
      shippingMethod: props.order.shippingMethod || '',
      trackingNumber: props.order.trackingNumber || '',
      isPreorder: props.order.isPreorder ?? false,
      productCategories: [...(props.order.productCategories || [])],
      notes: props.order.notes || ''
    })
  } else {
    Object.assign(form, emptyForm(), { category: props.category || '' })
  }
}

const handleAttachmentChange = (event) => {
  const selected = Array.from(event.target.files || [])
  attachments.value.push(...selected.map((file, index) => ({
    key: `${file.name}-${file.size}-${file.lastModified}-${attachments.value.length + index}`,
    name: file.name,
    type: file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE'
  })))
  event.target.value = ''
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm()
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (props.pending) return
  const normalized = normalizeOrderInput(form)
  const { isValid, errors } = validateOrder(normalized)

  nameError.value = errors.name || ''
  amountError.value = errors.amount || ''
  productCategoriesError.value = errors.productCategories || ''
  productUrlError.value = errors.productUrl || ''
  categoryError.value = errors.category || ''

  if (!isValid) {
    return
  }

  emit('submit', {
    ...normalized,
    platform: form.platform,
    productUrl: form.productUrl,
    currency: form.currency,
    isPaid: form.isPaid,
    status: form.status,
    orderDate: toDateOnly(form.orderDate) || null,
    estimatedShipDate: toDateOnly(form.estimatedShipDate) || null,
    estimatedArrivalDate: toDateOnly(form.estimatedArrivalDate) || null,
    shippingMethod: form.shippingMethod,
    trackingNumber: form.trackingNumber,
    isPreorder: form.isPreorder,
    notes: form.notes
  })
}
</script>
