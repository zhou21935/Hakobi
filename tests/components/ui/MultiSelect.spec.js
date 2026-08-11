import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MultiSelect from '@/components/ui/MultiSelect.vue'

const options = [
  { value: 'merch', label: '周邊' },
  { value: 'book', label: '書籍' },
  { value: 'other', label: '其他' }
]

describe('MultiSelect v-model binding', () => {
  it('toggling an unselected option adds it to the bound array', async () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: [], options } })
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['merch'])
  })

  it('toggling a selected option removes it from the bound array', async () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: ['merch', 'book'], options } })
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('input[type="checkbox"]')[0].setValue(false)
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['book'])
  })

  it('renders selected options as chips in the closed control', () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: ['merch', 'other'], options } })
    const text = wrapper.find('button').text()
    expect(text).toContain('周邊')
    expect(text).toContain('其他')
  })

  it('shows the placeholder when modelValue is empty', () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: [], options, placeholder: '請選擇商品分類' } })
    expect(wrapper.find('button').text()).toContain('請選擇商品分類')
  })

  it('does not open the panel or emit when disabled', async () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: [], options, disabled: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('MultiSelect panel open/close behavior', () => {
  it('opens the option panel with a checkbox per option when the control is clicked', async () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: [], options } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)
  })

  it('keeps the panel open after toggling one option', async () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: [], options } })
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)
  })

  it('closes the panel when a click outside the component occurs', async () => {
    const wrapper = mount(MultiSelect, {
      props: { modelValue: [], options },
      attachTo: document.body
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)

    await document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0)
    wrapper.unmount()
  })

  it('closes the panel when the Escape key is pressed', async () => {
    const wrapper = mount(MultiSelect, {
      props: { modelValue: [], options },
      attachTo: document.body
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)

    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0)
    wrapper.unmount()
  })
})

describe('MultiSelect validation error message', () => {
  it('renders the error text below the control when error is a non-empty string', () => {
    const wrapper = mount(MultiSelect, { props: { modelValue: [], options, error: '請至少選擇一項商品分類' } })
    expect(wrapper.text()).toContain('請至少選擇一項商品分類')
  })
})
