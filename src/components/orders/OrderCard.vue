<template>
  <Card>
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="mb-2">
          <StatusBadge :status="order.status" />
        </div>
        <h3 class="font-heading font-semibold text-ink truncate">{{ order.name }}</h3>
        <p class="text-sm text-ink-muted mt-1">
          <span v-if="order.platform">{{ order.platform }}</span>
          <span v-if="order.platform && order.estimatedShipDate"> · </span>
          <span v-if="order.estimatedShipDate">預計出貨 {{ order.estimatedShipDate }}</span>
        </p>
      </div>

      <div class="text-right shrink-0">
        <p class="font-heading font-bold text-ink text-lg">{{ currencySymbol }}{{ order.amount }}</p>
        <div class="flex gap-2 mt-2 justify-end">
          <button
            type="button"
            aria-label="編輯"
            class="w-8 h-8 rounded-full bg-badge-category-bg flex items-center justify-center hover:brightness-95 transition"
            @click="$emit('edit', order)"
          >
            ✏️
          </button>
          <button
            type="button"
            aria-label="刪除"
            class="w-8 h-8 rounded-full bg-white border border-card-border flex items-center justify-center hover:bg-badge-category-bg transition"
            @click="$emit('request-delete', order.id)"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'request-delete'])

const CURRENCY_SYMBOLS = {
  TWD: 'NT$',
  USD: '$',
  KRW: '₩',
  JPY: '¥'
}

const currencySymbol = computed(() => CURRENCY_SYMBOLS[props.order.currency] || '')
</script>
