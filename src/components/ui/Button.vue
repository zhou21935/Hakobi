<template>
  <button :type="type" :disabled="disabled" :class="buttonClass">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
}

const variantClasses = {
  primary: 'bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis hover:brightness-105',
  secondary: 'bg-white text-ink border border-card-border hover:bg-badge-category-bg',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-ink hover:bg-badge-category-bg'
}

const buttonClass = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold transition-colors',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  sizeClasses[props.size],
  variantClasses[props.variant]
])
</script>
