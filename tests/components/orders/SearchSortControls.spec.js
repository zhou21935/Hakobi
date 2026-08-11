import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchSortControls from '@/components/orders/SearchSortControls.vue'

describe('SearchSortControls', () => {
  it('emits update:search when the user types into the search input', async () => {
    const wrapper = mount(SearchSortControls, { props: { search: '', sort: '' } })
    await wrapper.get('input').setValue('測試商品')
    expect(wrapper.emitted('update:search')).toEqual([['測試商品']])
  })

  it('emits update:sort when the user selects a sort option', async () => {
    const wrapper = mount(SearchSortControls, { props: { search: '', sort: '' } })
    await wrapper.get('select').setValue('amount-desc')
    expect(wrapper.emitted('update:sort')).toEqual([['amount-desc']])
  })

  it('renders exactly 5 sort options in the documented order', () => {
    const wrapper = mount(SearchSortControls, { props: { search: '', sort: '' } })
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(5)
    expect(options.map((o) => o.text())).toEqual([
      '預設排序',
      '日期：新到舊',
      '日期：舊到新',
      '金額：高到低',
      '金額：低到高'
    ])
    expect(options.map((o) => o.attributes('value'))).toEqual([
      '',
      'date-desc',
      'date-asc',
      'amount-desc',
      'amount-asc'
    ])
  })

  it('uses the search prop as the search input placeholder text of 搜尋名稱或備註', () => {
    const wrapper = mount(SearchSortControls, { props: { search: '', sort: '' } })
    expect(wrapper.get('input').attributes('placeholder')).toBe('搜尋名稱或備註')
  })
})
