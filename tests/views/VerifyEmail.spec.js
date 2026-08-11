import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const replace = vi.fn()
const route = { query: { email: 'new@example.com' } }
const store = { isAuthenticated: false, resendConfirmation: vi.fn().mockResolvedValue(undefined) }
vi.mock('vue-router', () => ({ useRoute: () => route, useRouter: () => ({ replace }) }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => store }))
import VerifyEmail from '@/views/VerifyEmail.vue'

describe('VerifyEmail view', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.isAuthenticated = false
    route.query = { email: 'new@example.com' }
  })

  it('navigates an authenticated confirmed member to the order overview', async () => {
    store.isAuthenticated = true
    mount(VerifyEmail)
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('/'))
  })

  it('resends with a neutral result', async () => {
    const wrapper = mount(VerifyEmail)
    await wrapper.get('form').trigger('submit')
    await vi.waitFor(() => expect(store.resendConfirmation).toHaveBeenCalledWith('new@example.com'))
    expect(wrapper.text()).toContain('如果此信箱有待驗證帳號')
  })

  it('maps and clears an invalid callback without rendering raw details', async () => {
    route.query = { email: 'new@example.com', error: 'secret-provider-detail' }
    const wrapper = mount(VerifyEmail)
    await vi.waitFor(() => expect(replace).toHaveBeenCalled())
    expect(wrapper.text()).toContain('驗證連結無效或已過期')
    expect(wrapper.text()).not.toContain('secret-provider-detail')
  })
})
