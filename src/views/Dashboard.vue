<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="max-w-6xl">
      <h1 class="text-2xl md:text-4xl font-heading font-bold text-ink mb-2">總覽</h1>
      <p class="text-base md:text-lg text-ink-muted">目前共有 {{ stats.total }} 筆訂單</p>
    </div>

    <div class="max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card v-for="tile in statTiles" :key="tile.key">
        <p class="text-sm text-ink-muted mb-1">{{ tile.label }}</p>
        <p class="text-3xl font-heading font-bold text-ink">{{ tile.value }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import Card from '@/components/ui/Card.vue'

const store = useOrdersStore()
const stats = computed(() => store.stats)

const statTiles = computed(() => [
  { key: 'IN_TRANSIT', label: '運送中', value: stats.value.byStatus.IN_TRANSIT ?? 0 },
  { key: 'CONSOLIDATING', label: '集運中', value: stats.value.byStatus.CONSOLIDATING ?? 0 },
  { key: 'COMPLETED', label: '已完成', value: stats.value.byStatus.COMPLETED ?? 0 }
])
</script>
