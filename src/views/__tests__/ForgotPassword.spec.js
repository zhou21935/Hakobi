import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const requestPasswordReset = vi.fn().mockResolvedValue(undefined)
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ requestPasswordReset }) }))
import ForgotPassword from '@/views/ForgotPassword.vue'

describe('ForgotPassword view', () => {
  it('shows the same neutral sent result', async () => {
    const wrapper = mount(ForgotPassword)
    await wrapper.get('input[type="email"]').setValue('unknown@example.com')
    await wrapper.get('form').trigger('submit')
    await vi.waitFor(() => expect(requestPasswordReset).toHaveBeenCalled())
    expect(wrapper.text()).toContain('如果此信箱已註冊')
  })
})
