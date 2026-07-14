<template>
  <div
    v-if="open"
    data-testid="sidebar-overlay"
    class="fixed inset-0 bg-black/50 z-30 md:hidden"
    @click="$emit('update:open', false)"
  ></div>

  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-gradient-to-br from-sidebar-from to-sidebar-to text-ink shadow-lg border-r border-sidebar-border z-40 transition-transform duration-200 md:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div class="px-6 py-8 border-b border-sidebar-border flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-logo bg-gradient-to-br from-primary-from to-primary-to flex items-center justify-center text-lg shadow-emphasis shrink-0"
      >
        📦
      </div>
      <div>
        <h1 class="text-xl font-heading font-bold text-ink">Hakobi</h1>
        <p class="text-xs text-ink-muted mt-0.5">訂單管理</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="px-4 py-6">
      <ul class="space-y-2">
        <li>
          <router-link
            to="/"
            class="flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors"
            :class="isActive('/') ? 'bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis' : ''"
            @click="$emit('update:open', false)"
          >
            📊 總覽
          </router-link>
        </li>

        <li>
          <router-link
            to="/orders"
            class="flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors"
            :class="isActive('/orders') ? 'bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis' : ''"
            @click="$emit('update:open', false)"
          >
            📋 全部訂單
          </router-link>
        </li>

        <li>
          <router-link
            to="/ui-showcase"
            class="flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors"
            :class="isActive('/ui-showcase') ? 'bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis' : ''"
            @click="$emit('update:open', false)"
          >
            🎨 UI 元件展示
          </router-link>
        </li>

        <!-- Orders by Category -->
        <li class="pt-4">
          <p class="px-4 py-2 text-sm font-heading font-semibold text-ink-muted uppercase">分類</p>
          <ul class="space-y-1 ml-2">
            <li v-for="(category, index) in categories" :key="category">
              <router-link
                :to="`/orders/${category}`"
                class="flex items-center gap-3 px-4 py-2 rounded-full text-sm text-ink hover:bg-white/50 transition-colors"
                :class="isActive(`/orders/${category}`) ? 'bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis' : ''"
                @click="$emit('update:open', false)"
              >
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                  :class="isActive(`/orders/${category}`) ? 'bg-white/25' : iconCycleClass(index)"
                >
                  📦
                </span>
                {{ CATEGORY_LABELS[category] }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-sidebar-border">
      <p class="text-xs text-ink-muted">© 2026 Hakobi 版權所有</p>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { CATEGORY_LABELS } from '@/stores/orders'

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:open'])

const route = useRoute()

const categories = ['agent', 'parcel']

const iconCycleClasses = ['bg-icon-cycle-1', 'bg-icon-cycle-2', 'bg-icon-cycle-3', 'bg-icon-cycle-4', 'bg-icon-cycle-5']

const iconCycleClass = (index) => iconCycleClasses[index % iconCycleClasses.length]

const isActive = (path) => {
  return route.path === path
}
</script>
