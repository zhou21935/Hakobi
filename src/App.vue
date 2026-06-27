<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 ml-64">
      <router-view />
    </main>
  </div>
</template>

