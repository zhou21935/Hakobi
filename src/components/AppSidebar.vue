<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg">
    <!-- Logo -->
    <div class="px-6 py-8 border-b border-slate-700">
      <h1 class="text-2xl font-bold text-white">Hakobi</h1>
      <p class="text-sm text-slate-400 mt-1">Orders Management</p>
    </div>

    <!-- Navigation Menu -->
    <nav class="px-4 py-6">
      <ul class="space-y-2">
        <li>
          <router-link
            to="/"
            class="block px-4 py-2 rounded-lg text-slate-100 hover:bg-slate-800 transition-colors"
            :class="{ 'bg-slate-700': isActive('/') }"
          >
            📊 Dashboard
          </router-link>
        </li>

        <!-- Orders by Category -->
        <li class="pt-4">
          <p class="px-4 py-2 text-sm font-semibold text-slate-400 uppercase">Orders</p>
          <ul class="space-y-1 ml-2">
            <li v-for="category in categories" :key="category">
              <router-link
                :to="`/orders/${category}`"
                class="block px-4 py-2 rounded-lg text-sm text-slate-100 hover:bg-slate-800 transition-colors capitalize"
                :class="{ 'bg-slate-700': isActive(`/orders/${category}`) }"
              >
                📦 {{ category }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-slate-700">
      <p class="text-xs text-slate-500">© 2026 Hakobi</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const categories = ['preorder', 'agent', 'parcel', 'merch', 'manga']

const isActive = (path) => {
  return route.path === path
}
</script>
