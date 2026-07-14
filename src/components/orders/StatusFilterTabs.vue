<template>
  <div class="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-1 -mb-1">
    <button
      type="button"
      class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      :class="isActive(null) ? activeClass : inactiveClass"
      @click="$emit('update:modelValue', null)"
    >
      全部
      <span class="text-xs opacity-80">{{ counts.all ?? 0 }}</span>
    </button>

    <button
      v-for="key in statusKeys"
      :key="key"
      type="button"
      class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      :class="isActive(key) ? activeClass : inactiveClass"
      @click="$emit('update:modelValue', key)"
    >
      {{ STATUSES[key].label }}
      <span class="text-xs opacity-80">{{ counts[key] ?? 0 }}</span>
    </button>
  </div>
</template>

<script setup>
import { STATUSES } from '@/stores/orders'

const props = defineProps({
  counts: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: String,
    default: null
  }
})

defineEmits(['update:modelValue'])

const statusKeys = Object.keys(STATUSES)

const activeClass = 'bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis'
const inactiveClass = 'bg-white border border-card-border text-ink hover:bg-badge-category-bg'

const isActive = (key) => props.modelValue === key
</script>
