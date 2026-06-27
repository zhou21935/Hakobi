<template>
  <span
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white"
    :style="{ backgroundColor: statusColor }"
  >
    <span class="w-2 h-2 rounded-full opacity-80" :style="{ backgroundColor: statusColor }"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { STATUSES } from '@/stores/orders'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => Object.keys(STATUSES).includes(value)
  }
})

const statusInfo = computed(() => {
  return STATUSES[props.status]
})

const statusLabel = computed(() => {
  return statusInfo.value?.label || props.status
})

const statusColor = computed(() => {
  return statusInfo.value?.color || '#000000'
})
</script>
