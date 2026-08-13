<template>
  <div class="min-w-0">
    <label v-if="label" :for="inputId" class="block mb-1.5 text-sm font-medium text-ink">
      {{ label }}
    </label>

    <input
      :id="inputId"
      :type="type"
      :inputmode="inputMode"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :value="modelValue"
      :class="inputClass"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <p v-if="error" class="mt-1.5 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  inputMode: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: undefined
  }
})

defineEmits(['update:modelValue'])

const inputId = useId()

const inputClass = computed(() => [
  'min-w-0 max-w-full w-full rounded-lg border px-3 py-2 text-sm text-ink transition-colors',
  props.type === 'date' && 'block appearance-none [inline-size:100%] [min-inline-size:0] [max-inline-size:100%]',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'disabled:bg-badge-category-bg disabled:text-ink-muted disabled:cursor-not-allowed',
  props.error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
    : 'border-card-border focus:border-primary-from focus:ring-primary-to/30'
])
</script>
