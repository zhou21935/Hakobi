import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DeleteUndoToast from '@/components/orders/DeleteUndoToast.vue'

describe('DeleteUndoToast', () => {
  it('stays visible without a countdown and emits undo', async () => {
    const wrapper = mount(DeleteUndoToast, { props: { orderName: 'Book' } })
    expect(wrapper.text()).toContain('Book')
    expect(wrapper.text()).not.toMatch(/\d+\s*秒/)
    await wrapper.get('[data-testid="undo-delete"]').trigger('click')
    expect(wrapper.emitted('undo')).toHaveLength(1)
  })
})
