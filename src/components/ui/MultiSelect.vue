<template>
  <div ref="rootEl" class="relative">
    <label v-if="label" class="block mb-1.5 text-sm font-medium text-ink">
      {{ label }}
    </label>

    <button
      type="button"
      :disabled="disabled"
      :class="controlClass"
      @click="toggleOpen"
    >
      <span v-if="selectedOptions.length === 0" class="text-ink-muted">{{ placeholder }}</span>
      <span v-else class="flex flex-wrap gap-1">
        <span
          v-for="option in selectedOptions"
          :key="option.value"
          class="px-2 py-0.5 rounded-full bg-badge-category-bg text-xs text-ink"
        >
          {{ option.label }}
        </span>
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full rounded-lg border border-card-border bg-white shadow-card py-1"
    >
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center gap-2 px-3 py-2 text-sm text-ink cursor-pointer hover:bg-badge-category-bg"
      >
        <input
          type="checkbox"
          :checked="modelValue.includes(option.value)"
          @change="toggleOption(option.value)"
        />
        {{ option.label }}
      </label>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
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
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const rootEl = ref(null)
const isOpen = ref(false)

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option.value))
)

const close = () => {
  isOpen.value = false
}

const toggleOpen = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const toggleOption = (value) => {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
}

const handleClickOutside = (event) => {
  if (isOpen.value && rootEl.value && !rootEl.value.contains(event.target)) {
    close()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleKeydown)
})

const controlClass = computed(() => [
  'w-full rounded-lg border px-3 py-2 text-sm text-left text-ink transition-colors bg-white',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'disabled:bg-badge-category-bg disabled:text-ink-muted disabled:cursor-not-allowed',
  props.error ? 'border-red-400' : 'border-card-border focus:border-primary-from focus:ring-primary-to/30'
])
</script>
