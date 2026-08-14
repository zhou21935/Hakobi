import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const OrderList = () => import('@/views/OrderList.vue')
const AllOrders = () => import('@/views/AllOrders.vue')
const UiShowcase = () => import('@/views/UiShowcase.vue')
const Login = () => import('@/views/Login.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Register = () => import('@/views/Register.vue')
const VerifyEmail = () => import('@/views/VerifyEmail.vue')
const ForgotPassword = () => import('@/views/ForgotPassword.vue')
const ResetPassword = () => import('@/views/ResetPassword.vue')
const Profile = () => import('@/views/Profile.vue')

export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登入', public: true }
  },
  { path: '/register', name: 'Register', component: Register, meta: { title: '註冊', public: true, guestOnly: true } },
  { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail, meta: { title: '驗證 Email', public: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { title: '忘記密碼', public: true, guestOnly: true } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { title: '重設密碼', public: true } },
  {
    path: '/',
    name: 'OrderOverview',
    component: AllOrders,
    meta: { title: '訂單總覽', requiresAuth: true }
  },
  {
    path: '/ui-showcase',
    name: 'UiShowcase',
    component: UiShowcase,
    meta: { title: 'UI 元件展示', requiresAuth: true }
  },
  {
    path: '/orders',
    redirect: { name: 'OrderOverview' }
  },
  {
    path: '/orders/:category',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '訂單', requiresAuth: true },
    beforeEnter: (to) => ['agent', 'parcel'].includes(to.params.category) ? true : { name: 'NotFound' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '個人資料', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '找不到頁面', requiresAuth: true }
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
  if ((to.name === 'Login' || to.meta.guestOnly) && auth.isAuthenticated) return { name: 'OrderOverview' }
  return true
}

export const installAuthGuard = (pinia) => router.beforeEach(createAuthGuard(pinia))

router.afterEach(() => {
  document.title = 'Hakobi'
})

export default router
