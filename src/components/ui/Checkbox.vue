<template>
  <label
    :for="checkboxId"
    class="inline-flex items-center gap-2 select-none"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
  >
    <input
      :id="checkboxId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="sr-only peer"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span
      class="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-to/30"
      :class="
        modelValue
          ? 'bg-gradient-to-br from-primary-from to-primary-to border-transparent shadow-emphasis'
          : 'bg-white border-card-border'
      "
    >
      <svg v-if="modelValue" viewBox="0 0 16 16" class="w-3 h-3 text-white" fill="none">
        <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="label" class="text-sm text-ink">{{ label }}</span>
  </label>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const checkboxId = useId()
</script>
