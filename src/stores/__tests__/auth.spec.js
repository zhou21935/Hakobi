import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const auth = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  resend: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
}))

const rpc = vi.hoisted(() => vi.fn())
const single = vi.hoisted(() => vi.fn())
const eq = vi.hoisted(() => vi.fn(() => ({ single })))
const select = vi.hoisted(() => vi.fn(() => ({ eq })))
const updateSingle = vi.hoisted(() => vi.fn())
const updateSelect = vi.hoisted(() => vi.fn(() => ({ single: updateSingle })))
const updateEq = vi.hoisted(() => vi.fn(() => ({ select: updateSelect })))
const update = vi.hoisted(() => vi.fn(() => ({ eq: updateEq })))
const from = vi.hoisted(() => vi.fn(() => ({ select, update })))

vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ auth, rpc, from }),
  authRedirectUrl: path => `https://hakobi.test${path}`
}))

import { useAuthStore } from '@/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('establishes the returned session for valid email credentials', async () => {
    const session = { access_token: 'secret-token', user: { id: 'user-a' } }
    auth.signInWithPassword.mockResolvedValue({ data: { session }, error: null })

    const store = useAuthStore()
    await store.signIn('owner@example.com', 'correct-password')

    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@example.com',
      password: 'correct-password'
    })
    expect(store.session).toEqual(session)
    expect(store.error).toBeNull()
  })

  it('uses a safe message when Supabase rejects credentials', async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: new Error('server detail contains secret-token')
    })

    const store = useAuthStore()
    await expect(store.signIn('owner@example.com', 'wrong-password')).rejects.toThrow('電子郵件或密碼不正確')

    expect(store.session).toBeNull()
    expect(store.error).toBe('電子郵件或密碼不正確')
    expect(store.error).not.toContain('secret-token')
  })

  it('explains that an unconfirmed member must verify email', async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: { code: 'email_not_confirmed' } })
    const store = useAuthStore()
    await expect(store.signIn('new@example.com', 'hako2026')).rejects.toThrow('請先完成電子郵件驗證')
  })

  it('signs up with username metadata without authenticating an unconfirmed response', async () => {
    auth.signUp.mockResolvedValue({ data: { user: { id: 'user-a' }, session: null }, error: null })
    const store = useAuthStore()
    await store.signUp({ email: 'new@example.com', username: 'Hakobi_01', password: 'hako2026' })
    expect(auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'hako2026',
      options: { data: { username: 'Hakobi_01' }, emailRedirectTo: 'https://hakobi.test/verify-email' }
    })
    expect(store.session).toBeNull()
  })

  it('maps a raced username conflict to the required field message', async () => {
    auth.signUp.mockResolvedValue({ data: {}, error: { code: 'unexpected_failure' } })
    rpc.mockResolvedValue({ data: false, error: null })
    const store = useAuthStore()
    await expect(store.signUp({ email: 'new@example.com', username: 'Hakobi', password: 'hako2026' })).rejects.toThrow('此名稱已被使用')
  })

  it('checks availability and loads only the owned profile', async () => {
    rpc.mockResolvedValue({ data: true, error: null })
    single.mockResolvedValue({ data: { user_id: 'user-a', username: 'Hakobi', display_name: '王小明' }, error: null })
    const store = useAuthStore()
    store.session = { user: { id: 'user-a', email: 'a@example.com' } }
    await expect(store.checkUsernameAvailability('Hakobi')).resolves.toBe(true)
    await store.loadProfile()
    expect(rpc).toHaveBeenCalledWith('is_username_available', { candidate: 'Hakobi' })
    expect(eq).toHaveBeenCalledWith('user_id', 'user-a')
    expect(select).toHaveBeenCalledWith('user_id, username, display_name')
    expect(store.profile).toEqual({ userId: 'user-a', username: 'Hakobi', displayName: '王小明' })
  })

  it('updates only editable owned profile fields and confirms returned state', async () => {
    updateSingle.mockResolvedValue({
      data: { user_id: 'user-a', username: 'Hakobi_02', display_name: '王小明' },
      error: null
    })
    const store = useAuthStore()
    store.session = { user: { id: 'user-a', email: 'owner@example.com' } }
    store.profile = { userId: 'user-a', username: 'Hakobi_01', displayName: '會員' }

    await store.updateProfile({ username: 'Hakobi_02', displayName: '王小明', email: 'attacker@example.com', userId: 'user-b' })

    expect(update).toHaveBeenCalledWith({
      username: 'Hakobi_02',
      username_normalized: 'hakobi_02',
      display_name: '王小明'
    })
    expect(updateEq).toHaveBeenCalledWith('user_id', 'user-a')
    expect(updateSelect).toHaveBeenCalledWith('user_id, username, display_name')
    expect(store.profile).toEqual({ userId: 'user-a', username: 'Hakobi_02', displayName: '王小明' })
  })

  it('rejects invalid profile fields without sending an update', async () => {
    const store = useAuthStore()
    store.session = { user: { id: 'user-a' } }

    await expect(store.updateProfile({ username: 'Hakobi_02', displayName: '王 小明' })).rejects.toThrow('顯示名稱只能包含中文、英文字母及數字')
    expect(update).not.toHaveBeenCalled()
  })

  it('maps a profile username collision and preserves confirmed state', async () => {
    updateSingle.mockResolvedValue({ data: null, error: { code: '23505', message: 'member_profiles_username_normalized_key' } })
    const store = useAuthStore()
    store.session = { user: { id: 'user-a' } }
    store.profile = { userId: 'user-a', username: 'Hakobi_01', displayName: '會員' }

    await expect(store.updateProfile({ username: 'Hakobi_02', displayName: '王小明' })).rejects.toThrow('此名稱已被使用')
    expect(store.profile).toEqual({ userId: 'user-a', username: 'Hakobi_01', displayName: '會員' })
  })

  it('uses a safe profile save error and preserves confirmed state', async () => {
    updateSingle.mockResolvedValue({ data: null, error: { code: 'unexpected', message: 'secret database detail' } })
    const store = useAuthStore()
    store.session = { user: { id: 'user-a' } }
    store.profile = { userId: 'user-a', username: 'Hakobi_01', displayName: '會員' }

    await expect(store.updateProfile({ username: 'Hakobi_02', displayName: '王小明' })).rejects.toThrow('會員資料儲存失敗，請重試')
    expect(store.profile).toEqual({ userId: 'user-a', username: 'Hakobi_01', displayName: '會員' })
  })

  it('uses neutral email flows and updates a recovery password once', async () => {
    auth.resend.mockResolvedValue({ error: null })
    auth.resetPasswordForEmail.mockResolvedValue({ error: null })
    auth.updateUser.mockResolvedValue({ data: {}, error: null })
    const store = useAuthStore()
    await store.resendConfirmation('new@example.com')
    await store.requestPasswordReset('unknown@example.com')
    store.recoverySession = true
    await store.updatePassword('newpass2026', 'Hakobi')
    expect(auth.resend).toHaveBeenCalledWith({ type: 'signup', email: 'new@example.com', options: { emailRedirectTo: 'https://hakobi.test/verify-email' } })
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith('unknown@example.com', { redirectTo: 'https://hakobi.test/reset-password' })
    expect(auth.updateUser).toHaveBeenCalledWith({ password: 'newpass2026' })
    expect(store.recoverySession).toBe(false)
  })

  it('restores an existing session before initialization completes', async () => {
    const session = { access_token: 'restored-token', user: { id: 'user-a' } }
    auth.getSession.mockResolvedValue({ data: { session }, error: null })
    const store = useAuthStore()

    await store.initialize()

    expect(store.session).toEqual(session)
    expect(store.initialized).toBe(true)
    expect(auth.onAuthStateChange).toHaveBeenCalledOnce()
  })

  it('initializes without a user when no session exists', async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    const store = useAuthStore()

    await store.initialize()

    expect(store.session).toBeNull()
    expect(store.initialized).toBe(true)
  })

  it('registers the auth listener before session lookup and captures recovery state', async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    const store = useAuthStore()
    await store.initialize()
    expect(auth.onAuthStateChange.mock.invocationCallOrder[0]).toBeLessThan(auth.getSession.mock.invocationCallOrder[0])
    const listener = auth.onAuthStateChange.mock.calls[0][0]
    listener('PASSWORD_RECOVERY', { user: { id: 'user-a' } })
    expect(store.recoverySession).toBe(true)
  })

  it('clears the previous profile when the authenticated user changes', async () => {
    auth.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-a' } } }, error: null })
    const store = useAuthStore()
    await store.initialize()
    store.profile = { userId: 'user-a', username: 'Hakobi', displayName: '會員' }

    const listener = auth.onAuthStateChange.mock.calls[0][0]
    listener('SIGNED_IN', { user: { id: 'user-b' } })

    expect(store.profile).toBeNull()
  })

  it('signs out and runs user-scoped cleanup', async () => {
    auth.signOut.mockResolvedValue({ error: null })
    const cleanup = vi.fn()
    const store = useAuthStore()
    store.session = { access_token: 'token', user: { id: 'user-a' } }
    store.setSessionCleanup(cleanup)

    await store.signOut()

    expect(auth.signOut).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(store.session).toBeNull()
    expect(store.profile).toBeNull()
  })
})
