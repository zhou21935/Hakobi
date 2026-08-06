import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Dashboard = () => import('@/views/Dashboard.vue')
const OrderList = () => import('@/views/OrderList.vue')
const AllOrders = () => import('@/views/AllOrders.vue')
const UiShowcase = () => import('@/views/UiShowcase.vue')
const Login = () => import('@/views/Login.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登入', public: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '總覽', requiresAuth: true }
  },
  {
    path: '/ui-showcase',
    name: 'UiShowcase',
    component: UiShowcase,
    meta: { title: 'UI 元件展示', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'AllOrders',
    component: AllOrders,
    meta: { title: '全部訂單', requiresAuth: true }
  },
  {
    path: '/orders/:category',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '訂單', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export const createAuthGuard = (pinia) => async (to) => {
  const auth = useAuthStore(pinia)
  if (!auth.initialized) await auth.initialize()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'Login' && auth.isAuthenticated) return { name: 'AllOrders' }
  return true
}

export const installAuthGuard = (pinia) => router.beforeEach(createAuthGuard(pinia))

router.afterEach((to) => {
  const title = to.meta.title || 'Hakobi'
  document.title = title
})

export default router
