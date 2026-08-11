import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const replace = vi.fn()
const updatePassword = vi.fn().mockResolvedValue(undefined)
const store = { recoverySession: true, profile: { username: 'Hakobi' }, user: null, updatePassword }
vi.mock('vue-router', () => ({ useRouter: () => ({ replace }) }))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => store }))
import ResetPassword from '@/views/ResetPassword.vue'

describe('ResetPassword view', () => {
  it('blocks invalid passwords and accepts a valid recovery update once', async () => {
    const wrapper = mount(ResetPassword)
    const fields = wrapper.findAll('input[type="password"]')
    await fields[0].setValue('lettersOnly')
    await fields[1].setValue('lettersOnly')
    await wrapper.get('form').trigger('submit')
    expect(updatePassword).not.toHaveBeenCalled()
    await fields[0].setValue('newpass2026')
    await fields[1].setValue('newpass2026')
    await wrapper.get('form').trigger('submit')
    await vi.waitFor(() => expect(updatePassword).toHaveBeenCalledOnce())
    expect(replace).toHaveBeenCalledWith('/orders')
  })
})
