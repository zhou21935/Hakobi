<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-page">
    <form class="w-full max-w-sm rounded-card bg-white border border-card-border p-6 space-y-5 shadow-card" @submit.prevent="submit">
      <div>
        <h1 class="text-2xl font-heading font-bold text-ink">登入 Hakobi</h1>
        <p class="mt-1 text-sm text-ink-muted">使用管理員提供的帳號登入</p>
      </div>
      <p v-if="message" role="alert" class="text-sm text-red-700">{{ message }}</p>
      <label class="block text-sm font-semibold text-ink">
        電子郵件
        <input v-model.trim="email" type="email" autocomplete="email" required class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
      </label>
      <label class="block text-sm font-semibold text-ink">
        密碼
        <input v-model="password" type="password" autocomplete="current-password" required class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
      </label>
      <Button class="w-full" type="submit" :disabled="auth.isSubmitting">{{ auth.isSubmitting ? '登入中…' : '登入' }}</Button>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const message = ref(null)

const submit = async () => {
  message.value = null
  try {
    await auth.signIn(email.value, password.value)
    await router.push('/orders')
  } catch (error) {
    message.value = error.message
  }
}
</script>
