<template>
  <div class="flex flex-col md:flex-row gap-3 md:flex-1">
    <div class="md:flex-1">
      <Input
        :model-value="search"
        placeholder="搜尋名稱或備註"
        @update:model-value="$emit('update:search', $event)"
      />
    </div>
    <div class="md:w-48">
      <Select
        :model-value="sort"
        :options="sortOptions"
        @update:model-value="$emit('update:sort', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'

defineProps({
  search: {
    type: String,
    default: ''
  },
  sort: {
    type: String,
    default: ''
  }
})

defineEmits(['update:search', 'update:sort'])

const sortOptions = [
  { value: '', label: '預設排序' },
  { value: 'date-desc', label: '日期：新到舊' },
  { value: 'date-asc', label: '日期：舊到新' },
  { value: 'amount-desc', label: '金額：高到低' },
  { value: 'amount-asc', label: '金額：低到高' }
]
</script>
