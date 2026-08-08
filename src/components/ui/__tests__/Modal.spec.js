import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '@/components/ui/Modal.vue'

const mountModal = (modelValue = true) => mount(Modal, {
  props: { modelValue, title: '測試視窗' },
  slots: { default: '<p>內容</p>', footer: '<button>操作</button>' },
  attachTo: document.body
})

afterEach(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.innerHTML = ''
})

describe('Modal background scroll lock', () => {
  it('locks body scrolling while open and restores the previous value after model close', async () => {
    document.body.style.overflow = 'scroll'
    document.documentElement.style.overflow = 'auto'
    const wrapper = mountModal()

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.documentElement.style.overflow).toBe('auto')
    wrapper.unmount()
  })

  it('restores the previous body overflow value when unmounted while open', () => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'scroll'
    const wrapper = mountModal()

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')
    wrapper.unmount()

    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('scroll')
  })

  it('requests close on Escape and restores scrolling when the parent closes it', async () => {
    const wrapper = mountModal()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
    wrapper.unmount()
  })

  it('requests close on overlay click and restores scrolling when the parent closes it', async () => {
    const wrapper = mountModal()
    const overlay = document.body.querySelector('.fixed.inset-0')
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
    wrapper.unmount()
  })
})

describe('Modal content scroll region', () => {
  it('uses the dedicated thin-scrollbar hook on the only overflow region', () => {
    const wrapper = mountModal()
    const scrollRegions = document.body.querySelectorAll('.overflow-y-auto')
    const panel = document.body.querySelector('[data-testid="modal-panel"]')

    expect(scrollRegions).toHaveLength(1)
    expect(scrollRegions[0].classList.contains('modal-scroll-area')).toBe(true)
    expect(scrollRegions[0].classList.contains('min-h-0')).toBe(true)
    expect(panel.classList.contains('overflow-hidden')).toBe(true)
    wrapper.unmount()
  })
})
