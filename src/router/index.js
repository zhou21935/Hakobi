import { createRouter, createWebHistory } from 'vue-router'

const Dashboard = () => import('@/views/Dashboard.vue')
const OrderList = () => import('@/views/OrderList.vue')
const UiShowcase = () => import('@/views/UiShowcase.vue')

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/ui-showcase',
    name: 'UiShowcase',
    component: UiShowcase,
    meta: { title: 'UI Showcase' }
  },
  {
    path: '/orders/:category',
    name: 'OrderList',
    component: OrderList,
    meta: { title: 'Orders' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  const title = to.meta.title || 'Hakobi'
  document.title = title
})

export default router
