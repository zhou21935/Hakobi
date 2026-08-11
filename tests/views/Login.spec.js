import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'

const replace = vi.fn()
const route = { query: {} }
vi.mock('vue-router', () => ({ useRouter: () => ({ replace }), useRoute: () => route }))

const signIn = vi.fn()
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ signIn, isSubmitting: false, error: null })
}))

import Login from '@/views/Login.vue'

describe('Login view', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    route.query = {}
  })

  it('navigates to the order overview after successful sign in', async () => {
    signIn.mockResolvedValue(undefined)
    const wrapper = mount(Login)

    await wrapper.get('input[type="email"]').setValue('owner@example.com')
    await wrapper.get('input[type="password"]').setValue('correct-password')
    await wrapper.get('form').trigger('submit')
    await Promise.resolve()

    expect(signIn).toHaveBeenCalledWith('owner@example.com', 'correct-password')
    expect(replace).toHaveBeenCalledWith('/')
  })

  it('stays on login after rejected credentials', async () => {
    signIn.mockRejectedValue(new Error('電子郵件或密碼不正確'))
    const wrapper = mount(Login)

    await wrapper.get('input[type="email"]').setValue('owner@example.com')
    await wrapper.get('input[type="password"]').setValue('wrong-password')
    await wrapper.get('form').trigger('submit')
    await Promise.resolve()

    expect(replace).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('電子郵件或密碼不正確')
  })

  it('returns to a safe original route and rejects an external redirect', async () => {
    signIn.mockResolvedValue(undefined)
    route.query = { redirect: '/orders/parcel' }
    const wrapper = mount(Login)
    await wrapper.get('input[type="email"]').setValue('owner@example.com')
    await wrapper.get('input[type="password"]').setValue('correct-password')
    await wrapper.get('form').trigger('submit')
    await Promise.resolve()
    expect(replace).toHaveBeenLastCalledWith('/orders/parcel')

    route.query = { redirect: '//evil.example' }
    await wrapper.get('form').trigger('submit')
    await Promise.resolve()
    expect(replace).toHaveBeenLastCalledWith('/')
  })
})
