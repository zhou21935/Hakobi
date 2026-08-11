import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const store = {
  user: { email: 'owner@example.com' },
  profile: { userId: 'user-a', username: 'Hakobi_01', displayName: '會員' },
  profileLoading: false,
  profileError: null,
  loadProfile: vi.fn(),
  updateProfile: vi.fn()
}

vi.mock('@/stores/auth', () => ({ useAuthStore: () => store }))

import Profile from '@/views/Profile.vue'

const mountProfile = () => mount(Profile)

describe('Profile view', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(store, {
      user: { email: 'owner@example.com' },
      profile: { userId: 'user-a', username: 'Hakobi_01', displayName: '會員' },
      profileLoading: false,
      profileError: null
    })
    store.loadProfile.mockResolvedValue(store.profile)
    store.updateProfile.mockResolvedValue(store.profile)
  })

  it('shows the owned editable fields and read-only session email', () => {
    const wrapper = mountProfile()

    expect(wrapper.get('[data-testid="profile-username"]').element.value).toBe('Hakobi_01')
    expect(wrapper.get('[data-testid="profile-display-name"]').element.value).toBe('會員')
    expect(wrapper.get('[data-testid="profile-email"]').element.value).toBe('owner@example.com')
    expect(wrapper.get('[data-testid="profile-email"]').attributes('readonly')).toBeDefined()
  })

  it('uses concise profile copy and member-facing field labels', () => {
    const wrapper = mountProfile()
    const labels = wrapper.findAll('label').map(label => label.text())

    expect(wrapper.text()).not.toContain('查看並更新你的會員識別資料')
    expect(labels).toContainEqual(expect.stringContaining('會員名稱'))
    expect(labels).toContainEqual(expect.stringContaining('真實姓名'))
    expect(wrapper.text()).not.toContain('會員使用名稱')
    expect(wrapper.text()).not.toContain('顯示名稱／真實姓名')
  })

  it('shows loading before an owned profile is available', () => {
    store.profile = null
    store.profileLoading = true

    const wrapper = mountProfile()

    expect(wrapper.get('[data-testid="profile-loading"]').text()).toContain('載入會員資料')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('shows a safe load error and retries without displaying cached fields', async () => {
    store.profile = null
    store.profileError = '會員資料載入失敗，請重試'
    store.loadProfile.mockResolvedValue({ userId: 'user-a', username: 'Hakobi_01', displayName: '會員' })

    const wrapper = mountProfile()
    expect(wrapper.text()).toContain('會員資料載入失敗，請重試')
    expect(wrapper.find('[data-testid="profile-username"]').exists()).toBe(false)

    await wrapper.get('[data-testid="profile-retry"]').trigger('click')
    await vi.waitFor(() => expect(store.loadProfile).toHaveBeenCalled())
    await vi.waitFor(() => expect(wrapper.find('[data-testid="profile-username"]').exists()).toBe(true))
  })

  it('rejects invalid fields without sending an update', async () => {
    const wrapper = mountProfile()
    await wrapper.get('[data-testid="profile-username"]').setValue('ab')
    await wrapper.get('[data-testid="profile-display-name"]').setValue('王 小明')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('使用名稱須為 3–20 個字元')
    expect(wrapper.text()).toContain('顯示名稱只能包含中文、英文字母及數字')
    expect(store.updateProfile).not.toHaveBeenCalled()
  })

  it('disables duplicate submission and confirms returned profile state', async () => {
    let resolveUpdate
    store.updateProfile.mockImplementation(() => new Promise(resolve => { resolveUpdate = resolve }))
    const wrapper = mountProfile()
    await wrapper.get('[data-testid="profile-username"]').setValue('Hakobi_02')
    await wrapper.get('[data-testid="profile-display-name"]').setValue('王小明')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[data-testid="profile-submit"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-testid="profile-submit"]').text()).toContain('儲存中')

    resolveUpdate({ userId: 'user-a', username: 'Hakobi_02', displayName: '王小明' })
    await vi.waitFor(() => expect(wrapper.text()).toContain('會員資料已儲存'))
    expect(store.updateProfile).toHaveBeenCalledWith({ username: 'Hakobi_02', displayName: '王小明' })
    expect(wrapper.get('[data-testid="profile-username"]').element.value).toBe('Hakobi_02')
  })

  it('keeps the submitted form and maps a username conflict to the field', async () => {
    store.updateProfile.mockRejectedValue(Object.assign(new Error('此名稱已被使用'), { code: 'USERNAME_TAKEN' }))
    const wrapper = mountProfile()
    await wrapper.get('[data-testid="profile-username"]').setValue('Hakobi_02')
    await wrapper.get('[data-testid="profile-display-name"]').setValue('王小明')
    await wrapper.get('form').trigger('submit')

    await vi.waitFor(() => expect(wrapper.text()).toContain('此名稱已被使用'))
    expect(wrapper.get('[data-testid="profile-username"]').element.value).toBe('Hakobi_02')
    expect(store.profile.username).toBe('Hakobi_01')
  })

  it('keeps the submitted form and confirmed store state after a generic failure', async () => {
    store.updateProfile.mockRejectedValue(new Error('會員資料儲存失敗，請重試'))
    const wrapper = mountProfile()
    await wrapper.get('[data-testid="profile-username"]').setValue('Hakobi_02')
    await wrapper.get('[data-testid="profile-display-name"]').setValue('王小明')
    await wrapper.get('form').trigger('submit')

    await vi.waitFor(() => expect(wrapper.text()).toContain('會員資料儲存失敗，請重試'))
    expect(wrapper.get('[data-testid="profile-display-name"]').element.value).toBe('王小明')
    expect(store.profile).toEqual({ userId: 'user-a', username: 'Hakobi_01', displayName: '會員' })
  })
})
