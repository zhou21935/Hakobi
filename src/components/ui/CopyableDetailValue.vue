<template>
  <div class="min-w-0">
    <dt class="text-ink-muted">{{ label }}</dt>
    <dd class="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-ink">
      <span v-if="hasValue" class="break-all select-all">{{ displayValue }}</span>
      <span v-else data-testid="empty-value">尚未填寫</span>
      <Button
        v-if="hasValue"
        size="sm"
        variant="secondary"
      :aria-label="`複製 ${label}`"
      @click="copyValue"
      >
        <AppIcon name="copy" class="h-4 w-4 shrink-0" />
        {{ copyState === 'success' ? '已複製 ✓' : '複製' }}
      </Button>
    </dd>
    <p v-if="copyState === 'error'" role="alert" class="mt-2 text-sm text-red-600">
      複製失敗，請手動選取
    </p>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '' }
})

const copyState = ref('idle')
let copyResetTimer
const hasValue = computed(() => props.value !== null && props.value !== undefined && props.value !== '')
const displayValue = computed(() => hasValue.value ? String(props.value) : '')

const copyValue = async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(displayValue.value)
    copyState.value = 'success'
    clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => { copyState.value = 'idle' }, 2000)
  } catch {
    copyState.value = 'error'
  }
}

onUnmounted(() => clearTimeout(copyResetTimer))
</script>
