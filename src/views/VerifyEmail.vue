<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-page">
    <section class="w-full max-w-md rounded-card bg-white border border-card-border p-6 space-y-4 shadow-card">
      <h1 class="text-2xl font-heading font-bold text-ink">驗證電子郵件</h1>
      <p v-if="auth.isAuthenticated" role="status" class="text-sm text-green-700">Email 驗證成功，正在前往訂單頁面。</p>
      <template v-else>
        <p class="text-sm text-ink">驗證信已寄出。請點擊信件中的連結完成驗證。</p>
        <p v-if="message" role="status" class="text-sm" :class="failed ? 'text-red-700' : 'text-green-700'">{{ message }}</p>
        <form class="space-y-3" @submit.prevent="resend">
          <label class="block text-sm font-semibold text-ink">電子郵件
            <input v-model.trim="email" type="email" required class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
          </label>
          <Button class="w-full" type="submit" :disabled="sending">{{ sending ? '寄送中…' : '重新寄送驗證信' }}</Button>
        </form>
        <router-link class="block text-center text-sm text-primary-from underline" to="/login">返回登入</router-link>
      </template>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const callbackError = route.query.error || route.query.error_code || new URLSearchParams(window.location.hash.slice(1)).get('error')
const message = ref(callbackError ? '驗證連結無效或已過期，請重新寄送驗證信。' : null)
const failed = ref(!!callbackError)
const sending = ref(false)

onMounted(async () => {
  if (auth.isAuthenticated) await router.replace('/orders')
  else if (callbackError) await router.replace({ name: 'VerifyEmail', query: email.value ? { email: email.value } : {} })
})

const resend = async () => {
  sending.value = true
  failed.value = false
  try {
    await auth.resendConfirmation(email.value)
    message.value = '如果此信箱有待驗證帳號，我們已寄出驗證信。'
  } catch (caught) {
    failed.value = true
    message.value = caught?.message || '寄送失敗，請稍後再試'
  } finally {
    sending.value = false
  }
}
</script>
