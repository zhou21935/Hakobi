<template>
  <div>
    <label v-if="label" :for="selectId" class="block mb-1.5 text-sm font-medium text-ink">
      {{ label }}
    </label>

    <select
      :id="selectId"
      :disabled="disabled"
      :value="modelValue"
      :class="selectClass"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const selectId = useId()

const selectClass = computed(() => [
  'w-full rounded-lg border px-3 py-2 text-sm text-ink transition-colors bg-white',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'disabled:bg-badge-category-bg disabled:text-ink-muted disabled:cursor-not-allowed',
  'border-card-border focus:border-primary-from focus:ring-primary-to/30'
])
</script>
