<template>
  <Modal :model-value="modelValue" :title="isEditMode ? '編輯訂單' : '新增訂單'" @update:model-value="$emit('update:modelValue', $event)">
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input v-model="form.name" label="商品名稱" placeholder="請輸入商品名稱" :error="nameError" />
        <Input v-model="form.platform" label="購買平台" placeholder="例如 Amazon" />
      </div>

      <Input v-model="form.productUrl" label="商品連結" placeholder="https://" />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input v-model="form.amount" type="number" label="金額" placeholder="0" :error="amountError" />
        <Select v-model="form.currency" label="幣別" :options="currencyOptions" />
        <Checkbox v-model="form.isPaid" label="已付款" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input v-model="form.orderDate" type="date" label="下單日期" />
        <Select v-model="form.status" label="貨物狀態" :options="statusOptions" />
        <Checkbox v-model="form.isPreorder" label="預購商品" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input v-model="form.estimatedShipDate" type="date" label="預計出貨日期" />
        <Input v-model="form.estimatedArrivalDate" type="date" label="預計到貨日期" />
      </div>

      <MultiSelect
        v-model="form.productCategories"
        label="商品分類"
        placeholder="請選擇商品分類"
        :options="productCategoryOptions"
        :error="productCategoriesError"
      />

      <Input v-model="form.notes" label="備註" placeholder="選填" />
    </div>

    <template #footer>
      <Button variant="secondary" size="sm" @click="$emit('update:modelValue', false)">取消</Button>
      <Button size="sm" @click="handleSubmit">送出</Button>
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isEditMode = computed(() => props.order !== null)

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
  isPreorder: false,
  productCategories: [],
  notes: ''
})

const form = reactive(emptyForm())
const nameError = ref('')
const amountError = ref('')
const productCategoriesError = ref('')

const resetForm = () => {
  nameError.value = ''
  amountError.value = ''
  productCategoriesError.value = ''
  if (props.order) {
    Object.assign(form, emptyForm(), {
      name: props.order.name || '',
      platform: props.order.platform || '',
      productUrl: props.order.productUrl || '',
      amount: props.order.amount ?? '',
      currency: props.order.currency || 'TWD',
      isPaid: props.order.isPaid ?? false,
      status: props.order.status || 'AWAITING_SHIPMENT',
      orderDate: props.order.orderDate || '',
      estimatedShipDate: props.order.estimatedShipDate || '',
      estimatedArrivalDate: props.order.estimatedArrivalDate || '',
      isPreorder: props.order.isPreorder ?? false,
      productCategories: [...(props.order.productCategories || [])],
      notes: props.order.notes || ''
    })
  } else {
    Object.assign(form, emptyForm())
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm()
    }
  }
)

const handleSubmit = () => {
  nameError.value = form.name.trim() === '' ? '商品名稱不可為空' : ''
  amountError.value = Number(form.amount) > 0 ? '' : '金額須為大於 0 的數字'
  productCategoriesError.value = form.productCategories.length === 0 ? '請至少選擇一項商品分類' : ''

  if (nameError.value || amountError.value || productCategoriesError.value) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    platform: form.platform,
    productUrl: form.productUrl,
    amount: Number(form.amount),
    currency: form.currency,
    isPaid: form.isPaid,
    status: form.status,
    orderDate: form.orderDate || null,
    estimatedShipDate: form.estimatedShipDate || null,
    estimatedArrivalDate: form.estimatedArrivalDate || null,
    isPreorder: form.isPreorder,
    productCategories: form.productCategories,
    notes: form.notes
  })
}
</script>
