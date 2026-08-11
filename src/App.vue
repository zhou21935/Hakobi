<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/common/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'

const isSidebarOpen = ref(false)
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const orders = useOrdersStore()

watch(() => auth.isAuthenticated, (authenticated) => {
  if (auth.initialized && !authenticated && route.name !== 'Login') router.replace({ name: 'Login' })
  if (auth.initialized && authenticated && !orders.initialized && !orders.isLoading) {
    orders.loadOrders().catch(() => {})
  }
  if (auth.initialized && authenticated && !auth.profile && !auth.profileLoading) {
    auth.loadProfile().catch(() => {})
  }
}, { immediate: true })

const logout = async () => {
  await orders.finalizePendingDelete().catch(() => {})
  await auth.signOut()
}

const finalizeOnUnload = () => { orders.finalizePendingDelete({ keepalive: true }).catch(() => {}) }
onMounted(() => window.addEventListener('beforeunload', finalizeOnUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', finalizeOnUnload))
</script>

<template>
  <router-view v-if="route.meta.public" />
  <div v-else class="flex min-h-screen bg-page-bg">
    <!-- Sidebar -->
    <AppSidebar
      :open="isSidebarOpen"
      :username="auth.profile?.username"
      :identity-fallback="auth.user?.email"
      :profile-error="auth.profileError"
      @retry-profile="auth.loadProfile().catch(() => {})"
      @update:open="isSidebarOpen = $event"
      @logout="logout"
    />

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

