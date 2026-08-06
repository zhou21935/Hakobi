import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getSupabase } from '@/lib/supabase'

const LOGIN_ERROR = '電子郵件或密碼不正確'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const initialized = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)
  let subscription
  let sessionCleanup = () => {}

  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)

  const signIn = async (email, password) => {
    isSubmitting.value = true
    error.value = null
    try {
      const { data, error: authError } = await getSupabase().auth.signInWithPassword({ email, password })
      if (authError || !data.session) throw new Error(LOGIN_ERROR)
      session.value = data.session
    } catch {
      error.value = LOGIN_ERROR
      throw new Error(LOGIN_ERROR)
    } finally {
      isSubmitting.value = false
    }
  }

  const initialize = async () => {
    if (initialized.value) return
    const supabase = getSupabase()
    const { data, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) session.value = null
    else session.value = data.session
    subscription = supabase.auth.onAuthStateChange((_event, nextSession) => {
      session.value = nextSession
    }).data.subscription
    initialized.value = true
  }

  const signOut = async () => {
    try {
      await getSupabase().auth.signOut()
    } finally {
      session.value = null
      sessionCleanup()
    }
  }

  const clearSession = () => {
    session.value = null
    sessionCleanup()
  }
  const setSessionCleanup = (cleanup) => {
    if (typeof cleanup !== 'function') throw new TypeError('Session cleanup must be a function')
    sessionCleanup = cleanup
  }
  const dispose = () => subscription?.unsubscribe()

  return { session, user, initialized, isSubmitting, error, isAuthenticated, signIn, initialize, signOut, clearSession, setSessionCleanup, dispose }
})
