<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-page">
    <form class="w-full max-w-sm rounded-card bg-white border border-card-border p-6 space-y-5 shadow-card" @submit.prevent="submit">
      <h1 class="text-2xl font-heading font-bold text-ink">設定新密碼</h1>
      <p v-if="!auth.recoverySession" role="alert" class="text-sm text-red-700">密碼重設連結無效或已過期。</p>
      <p v-if="message" role="status" class="text-sm" :class="failed ? 'text-red-700' : 'text-green-700'">{{ message }}</p>
      <template v-if="auth.recoverySession">
        <label class="block text-sm font-semibold text-ink">新密碼
          <input v-model="password" type="password" autocomplete="new-password" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
          <span v-if="passwordError" class="mt-1 block text-xs text-red-700">{{ passwordError }}</span>
        </label>
        <label class="block text-sm font-semibold text-ink">確認新密碼
          <input v-model="confirmation" type="password" autocomplete="new-password" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
          <span v-if="confirmationError" class="mt-1 block text-xs text-red-700">{{ confirmationError }}</span>
        </label>
        <Button class="w-full" type="submit" :disabled="sending">{{ sending ? '更新中…' : '更新密碼' }}</Button>
      </template>
      <router-link v-else class="block text-center text-sm text-primary-from underline" to="/forgot-password">重新申請重設連結</router-link>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'
import { validatePassword, validatePasswordConfirmation } from '@/domain/accountValidation'

const auth = useAuthStore()
const router = useRouter()
const password = ref('')
const confirmation = ref('')
const passwordError = ref(null)
const confirmationError = ref(null)
const message = ref(null)
const failed = ref(false)
const sending = ref(false)

const submit = async () => {
  const username = auth.profile?.username || auth.user?.user_metadata?.username || ''
  const passwordResult = validatePassword(password.value, username)
  const confirmationResult = validatePasswordConfirmation(password.value, confirmation.value)
  passwordError.value = passwordResult.error
  confirmationError.value = confirmationResult.error
  if (!passwordResult.isValid || !confirmationResult.isValid) return
  sending.value = true
  try {
    await auth.updatePassword(password.value, username)
    password.value = ''
    confirmation.value = ''
    message.value = '密碼已更新。'
    await router.replace('/orders')
  } catch (caught) {
    failed.value = true
    message.value = caught?.message || '密碼更新失敗，請重新申請連結'
  } finally { sending.value = false }
}
</script>
