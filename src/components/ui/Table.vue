<template>
  <div class="overflow-x-auto border border-card-border rounded-card">
    <table class="min-w-full divide-y divide-card-border">
      <thead class="bg-badge-category-bg">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-left text-xs font-heading font-semibold uppercase tracking-wide text-ink-muted"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-card-border bg-white">
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-6 text-center text-sm text-ink-muted">
            {{ emptyText }}
          </td>
        </tr>

        <tr v-for="(row, index) in rows" :key="row.id ?? index" class="hover:bg-badge-category-bg/40">
          <td v-for="column in columns" :key="column.key" class="px-4 py-3 text-sm text-ink">
            <slot :name="`cell-${column.key}`" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  emptyText: {
    type: String,
    default: '尚無資料'
  }
})
</script>
