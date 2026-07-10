<template>
  <div class="bg-white rounded-card border border-card-border shadow-card text-ink">
    <div v-if="$slots.header" class="px-5 py-4 border-b border-card-border font-heading">
      <slot name="header" />
    </div>

    <div :class="padding ? 'p-5' : ''">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-5 py-4 border-t border-card-border">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  padding: {
    type: Boolean,
    default: true
  }
})
</script>
