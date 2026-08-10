import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getSupabase } from '@/lib/supabase'
import { authRedirectUrl } from '@/lib/supabase'
import { validateEmail, validatePassword, validateUsername } from '@/domain/accountValidation'

const LOGIN_ERROR = '電子郵件或密碼不正確'
const VERIFY_EMAIL_ERROR = '請先完成電子郵件驗證'
const GENERIC_AUTH_ERROR = '帳號操作失敗，請稍後再試'
const RATE_LIMIT_ERROR = '操作次數過多，請稍後再試'
const USERNAME_TAKEN = '此名稱已被使用'

const safeError = (message, code) => Object.assign(new Error(message), { code })

const mapProviderError = (providerError, fallback = GENERIC_AUTH_ERROR) => {
  if (providerError?.code === 'email_not_confirmed') return safeError(VERIFY_EMAIL_ERROR, 'EMAIL_NOT_CONFIRMED')
  if (providerError?.status === 429 || String(providerError?.code || '').includes('rate_limit')) return safeError(RATE_LIMIT_ERROR, 'RATE_LIMITED')
  return safeError(fallback, 'AUTH_OPERATION_FAILED')
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const initialized = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)
  const profile = ref(null)
  const profileLoading = ref(false)
  const profileError = ref(null)
  const recoverySession = ref(false)
  let subscription
  let sessionCleanup = () => {}

  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)

  const signIn = async (email, password) => {
    isSubmitting.value = true
    error.value = null
    try {
      const { data, error: authError } = await getSupabase().auth.signInWithPassword({ email, password })
      if (authError?.code === 'email_not_confirmed') throw mapProviderError(authError)
      if (authError || !data.session) throw safeError(LOGIN_ERROR, 'INVALID_CREDENTIALS')
      session.value = data.session
    } catch (caught) {
      const mapped = caught?.code ? caught : safeError(LOGIN_ERROR, 'INVALID_CREDENTIALS')
      error.value = mapped.message
      throw mapped
    } finally {
      isSubmitting.value = false
    }
  }

  const checkUsernameAvailability = async (username) => {
    const validation = validateUsername(username)
    if (!validation.isValid) throw safeError(validation.error, 'INVALID_USERNAME')
    const { data, error: rpcError } = await getSupabase().rpc('is_username_available', { candidate: validation.value })
    if (rpcError) throw mapProviderError(rpcError)
    return data === true
  }

  const signUp = async ({ email, username, password }) => {
    const emailResult = validateEmail(email)
    const usernameResult = validateUsername(username)
    const passwordResult = validatePassword(password, usernameResult.value)
    const validationError = emailResult.error || usernameResult.error || passwordResult.error
    if (validationError) throw safeError(validationError, 'VALIDATION_ERROR')
    isSubmitting.value = true
    error.value = null
    try {
      const { data, error: authError } = await getSupabase().auth.signUp({
        email: emailResult.value,
        password,
        options: {
          data: { username: usernameResult.value },
          emailRedirectTo: authRedirectUrl('/verify-email')
        }
      })
      if (authError) {
        const available = await checkUsernameAvailability(usernameResult.value).catch(() => true)
        if (!available) throw safeError(USERNAME_TAKEN, 'USERNAME_TAKEN')
        throw mapProviderError(authError, '註冊失敗，請稍後再試')
      }
      if (data.session?.user?.email_confirmed_at) session.value = data.session
      else session.value = null
      return data.user
    } catch (caught) {
      const mapped = caught?.code ? caught : mapProviderError(caught, '註冊失敗，請稍後再試')
      error.value = mapped.message
      throw mapped
    } finally {
      isSubmitting.value = false
    }
  }

  const resendConfirmation = async (email) => {
    const emailResult = validateEmail(email)
    if (!emailResult.isValid) throw safeError(emailResult.error, 'VALIDATION_ERROR')
    const { error: resendError } = await getSupabase().auth.resend({
      type: 'signup',
      email: emailResult.value,
      options: { emailRedirectTo: authRedirectUrl('/verify-email') }
    })
    if (resendError) throw mapProviderError(resendError)
  }

  const requestPasswordReset = async (email) => {
    const emailResult = validateEmail(email)
    if (!emailResult.isValid) throw safeError(emailResult.error, 'VALIDATION_ERROR')
    const { error: resetError } = await getSupabase().auth.resetPasswordForEmail(emailResult.value, {
      redirectTo: authRedirectUrl('/reset-password')
    })
    if (resetError) throw mapProviderError(resetError)
  }

  const updatePassword = async (password, username = profile.value?.username || '') => {
    if (!recoverySession.value) throw safeError('密碼重設連結無效或已過期', 'INVALID_RECOVERY_SESSION')
    const passwordResult = validatePassword(password, username)
    if (!passwordResult.isValid) throw safeError(passwordResult.error, 'VALIDATION_ERROR')
    const { error: updateError } = await getSupabase().auth.updateUser({ password })
    if (updateError) throw mapProviderError(updateError)
    recoverySession.value = false
  }

  const loadProfile = async () => {
    if (!session.value?.user?.id) return null
    profileLoading.value = true
    profileError.value = null
    try {
      const { data, error: queryError } = await getSupabase()
        .from('member_profiles')
        .select('user_id, username')
        .eq('user_id', session.value.user.id)
        .single()
      if (queryError || !data) throw safeError('會員資料載入失敗，請重試', 'PROFILE_LOAD_FAILED')
      profile.value = { userId: data.user_id, username: data.username }
      return profile.value
    } catch (caught) {
      profile.value = null
      profileError.value = caught?.message || '會員資料載入失敗，請重試'
      throw safeError(profileError.value, 'PROFILE_LOAD_FAILED')
    } finally {
      profileLoading.value = false
    }
  }

  const initialize = async () => {
    if (initialized.value) return
    const supabase = getSupabase()
    subscription = supabase.auth.onAuthStateChange((event, nextSession) => {
      session.value = nextSession
      recoverySession.value = event === 'PASSWORD_RECOVERY'
      if (!nextSession) clearProfile()
    }).data.subscription
    const { data, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) session.value = null
    else session.value = data.session
    initialized.value = true
  }

  const signOut = async () => {
    try {
      await getSupabase().auth.signOut()
    } finally {
      session.value = null
      recoverySession.value = false
      clearProfile()
      sessionCleanup()
    }
  }

  const clearSession = () => {
    session.value = null
    recoverySession.value = false
    clearProfile()
    sessionCleanup()
  }
  const clearProfile = () => {
    profile.value = null
    profileError.value = null
    profileLoading.value = false
  }
  const setSessionCleanup = (cleanup) => {
    if (typeof cleanup !== 'function') throw new TypeError('Session cleanup must be a function')
    sessionCleanup = cleanup
  }
  const dispose = () => subscription?.unsubscribe()

  return {
    session, user, initialized, isSubmitting, error, isAuthenticated,
    profile, profileLoading, profileError, recoverySession,
    signIn, signUp, resendConfirmation, requestPasswordReset, updatePassword,
    checkUsernameAvailability, loadProfile, clearProfile,
    initialize, signOut, clearSession, setSessionCleanup, dispose
  }
})
