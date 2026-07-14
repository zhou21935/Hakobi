<template>
  <Card>
    <div data-testid="order-card-row" class="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-4">
      <div class="min-w-0 w-full sm:w-auto">
        <div data-testid="order-card-tags" class="mb-2 flex flex-wrap items-center gap-1.5">
          <StatusBadge :status="order.status" />
          <span
            v-if="order.isPreorder"
            class="px-2 py-0.5 rounded-full bg-badge-category-bg text-xs text-ink"
          >
            預購
          </span>
          <span
            v-for="tag in productCategoryTags"
            :key="tag.value"
            class="px-2 py-0.5 rounded-full bg-badge-category-bg text-xs text-ink"
          >
            {{ tag.label }}
          </span>
        </div>
        <h3 class="font-heading font-semibold text-ink truncate">{{ order.name }}</h3>
        <p class="text-sm text-ink-muted mt-1">
          <span v-if="order.platform">{{ order.platform }}</span>
          <span v-if="order.platform && order.estimatedShipDate"> · </span>
          <span v-if="order.estimatedShipDate">預計出貨 {{ order.estimatedShipDate }}</span>
        </p>
      </div>

      <div class="text-left sm:text-right shrink-0 w-full sm:w-auto">
        <p class="font-heading font-bold text-ink text-lg">{{ currencySymbol }}{{ order.amount }}</p>
        <div class="flex gap-2 mt-2 justify-start sm:justify-end">
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
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from '@/stores/orders'

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

const productCategoryTags = computed(() =>
  Object.values(PRODUCT_CATEGORIES)
    .filter((value) => (props.order.productCategories || []).includes(value))
    .map((value) => ({ value, label: PRODUCT_CATEGORY_LABELS[value] }))
)
</script>
