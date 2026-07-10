<template>
  <Modal :model-value="modelValue" :title="isEditMode ? '編輯訂單' : '新增訂單'" @update:model-value="$emit('update:modelValue', $event)">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input v-model="form.name" label="商品名稱" placeholder="請輸入商品名稱" :error="nameError" />
      <Input v-model="form.platform" label="購買平台" placeholder="例如 Amazon" />
      <Input v-model="form.productUrl" label="商品連結" placeholder="https://" class="sm:col-span-2" />
      <Input v-model="form.amount" type="number" label="金額" placeholder="0" :error="amountError" />
      <Select v-model="form.currency" label="幣別" :options="currencyOptions" />
      <Checkbox v-model="form.isPaid" label="已付款" />
      <Select v-model="form.status" label="貨物狀態" :options="statusOptions" />
      <Input v-model="form.orderDate" type="date" label="下單日期" />
      <Input v-model="form.estimatedShipDate" type="date" label="預計出貨日期" />
      <Input v-model="form.estimatedArrivalDate" type="date" label="預計到貨日期" />
      <Select v-model="form.isConsolidated" label="是否送往集運倉" :options="consolidatedOptions" />
      <Input v-model="form.notes" label="備註" placeholder="選填" class="sm:col-span-2" />
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
import { STATUSES } from '@/stores/orders'

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

const consolidatedOptions = [
  { value: 'false', label: '否' },
  { value: 'true', label: '是' }
]

const statusOptions = Object.keys(STATUSES).map((key) => ({
  value: key,
  label: STATUSES[key].label
}))

const emptyForm = () => ({
  name: '',
  platform: '',
  productUrl: '',
  amount: '',
  currency: 'TWD',
  isPaid: false,
  status: 'CONSOLIDATING',
  orderDate: '',
  estimatedShipDate: '',
  estimatedArrivalDate: '',
  isConsolidated: 'false',
  notes: ''
})

const form = reactive(emptyForm())
const nameError = ref('')
const amountError = ref('')

const resetForm = () => {
  nameError.value = ''
  amountError.value = ''
  if (props.order) {
    Object.assign(form, emptyForm(), {
      name: props.order.name || '',
      platform: props.order.platform || '',
      productUrl: props.order.productUrl || '',
      amount: props.order.amount ?? '',
      currency: props.order.currency || 'TWD',
      isPaid: props.order.isPaid ?? false,
      status: props.order.status || 'CONSOLIDATING',
      orderDate: props.order.orderDate || '',
      estimatedShipDate: props.order.estimatedShipDate || '',
      estimatedArrivalDate: props.order.estimatedArrivalDate || '',
      isConsolidated: props.order.isConsolidated ? 'true' : 'false',
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

  if (nameError.value || amountError.value) {
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
    isConsolidated: form.isConsolidated === 'true',
    notes: form.notes
  })
}
</script>
