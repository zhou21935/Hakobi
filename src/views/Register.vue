<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-page">
    <form class="w-full max-w-md rounded-card bg-white border border-card-border p-6 space-y-4 shadow-card" @submit.prevent="submit">
      <div>
        <h1 class="text-2xl font-heading font-bold text-ink">建立 Hakobi 帳號</h1>
        <p class="mt-1 text-sm text-ink-muted">完成 Email 驗證後即可使用訂單功能</p>
      </div>
      <p v-if="message" role="alert" class="text-sm text-red-700">{{ message }}</p>
      <label class="block text-sm font-semibold text-ink">電子郵件
        <input v-model.trim="form.email" data-testid="register-email" type="email" autocomplete="email" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
        <span v-if="errors.email" class="mt-1 block text-xs text-red-700">{{ errors.email }}</span>
      </label>
      <label class="block text-sm font-semibold text-ink">會員使用名稱
        <input v-model="form.username" data-testid="register-username" autocomplete="username" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
        <span v-if="errors.username" class="mt-1 block text-xs text-red-700">{{ errors.username }}</span>
      </label>
      <label class="block text-sm font-semibold text-ink">密碼
        <input v-model="form.password" data-testid="register-password" type="password" autocomplete="new-password" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
        <span v-if="errors.password" class="mt-1 block text-xs text-red-700">{{ errors.password }}</span>
      </label>
      <label class="block text-sm font-semibold text-ink">確認密碼
        <input v-model="form.confirmPassword" data-testid="register-confirm-password" type="password" autocomplete="new-password" class="mt-1 w-full rounded-lg border border-card-border px-3 py-2" />
        <span v-if="errors.confirmPassword" class="mt-1 block text-xs text-red-700">{{ errors.confirmPassword }}</span>
      </label>
      <p class="text-xs text-ink-muted">密碼須為 8–64 個字元，至少包含一個英文字母與一個數字，且不可含空白。</p>
      <Button class="w-full" type="submit" :disabled="auth.isSubmitting">{{ auth.isSubmitting ? '註冊中…' : '註冊' }}</Button>
      <router-link class="block text-center text-sm text-primary-from underline" to="/login">已有帳號？返回登入</router-link>
    </form>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'
import { validateRegistration } from '@/domain/accountValidation'

const auth = useAuthStore()
const router = useRouter()
const form = reactive({ email: '', username: '', password: '', confirmPassword: '' })
const errors = reactive({ email: null, username: null, password: null, confirmPassword: null })
const message = ref(null)

const submit = async () => {
  message.value = null
  const validation = validateRegistration(form)
  Object.assign(errors, validation.errors)
  if (!validation.isValid) return
  try {
    if (!await auth.checkUsernameAvailability(validation.values.username)) {
      errors.username = '此名稱已被使用'
      return
    }
    await auth.signUp(validation.values)
    form.password = ''
    form.confirmPassword = ''
    await router.push({ name: 'VerifyEmail', query: { email: validation.values.email, sent: '1' } })
  } catch (caught) {
    if (caught?.code === 'USERNAME_TAKEN') errors.username = '此名稱已被使用'
    else message.value = caught?.message || '註冊失敗，請稍後再試'
  }
}
</script>
