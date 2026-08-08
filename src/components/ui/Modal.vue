<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      data-testid="modal-overlay"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8"
      @click.self="close"
    >
      <div data-testid="modal-panel" class="w-full max-w-md max-h-[85vh] overflow-hidden rounded-card bg-white shadow-card text-ink flex flex-col">
        <div v-if="title" class="px-5 py-4 shrink-0">
          <h2 class="text-lg font-heading font-semibold text-ink">{{ title }}</h2>
        </div>

        <div data-testid="modal-content" class="modal-scroll-area min-h-0 px-5 py-4 flex-1 overflow-y-auto">
          <slot />
        </div>

        <div v-if="$slots.footer" class="px-5 py-4 flex justify-end gap-2 shrink-0">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

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

let previousBodyOverflow
let previousRootOverflow

const lockBackgroundScroll = () => {
  if (previousBodyOverflow !== undefined) return
  previousBodyOverflow = document.body.style.overflow
  previousRootOverflow = document.documentElement.style.overflow
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
}

const restoreBackgroundScroll = () => {
  if (previousBodyOverflow === undefined) return
  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousRootOverflow
  previousBodyOverflow = undefined
  previousRootOverflow = undefined
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) lockBackgroundScroll()
  else restoreBackgroundScroll()
}, { immediate: true })

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
  restoreBackgroundScroll()
})
</script>

<style scoped>
.modal-scroll-area {
  scrollbar-width: thin;
  scrollbar-color: rgb(139 111 186 / 38%) transparent;
}

.modal-scroll-area:hover {
  scrollbar-color: rgb(139 111 186 / 58%) transparent;
}

.modal-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.modal-scroll-area::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: rgb(139 111 186 / 38%);
}

.modal-scroll-area:hover::-webkit-scrollbar-thumb {
  background-color: rgb(139 111 186 / 58%);
}

.modal-scroll-area::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
</style>
