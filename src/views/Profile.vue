<template>
  <section class="p-4 md:p-8">
    <div class="mx-auto max-w-2xl">
      <header class="mb-6">
        <h1 class="text-2xl font-heading font-bold text-ink">個人資料</h1>
      </header>

      <Card v-if="isLoading">
        <p data-testid="profile-loading" class="text-sm text-ink-muted">載入會員資料中…</p>
      </Card>

      <Card v-else-if="!currentProfile">
        <p role="alert" class="text-sm text-red-700">{{ loadError || '會員資料載入失敗，請重試' }}</p>
        <label class="mt-4 block text-sm font-semibold text-ink">使用的電子郵件
          <input
            data-testid="profile-email"
            type="email"
            :value="email"
            readonly
            autocomplete="email"
            class="mt-1 w-full cursor-not-allowed rounded-lg border border-card-border bg-badge-category-bg px-3 py-2 text-ink-muted"
          />
        </label>
        <Button data-testid="profile-retry" class="mt-4" variant="secondary" @click="retryLoad">重新載入</Button>
      </Card>

      <Card v-else>
        <form class="space-y-5" @submit.prevent="submit">
          <p v-if="successMessage" role="status" class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
            {{ successMessage }}
          </p>
          <p v-if="saveError" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ saveError }}
          </p>

          <label class="block text-sm font-semibold text-ink">會員使用名稱
            <input
              v-model="form.username"
              data-testid="profile-username"
              autocomplete="username"
              maxlength="20"
              class="mt-1 w-full rounded-lg border border-card-border px-3 py-2"
            />
            <span v-if="errors.username" class="mt-1 block text-xs text-red-700">{{ errors.username }}</span>
          </label>

          <label class="block text-sm font-semibold text-ink">真實姓名
            <input
              v-model="form.displayName"
              data-testid="profile-display-name"
              autocomplete="name"
              maxlength="30"
              class="mt-1 w-full rounded-lg border border-card-border px-3 py-2"
            />
            <span v-if="errors.displayName" class="mt-1 block text-xs text-red-700">{{ errors.displayName }}</span>
          </label>

          <label class="block text-sm font-semibold text-ink">使用的電子郵件
            <input
              data-testid="profile-email"
              type="email"
              :value="email"
              readonly
              autocomplete="email"
              class="mt-1 w-full cursor-not-allowed rounded-lg border border-card-border bg-badge-category-bg px-3 py-2 text-ink-muted"
            />
          </label>

          <div class="flex justify-end">
            <Button data-testid="profile-submit" type="submit" :disabled="submitting">
              {{ submitting ? '儲存中…' : '儲存變更' }}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { validateDisplayName, validateUsername } from '@/domain/accountValidation'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const currentProfile = ref(null)
const form = reactive({ username: '', displayName: '' })
const errors = reactive({ username: null, displayName: null })
const loadError = ref(auth.profileError)
const loadingLocally = ref(false)
const submitting = ref(false)
const saveError = ref(null)
const successMessage = ref(null)

const email = computed(() => auth.user?.email || '')
const isLoading = computed(() => loadingLocally.value || auth.profileLoading)

const applyProfile = (profile) => {
  if (!profile) return
  currentProfile.value = profile
  form.username = profile.username
  form.displayName = profile.displayName
  loadError.value = null
}

watch(() => auth.profile, applyProfile, { immediate: true })
watch(() => auth.profileError, value => {
  if (!auth.profile) loadError.value = value
})

const retryLoad = async () => {
  loadingLocally.value = true
  loadError.value = null
  try {
    applyProfile(await auth.loadProfile())
  } catch (caught) {
    currentProfile.value = null
    loadError.value = caught?.message || '會員資料載入失敗，請重試'
  } finally {
    loadingLocally.value = false
  }
}

onMounted(() => {
  if (!auth.profile && !auth.profileLoading && !auth.profileError) retryLoad()
})

const submit = async () => {
  if (submitting.value) return
  saveError.value = null
  successMessage.value = null
  const usernameResult = validateUsername(form.username)
  const displayNameResult = validateDisplayName(form.displayName)
  errors.username = usernameResult.error
  errors.displayName = displayNameResult.error
  if (!usernameResult.isValid || !displayNameResult.isValid) return

  submitting.value = true
  try {
    const confirmed = await auth.updateProfile({
      username: usernameResult.value,
      displayName: displayNameResult.value
    })
    applyProfile(confirmed)
    successMessage.value = '會員資料已儲存'
  } catch (caught) {
    if (caught?.code === 'USERNAME_TAKEN') errors.username = '此名稱已被使用'
    else saveError.value = caught?.message || '會員資料儲存失敗，請重試'
  } finally {
    submitting.value = false
  }
}
</script>
