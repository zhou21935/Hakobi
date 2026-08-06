import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/assets/main.css'
import App from '@/App.vue'
import router, { installAuthGuard } from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
installAuthGuard(pinia)
useAuthStore(pinia).setSessionCleanup(() => useOrdersStore(pinia).clearOrders())

createApp(App).use(pinia).use(router).mount('#app')
