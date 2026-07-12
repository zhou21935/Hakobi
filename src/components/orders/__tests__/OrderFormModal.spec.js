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
    props: { modelValue: true, order },
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
