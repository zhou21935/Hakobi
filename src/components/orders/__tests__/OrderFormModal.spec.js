import { describe, it, expect } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import OrderFormModal from '@/components/orders/OrderFormModal.vue'

const body = () => new DOMWrapper(document.body)

const fillRequiredFields = async () => {
  await body().find('input[placeholder="請輸入商品名稱"]').setValue('測試商品')
  await body().find('input[type="number"]').setValue(100)
}

const mountForm = (order = null) =>
  mount(OrderFormModal, {
    props: { modelValue: true, order, pending: false },
    attachTo: document.body
  })

const submitForm = async () => {
  const submitButton = body().findAll('button').find((b) => b.text() === '送出')
  await submitButton.trigger('click')
}

const selectProductCategories = async (labels) => {
  const multiSelectButton = body()
    .findAll('button')
    .find((b) => b.text() !== '取消' && b.text() !== '送出')
  await multiSelectButton.trigger('click')
  for (const label of labels) {
    const optionLabel = body()
      .findAll('label')
      .find((l) => l.text() === label)
    await optionLabel.find('input[type="checkbox"]').setValue(true)
  }
}

describe('OrderFormModal preorder checkbox', () => {
  it('renders a "預購商品" checkbox and includes isPreorder in the submitted payload', async () => {
    const wrapper = mountForm()
    await fillRequiredFields()
    await selectProductCategories(['周邊'])

    const checkboxLabel = body().findAll('label').find((l) => l.text().includes('預購商品'))
    expect(checkboxLabel).toBeTruthy()
    await checkboxLabel.find('input[type="checkbox"]').setValue(true)

    await submitForm()

    const submitted = wrapper.emitted('submit')
    expect(submitted).toBeTruthy()
    const payload = submitted[submitted.length - 1][0]
    expect(payload.isPreorder).toBe(true)
    expect(payload).not.toHaveProperty('isConsolidated')

    wrapper.unmount()
  })

  it('does not render a "送往集運倉" checkbox anymore', () => {
    const wrapper = mountForm()
    const labels = body().findAll('label').map((l) => l.text())
    expect(labels.some((text) => text.includes('送往集運倉'))).toBe(false)
    wrapper.unmount()
  })
})

describe('OrderFormModal logistics fields', () => {
  it('submits optional shipping method and tracking number on create', async () => {
    const wrapper = mountForm()
    await fillRequiredFields()
    await selectProductCategories(['書籍'])
    await body().find('input[placeholder="例如 日本郵便 EMS"]').setValue('日本郵便 EMS')
    await body().find('input[placeholder="例如 EN123456789JP"]').setValue('EN123456789JP')
    await submitForm()
    expect(wrapper.emitted('submit').at(-1)[0]).toMatchObject({ shippingMethod: '日本郵便 EMS', trackingNumber: 'EN123456789JP' })
    wrapper.unmount()
  })

  it('prefills, clears, and submits existing logistics fields', async () => {
    const wrapper = mountForm({ name: 'Book', amount: 100, productCategories: ['book'], shippingMethod: 'DHL', trackingNumber: 'OLD' })
    const shipping = body().find('input[placeholder="例如 日本郵便 EMS"]')
    const tracking = body().find('input[placeholder="例如 EN123456789JP"]')
    expect(shipping.element.value).toBe('DHL')
    expect(tracking.element.value).toBe('OLD')
    await shipping.setValue('')
    await tracking.setValue('')
    await submitForm()
    expect(wrapper.emitted('submit').at(-1)[0]).toMatchObject({ shippingMethod: '', trackingNumber: '' })
    wrapper.unmount()
  })

  it('caps both free-text logistics fields at 2000 characters', () => {
    const wrapper = mountForm()
    expect(body().find('input[placeholder="例如 日本郵便 EMS"]').attributes('maxlength')).toBe('2000')
    expect(body().find('input[placeholder="例如 EN123456789JP"]').attributes('maxlength')).toBe('2000')
    wrapper.unmount()
  })

  it('blocks unsafe product URLs with a field error', async () => {
    const wrapper = mountForm()
    await fillRequiredFields()
    await selectProductCategories(['書籍'])
    await body().find('input[placeholder="https://"]').setValue('javascript:alert(1)')
    await submitForm()
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(body().text()).toContain('商品連結須為有效的 HTTP 或 HTTPS 網址')
    wrapper.unmount()
  })

  it('does not emit submit while pending', async () => {
    const wrapper = mountForm()
    await wrapper.setProps({ pending: true })
    const submitButton = body().findAll('button').find((button) => button.text() === '儲存中…')
    expect(submitButton.attributes()).toHaveProperty('disabled')
    await submitButton.trigger('click')
    expect(wrapper.emitted('submit')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('OrderFormModal product category field', () => {
  it('blocks submission and shows an error when no product category is selected', async () => {
    const wrapper = mountForm()
    await fillRequiredFields()

    await submitForm()

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(body().text()).toContain('請至少選擇一項商品分類')

    wrapper.unmount()
  })

  it.each([
    [['周邊'], ['merch']],
    [['書籍', '其他'], ['book', 'other']],
    [['周邊', '書籍', '其他'], ['merch', 'book', 'other']]
  ])('selecting %j persists productCategories as %j', async (labels, expected) => {
    const wrapper = mountForm()
    await fillRequiredFields()
    await selectProductCategories(labels)

    await submitForm()

    const submitted = wrapper.emitted('submit')
    expect(submitted).toBeTruthy()
    const payload = submitted[submitted.length - 1][0]
    expect(payload.productCategories).toEqual(expected)

    wrapper.unmount()
  })
})

describe('OrderFormModal existing name/amount validation is unaffected', () => {
  it('blocks submission and shows an error when product name is blank', async () => {
    const wrapper = mountForm()
    await body().find('input[type="number"]').setValue(100)
    await selectProductCategories(['周邊'])

    await submitForm()

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(body().text()).toContain('商品名稱不可為空')

    wrapper.unmount()
  })

  it('blocks submission and shows an error when amount is zero or negative', async () => {
    const wrapper = mountForm()
    await body().find('input[placeholder="請輸入商品名稱"]').setValue('測試商品')
    await body().find('input[type="number"]').setValue(0)
    await selectProductCategories(['周邊'])

    await submitForm()

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(body().text()).toContain('金額須為大於 0 的數字')

    wrapper.unmount()
  })
})

describe('OrderFormModal submits normalized data', () => {
  it('converts API ISO timestamps to date-only values when editing', async () => {
    const wrapper = mountForm({
      name: 'Book',
      amount: 100,
      productCategories: ['book'],
      orderDate: '2026-08-06T00:00:00.000Z',
      estimatedShipDate: '2026-08-10T00:00:00.000Z',
      estimatedArrivalDate: '2026-08-12T00:00:00.000Z'
    })

    expect(body().findAll('input[type="date"]').map((input) => input.element.value)).toEqual([
      '2026-08-06',
      '2026-08-10',
      '2026-08-12'
    ])

    await submitForm()

    expect(wrapper.emitted('submit').at(-1)[0]).toMatchObject({
      orderDate: '2026-08-06',
      estimatedShipDate: '2026-08-10',
      estimatedArrivalDate: '2026-08-12'
    })
    wrapper.unmount()
  })

  it('trims surrounding whitespace from the name in the submitted payload', async () => {
    const wrapper = mountForm()
    await body().find('input[placeholder="請輸入商品名稱"]').setValue('  測試商品  ')
    await body().find('input[type="number"]').setValue(100)
    await selectProductCategories(['周邊'])

    await submitForm()

    const submitted = wrapper.emitted('submit')
    expect(submitted).toBeTruthy()
    const payload = submitted[submitted.length - 1][0]
    expect(payload.name).toBe('測試商品')

    wrapper.unmount()
  })
})

describe('OrderFormModal narrow viewport layout', () => {
  it('stays within the viewport height and scrolls instead of overflowing', () => {
    const wrapper = mountForm()
    const container = body()
      .findAll('div')
      .find((d) => (d.attributes('class') || '').includes('max-h-[85vh]'))
    expect(container).toBeTruthy()
    const scrollableBody = body()
      .findAll('div')
      .find((d) => (d.attributes('class') || '').includes('overflow-y-auto'))
    expect(scrollableBody).toBeTruthy()
    wrapper.unmount()
  })

  it('arranges form field groups in a single column below the md breakpoint', () => {
    const wrapper = mountForm()
    const gridContainers = body()
      .findAll('div')
      .filter((d) => (d.attributes('class') || '').includes('grid-cols-1'))
    expect(gridContainers.length).toBeGreaterThan(0)
    for (const grid of gridContainers) {
      const cls = grid.attributes('class')
      expect(cls).not.toContain('sm:grid-cols')
      expect(cls).toMatch(/md:grid-cols-\d/)
    }
    wrapper.unmount()
  })
})
