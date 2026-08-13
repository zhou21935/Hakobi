import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyableDetailValue from '@/components/ui/CopyableDetailValue.vue'

const mountValue = (props = {}) => mount(CopyableDetailValue, {
  props: { label: '訂單號碼', value: '114-2938471-0038', ...props }
})

beforeEach(() => vi.useRealTimers())
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('CopyableDetailValue', () => {
  it('copies the exact value, isolates feedback, and resets success after two seconds', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mount({
      components: { CopyableDetailValue },
      template: '<dl><CopyableDetailValue label="訂單號碼" value="114-2938471-0038" /><CopyableDetailValue label="追蹤號碼" value="EN123456789JP" /></dl>'
    })

    await wrapper.get('[aria-label="複製 訂單號碼"]').trigger('click')

    expect(writeText).toHaveBeenCalledWith('114-2938471-0038')
    expect(wrapper.get('[aria-label="複製 訂單號碼"]').text()).toBe('已複製 ✓')
    expect(wrapper.get('[aria-label="複製 追蹤號碼"]').text()).toBe('複製')
    await vi.advanceTimersByTimeAsync(2000)
    expect(wrapper.get('[aria-label="複製 訂單號碼"]').text()).toBe('複製')
  })

  it('keeps the value selectable and reports a rejected copy without throwing', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const wrapper = mountValue()

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('114-2938471-0038')
    expect(wrapper.get('.select-all').exists()).toBe(true)
    expect(wrapper.get('[role="alert"]').text()).toBe('複製失敗，請手動選取')
  })

  it('reports failure when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    const wrapper = mountValue()

    await wrapper.get('button').trigger('click')

    expect(wrapper.get('[role="alert"]').text()).toBe('複製失敗，請手動選取')
  })

  it.each([['empty string', ''], ['null', null], ['undefined', undefined]])('shows fallback without a copy control for %s', (_name, value) => {
    const wrapper = mountValue({ value })

    expect(wrapper.text()).toContain('尚未填寫')
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
