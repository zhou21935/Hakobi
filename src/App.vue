<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-page-bg">
    <!-- Sidebar -->
    <AppSidebar :open="isSidebarOpen" @update:open="isSidebarOpen = $event" />

    <!-- Mobile top bar -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center h-14 px-4 bg-page-bg border-b border-sidebar-border">
      <button
        type="button"
        aria-label="開啟選單"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors text-xl"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        ☰
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 min-w-0 md:ml-64 pt-14 md:pt-0">
      <router-view />
    </main>
  </div>
</template>

