<template>
  <div role="status" class="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-card border border-card-border bg-white px-4 py-3 shadow-card">
    <p class="min-w-0 text-sm text-ink">
      <span class="font-semibold">{{ orderName }}</span> 已從列表移除
    </p>
    <Button data-testid="undo-delete" variant="secondary" size="sm" @click="$emit('undo')">復原</Button>
  </div>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'

defineProps({ orderName: { type: String, required: true } })
defineEmits(['undo'])
</script>
