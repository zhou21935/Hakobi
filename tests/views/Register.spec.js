import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const push = vi.fn()
const store = { isSubmitting: false, checkUsernameAvailability: vi.fn(), signUp: vi.fn() }
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => store }))
import Register from '@/views/Register.vue'

describe('Register view', () => {
  beforeEach(() => { vi.clearAllMocks(); store.checkUsernameAvailability.mockResolvedValue(true); store.signUp.mockResolvedValue(undefined) })
  it('submits valid fields and enters verification waiting state', async () => {
    const wrapper = mount(Register)
    await wrapper.get('[data-testid="register-email"]').setValue('new@example.com')
    await wrapper.get('[data-testid="register-username"]').setValue('Hakobi_01')
    await wrapper.get('[data-testid="register-password"]').setValue('hako2026')
    await wrapper.get('[data-testid="register-confirm-password"]').setValue('hako2026')
    await wrapper.get('form').trigger('submit'); await vi.waitFor(() => expect(store.signUp).toHaveBeenCalledOnce())
    expect(push).toHaveBeenCalledWith({ name: 'VerifyEmail', query: { email: 'new@example.com', sent: '1' } })
  })
  it('shows the required duplicate message and does not sign up', async () => {
    store.checkUsernameAvailability.mockResolvedValue(false)
    const wrapper = mount(Register)
    await wrapper.get('[data-testid="register-email"]').setValue('new@example.com')
    await wrapper.get('[data-testid="register-username"]').setValue('Hakobi_01')
    await wrapper.get('[data-testid="register-password"]').setValue('hako2026')
    await wrapper.get('[data-testid="register-confirm-password"]').setValue('hako2026')
    await wrapper.get('form').trigger('submit'); await vi.waitFor(() => expect(wrapper.text()).toContain('此名稱已被使用'))
    expect(store.signUp).not.toHaveBeenCalled()
  })
})
