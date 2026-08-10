<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-page">
    <form class="w-full max-w-sm rounded-card bg-white border border-card-border p-6 space-y-5 shadow-card" @submit.prevent="submit">
      <h1 class="text-2xl font-heading font-bold text-ink">忘記密碼</h1>
      <p class="text-sm text-ink-muted">輸入註冊信箱，我們會寄送密碼重設連結。</p>
      <p v-if="message" role="status" class="text-sm" :class="failed ? 'text-red-700' : 'text-green-700'">{{ message }}</p>
      <label class="block text-sm font-semibold text-ink">電子郵件
        <input v-model.trim="email" type="email" required autocomplete="email" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
      </label>
      <Button class="w-full" type="submit" :disabled="sending">{{ sending ? '寄送中…' : '寄送重設連結' }}</Button>
      <router-link class="block text-center text-sm text-primary-from underline" to="/login">返回登入</router-link>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const email = ref('')
const message = ref(null)
const failed = ref(false)
const sending = ref(false)
const submit = async () => {
  sending.value = true
  failed.value = false
  try {
    await auth.requestPasswordReset(email.value)
    message.value = '如果此信箱已註冊，我們已寄出密碼重設信。'
  } catch (caught) {
    failed.value = true
    message.value = caught?.message || '寄送失敗，請稍後再試'
  } finally { sending.value = false }
}
</script>
