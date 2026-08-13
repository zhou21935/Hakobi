<template>
  <Modal
    :model-value="modelValue"
    :title="isEditMode ? '編輯訂單' : '新增訂單'"
    overlay-class="items-end justify-center p-0 sm:items-center sm:p-6"
    panel-class="order-form-dialog h-[92dvh] max-h-[92dvh] rounded-t-[28px] rounded-b-none bg-white sm:h-auto sm:max-h-[88dvh] sm:max-w-[560px] sm:rounded-[28px] lg:max-w-[880px]"
    header-class="border-b border-[#ece6f2] bg-[#f7f4fa] px-5 py-4 sm:px-[30px] sm:py-5"
    content-class="bg-white p-4 sm:p-5 lg:px-[30px] lg:py-6"
    footer-class="border-t border-card-border bg-white px-4 pt-3.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-[30px] sm:py-4"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="order-form-reference-surfaces flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-[18px]">
      <section data-testid="order-section-product" class="order-form-section overflow-hidden rounded-[20px] border border-[#ece6f2] bg-white lg:col-span-2">
        <div class="flex items-center gap-2.5 border-b border-[#ece6f2] bg-[#f7f4fa] px-5 py-4">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">商品</h3>
          <span class="text-[11px] text-ink-muted">PRODUCT</span>
        </div>
        <div class="flex flex-col gap-3.5 p-4 lg:grid lg:grid-cols-3 lg:p-[18px]">
          <div v-if="showCategorySelect">
            <Select v-model="form.category" class="order-form-control" label="訂單分類" placeholder="請選擇訂單分類" test-id="order-category" :options="categoryOptions" />
            <p v-if="categoryError" class="mt-1 text-sm text-red-600">{{ categoryError }}</p>
          </div>
          <Input v-model="form.name" class="order-form-control" label="商品名稱" placeholder="請輸入商品名稱" :error="nameError" />
          <Input v-model="form.platform" class="order-form-control" label="購買平台" placeholder="例如 Amazon" />
          <div class="lg:col-span-2">
            <Input v-model="form.productUrl" class="order-form-control" label="商品連結" placeholder="https://" :error="productUrlError" />
          </div>
          <MultiSelect v-model="form.productCategories" class="order-form-control" label="商品分類" placeholder="請選擇商品分類" :options="productCategoryOptions" :error="productCategoriesError" />
          <div class="grid grid-cols-[1.3fr_0.8fr] gap-2.5 lg:col-span-2">
            <Input :model-value="form.amount" class="order-form-control" type="text" input-mode="decimal" label="金額" placeholder="0" :error="amountError" @update:model-value="form.amount = sanitizeAmountInput($event)" />
            <Select v-model="form.currency" class="order-form-control" label="幣別" :options="currencyOptions" />
          </div>
          <Input data-testid="order-number" v-model="orderNumber" class="order-form-control" label="訂單號碼" placeholder="例如 114-2938471-0038" />
          <div class="flex flex-wrap items-end gap-3">
            <Checkbox v-model="form.isPaid" class="order-form-control order-form-checkbox" label="已付款" />
            <Checkbox v-model="form.isPreorder" class="order-form-control order-form-checkbox" label="預購商品" />
          </div>
        </div>
      </section>

      <section data-testid="order-section-cargo" class="order-form-section overflow-hidden rounded-[20px] border border-[#ece6f2] bg-white">
        <div class="flex items-center gap-2.5 border-b border-[#ece6f2] bg-[#f7f4fa] px-5 py-4">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">貨物</h3>
          <span class="text-[11px] text-ink-muted">CARGO</span>
        </div>
        <div class="grid grid-cols-1 gap-3.5 p-4 sm:grid-cols-2 lg:p-[18px]">
          <Input v-model="form.orderDate" class="order-form-control" type="date" label="下單日期" />
          <Select v-model="form.status" class="order-form-control" label="貨物狀態" :options="statusOptions" />
          <Input v-model="form.estimatedShipDate" class="order-form-control" type="date" label="預計出貨日期" />
          <Input v-model="form.estimatedArrivalDate" class="order-form-control" type="date" label="預計到貨日期" />
        </div>
      </section>

      <section data-testid="order-section-shipping" class="order-form-section overflow-hidden rounded-[20px] border border-[#ece6f2] bg-white">
        <div class="flex items-center gap-2.5 border-b border-[#ece6f2] bg-[#f7f4fa] px-5 py-4">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">物流</h3>
          <span class="text-[11px] text-ink-muted">SHIPPING</span>
        </div>
        <div class="flex flex-col gap-3.5 p-4 lg:p-[18px]">
          <Input v-model="form.shippingMethod" class="order-form-control" label="物流方式" placeholder="例如 日本郵便 EMS" :maxlength="2000" />
          <Input v-model="form.trackingNumber" class="order-form-control" label="追蹤號碼" placeholder="例如 EN123456789JP" :maxlength="2000" />
        </div>
      </section>

      <section data-testid="order-section-notes" class="order-form-section overflow-hidden rounded-[20px] border border-[#ece6f2] bg-white lg:col-span-2">
        <div class="flex items-center gap-2.5 border-b border-[#ece6f2] bg-[#f7f4fa] px-5 py-4">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-from"></span>
          <h3 class="text-sm font-bold text-ink">備註</h3>
          <span class="text-[11px] text-ink-muted">NOTES</span>
        </div>
        <div class="flex flex-col gap-3 p-4 lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-4 lg:p-[18px]">
          <div>
            <label for="order-notes" class="mb-1.5 block text-sm font-medium text-ink">備註內容</label>
            <textarea
              id="order-notes"
              v-model="form.notes"
              data-testid="order-notes"
              placeholder="選填：尺寸、賣家回覆、拆單資訊…"
              class="order-form-textarea min-h-[120px] w-full resize-y rounded-2xl border border-[#e2dae9] bg-white px-4 py-3.5 text-sm text-ink transition-colors focus:border-primary-from focus:outline-none focus:ring-2 focus:ring-primary-to/30 focus:ring-offset-0 lg:min-h-[104px]"
            ></textarea>
          </div>
          <div class="flex flex-col gap-2.5">
            <button data-testid="attachment-picker" type="button" class="order-form-attachment flex min-h-16 items-center gap-3 rounded-2xl border border-dashed border-[#d8cce3] bg-[#faf8fc] p-3.5 text-left text-ink transition-colors hover:border-primary-from" @click="fileInput?.click()">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-accentcard-to text-primary-from">＋</span>
              <span>
                <span class="block text-[13px] font-medium">選擇附件</span>
                <span class="block text-[11px] text-ink-muted">PDF / JPG / PNG</span>
              </span>
            </button>
            <input ref="fileInput" data-testid="order-attachments" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" class="hidden" @change="handleAttachmentChange" />
            <div v-for="(attachment, index) in attachments" :key="attachment.key" class="flex items-center gap-2.5 rounded-lg border border-card-border bg-white px-3 py-2.5">
              <span class="rounded bg-ink px-1.5 py-0.5 text-[10px] text-white">{{ attachment.type }}</span>
              <span class="min-w-0 flex-1 truncate text-[13px]">{{ attachment.name }}</span>
              <button type="button" :data-testid="`remove-attachment-${index}`" class="text-ink-muted hover:text-primary-from" :aria-label="`移除 ${attachment.name}`" @click="attachments.splice(index, 1)">×</button>
            </div>
            <div v-for="attachment in attachmentStatus.confirmed" :key="attachment.id" class="flex items-center gap-2.5 rounded-lg border border-card-border bg-white px-3 py-2.5">
              <span class="min-w-0 flex-1 truncate text-[13px]">{{ attachment.name }}</span>
              <button type="button" :aria-label="`下載 ${attachment.name}`" class="text-primary-from" @click="$emit('download-attachment', attachment)">下載</button>
              <button type="button" :aria-label="`刪除 ${attachment.name}`" class="text-red-600" @click="$emit('delete-attachment', attachment)">刪除</button>
            </div>
            <div v-for="(failure, index) in attachmentStatus.failed" :key="`${failure.name}-${index}`" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px]">
              <div class="flex items-center gap-2"><span class="min-w-0 flex-1 truncate">{{ failure.name }}</span><button type="button" :data-testid="`retry-attachment-${index}`" class="text-primary-from" @click="$emit('retry-attachment', failure.file)">重試</button></div>
              <p class="mt-1 text-red-600">{{ failure.message }}</p>
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
  category: { type: String, default: null },
  attachmentStatus: { type: Object, default: () => ({ confirmed: [], failed: [] }) }
})

const emit = defineEmits(['update:modelValue', 'submit', 'retry-attachment', 'download-attachment', 'delete-attachment'])

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

const sanitizeAmountInput = (value) => {
  const sanitized = String(value ?? '').replace(/[^\d.]/g, '')
  const [integer = '', ...decimalParts] = sanitized.split('.')
  return decimalParts.length > 0 ? `${integer}.${decimalParts.join('')}` : integer
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
    orderNumber.value = props.order.orderNumber || ''
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
    type: file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE',
    file
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
    orderNumber: orderNumber.value.trim(),
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
  }, attachments.value.map(({ file }) => file))
}
</script>

<style scoped>
.order-form-control :deep(input:not([type='checkbox']):not([type='file'])),
.order-form-control :deep(select),
.order-form-control :deep(button) {
  min-height: 3.5rem;
  border-radius: 1rem;
  border-color: #e2dae9;
  background-color: #fff;
  padding: 0.875rem 1rem;
}

.order-form-checkbox {
  min-height: 3.5rem;
  border: 1px solid #e2dae9;
  border-radius: 9999px;
  background-color: #fff;
  padding: 0.75rem 1rem;
}

.order-form-section :deep(label) {
  margin-bottom: 0.5rem;
}

@media (min-width: 1024px) {
  .order-form-control :deep(input:not([type='checkbox']):not([type='file'])),
  .order-form-control :deep(select),
  .order-form-control :deep(button) {
    min-height: 3.25rem;
  }
}
</style>
