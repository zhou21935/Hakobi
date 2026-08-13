import { afterEach, describe, it, expect } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import OrderFormModal from '@/components/orders/OrderFormModal.vue'

const body = () => new DOMWrapper(document.body)

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

const fillRequiredFields = async () => {
  await body().find('input[placeholder="請輸入商品名稱"]').setValue('測試商品')
  await body().find('input[type="number"]').setValue(100)
}

const mountForm = (order = null, extraProps = {}) =>
  mount(OrderFormModal, {
    props: { modelValue: true, order, pending: false, category: 'agent', ...extraProps },
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

describe('OrderFormModal grouped sections', () => {
  it.each([
    ['product', '商品'],
    ['cargo', '貨物'],
    ['shipping', '物流'],
    ['notes', '備註']
  ])('renders the %s section labelled %s in create mode', (section, label) => {
    const wrapper = mountForm()
    const region = body().find(`[data-testid="order-section-${section}"]`)
    expect(region.exists()).toBe(true)
    expect(region.text()).toContain(label)
    wrapper.unmount()
  })

  it('uses the same four sections in edit mode without changing category controls', () => {
    const wrapper = mountForm({ category: 'agent', name: 'Book', amount: 100, productCategories: ['book'] }, { category: null })
    expect(body().findAll('[data-testid^="order-section-"]')).toHaveLength(4)
    expect(body().find('[data-testid="order-category"]').exists()).toBe(false)
    expect(body().text()).toContain('書籍')
    expect(body().text()).not.toMatch(/公仔模型|服飾|3C/)
    wrapper.unmount()
  })
})

describe('OrderFormModal order category', () => {
  it('requires a category in all-orders create mode and submits the selected category', async () => {
    const wrapper = mountForm(null, { category: null })
    await fillRequiredFields()
    await selectProductCategories(['周邊'])
    await submitForm()
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(body().text()).toContain('請選擇訂單分類')
    const categorySelect = body().findAll('select').find((select) => select.attributes('data-testid') === 'order-category')
    await categorySelect.setValue('parcel')
    await submitForm()
    expect(wrapper.emitted('submit').at(-1)[0].category).toBe('parcel')
    wrapper.unmount()
  })

  it('uses the locked route category for create and keeps edit category unchanged', async () => {
    const create = mountForm(null, { category: 'parcel' })
    expect(body().find('[data-testid="order-category"]').exists()).toBe(false)
    await fillRequiredFields()
    await selectProductCategories(['周邊'])
    await submitForm()
    expect(create.emitted('submit').at(-1)[0].category).toBe('parcel')
    create.unmount()
    document.body.innerHTML = ''

    const edit = mountForm({ category: 'agent', name: 'Book', amount: 100, productCategories: ['book'] }, { category: null })
    await submitForm()
    expect(edit.emitted('submit').at(-1)[0].category).toBe('agent')
    edit.unmount()
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

describe('OrderFormModal frontend-only future fields', () => {
  it('lists multiple attachments, removes one, and excludes future fields from submit', async () => {
    const wrapper = mountForm()
    await fillRequiredFields()
    await selectProductCategories(['周邊'])
    await body().find('[data-testid="order-number"]').find('input').setValue('114-2938471-0038')
    const input = body().find('[data-testid="order-attachments"]')
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }), new File(['photo'], 'photo.jpg', { type: 'image/jpeg' })]
    })
    await input.trigger('change')

    expect(body().text()).toContain('invoice.pdf')
    expect(body().text()).toContain('PDF')
    expect(body().text()).toContain('photo.jpg')
    expect(body().text()).toContain('JPG')
    await body().find('[data-testid="remove-attachment-0"]').trigger('click')
    expect(body().text()).not.toContain('invoice.pdf')
    expect(body().text()).toContain('photo.jpg')

    await submitForm()
    const payload = wrapper.emitted('submit').at(-1)[0]
    expect(payload).not.toHaveProperty('orderNumber')
    expect(payload).not.toHaveProperty('files')
    wrapper.unmount()
  })

  it('clears order number and attachments whenever the form reopens', async () => {
    const wrapper = mountForm()
    await body().find('[data-testid="order-number"]').find('input').setValue('114-2938471-0038')
    const input = body().find('[data-testid="order-attachments"]')
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })]
    })
    await input.trigger('change')
    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    expect(body().find('[data-testid="order-number"]').find('input').element.value).toBe('')
    expect(body().text()).not.toContain('invoice.pdf')
    wrapper.unmount()
  })
})

describe('OrderFormModal multiline notes', () => {
  it('uses a visible multiline textarea and preserves line breaks in submit', async () => {
    const wrapper = mountForm()
    await fillRequiredFields()
    await selectProductCategories(['周邊'])
    const notes = body().find('[data-testid="order-notes"]')
    expect(notes.element.tagName).toBe('TEXTAREA')
    expect(notes.attributes('class')).toContain('min-h-[120px]')
    expect(notes.attributes('class')).toContain('lg:min-h-[104px]')
    await notes.setValue('第一行\n第二行')
    await submitForm()
    expect(wrapper.emitted('submit').at(-1)[0].notes).toBe('第一行\n第二行')
    wrapper.unmount()
  })
})

describe('OrderFormModal reference surfaces', () => {
  it('opts every non-action control into the reference surface while preserving button variants', () => {
    const wrapper = mountForm()
    expect(body().find('[data-testid="modal-panel"]').attributes('class')).toContain('order-form-dialog')
    expect(body().find('[data-testid="modal-header"]').attributes('class')).toContain('bg-[#f7f4fa]')
    expect(body().find('[data-testid="modal-content"]').attributes('class')).toContain('bg-[#faf8fc]')

    const sections = body().findAll('[data-testid^="order-section-"]')
    expect(sections).toHaveLength(4)
    sections.forEach((section) => expect(section.attributes('class')).toContain('order-form-section'))

    const controls = body().findAll('.order-form-control')
    expect(controls.length).toBeGreaterThan(10)
    expect(controls.some((control) => control.find('input[type="date"]').exists())).toBe(true)
    expect(controls.some((control) => control.find('select').exists())).toBe(true)
    expect(controls.some((control) => control.find('button').exists())).toBe(true)
    expect(controls.some((control) => control.find('input[type="checkbox"]').exists())).toBe(true)
    expect(body().find('[data-testid="order-notes"]').attributes('class')).toContain('order-form-textarea')
    expect(body().find('[data-testid="attachment-picker"]').attributes('class')).toContain('order-form-attachment')

    const cancel = body().findAll('button').find((button) => button.text() === '取消')
    const submit = body().findAll('button').find((button) => button.text() === '送出')
    expect(cancel.attributes('class')).toContain('bg-white')
    expect(cancel.attributes('class')).toContain('border-card-border')
    expect(submit.attributes('class')).toContain('from-primary-from')
    expect(submit.attributes('class')).toContain('to-primary-to')
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
      .find((d) => (d.attributes('class') || '').includes('max-h-[92dvh]'))
    expect(container).toBeTruthy()
    const scrollableBody = body()
      .findAll('div')
      .find((d) => (d.attributes('class') || '').includes('overflow-y-auto'))
    expect(scrollableBody).toBeTruthy()
    wrapper.unmount()
  })

  it('arranges cargo fields in one column on phones and two columns from tablet width', () => {
    const wrapper = mountForm()
    const gridContainers = body()
      .findAll('div')
      .filter((d) => (d.attributes('class') || '').includes('grid-cols-1'))
    expect(gridContainers.length).toBeGreaterThan(0)
    for (const grid of gridContainers) {
      const cls = grid.attributes('class')
      expect(cls).toContain('sm:grid-cols-2')
    }
    wrapper.unmount()
  })

  it('exposes the phone, tablet, and desktop layout contract without duplicate controls', () => {
    const wrapper = mountForm()
    const overlayClass = body().find('[data-testid="modal-overlay"]').attributes('class')
    const panelClass = body().find('[data-testid="modal-panel"]').attributes('class')
    const contentClass = body().find('[data-testid="modal-content"]').attributes('class')
    const footerClass = body().find('[data-testid="modal-footer"]').attributes('class')
    expect(overlayClass).toContain('items-end')
    expect(overlayClass).toContain('sm:items-center')
    expect(panelClass).toContain('h-[92dvh]')
    expect(panelClass).toContain('sm:max-w-[560px]')
    expect(panelClass).toContain('lg:max-w-[880px]')
    expect(contentClass).toContain('overflow-y-auto')
    expect(footerClass).toContain('shrink-0')
    expect(body().find('[data-testid="order-section-product"]').attributes('class')).toContain('lg:col-span-2')
    expect(body().find('[data-testid="order-section-notes"]').attributes('class')).toContain('lg:col-span-2')
    expect(body().findAll('[data-testid="order-number"] input')).toHaveLength(1)
    const submit = body().findAll('button').find((button) => button.text() === '送出')
    expect(submit.attributes('class')).toContain('flex-1 sm:flex-none')
    wrapper.unmount()
  })
})
