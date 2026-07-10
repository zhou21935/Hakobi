<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      @click.self="close"
    >
      <div class="w-full max-w-md rounded-card bg-white shadow-card text-ink">
        <div v-if="title" class="px-5 py-4 border-b border-card-border">
          <h2 class="text-lg font-heading font-semibold text-ink">{{ title }}</h2>
        </div>

        <div class="px-5 py-4">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-5 py-4 border-t border-card-border flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
