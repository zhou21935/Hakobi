import { createRouter, createWebHistory } from 'vue-router'

const Dashboard = () => import('@/views/Dashboard.vue')
const OrderList = () => import('@/views/OrderList.vue')
const AllOrders = () => import('@/views/AllOrders.vue')
const UiShowcase = () => import('@/views/UiShowcase.vue')

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '總覽' }
  },
  {
    path: '/ui-showcase',
    name: 'UiShowcase',
    component: UiShowcase,
    meta: { title: 'UI 元件展示' }
  },
  {
    path: '/orders',
    name: 'AllOrders',
    component: AllOrders,
    meta: { title: '全部訂單' }
  },
  {
    path: '/orders/:category',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '訂單' }
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
