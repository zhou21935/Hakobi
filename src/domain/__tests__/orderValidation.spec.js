import { describe, it, expect } from 'vitest'
import { normalizeOrderInput, validateOrder } from '@/domain/orderValidation'

describe('normalizeOrderInput', () => {
  it('trims surrounding whitespace from name and converts amount to a number', () => {
    const input = { name: '  Widget  ', amount: '10' }
    const result = normalizeOrderInput(input)
    expect(result).toEqual({ name: 'Widget', amount: 10 })
  })

  it('does not mutate the original input object', () => {
    const input = { name: '  Widget  ', amount: '10' }
    normalizeOrderInput(input)
    expect(input).toEqual({ name: '  Widget  ', amount: '10' })
  })

  it('passes through other fields unchanged', () => {
    const input = { name: 'Widget', amount: 10, category: 'agent', isPaid: true }
    const result = normalizeOrderInput(input)
    expect(result).toEqual({ name: 'Widget', amount: 10, category: 'agent', isPaid: true })
  })
})

describe('validateOrder', () => {
  it('is valid with all three errors null when name, amount, and productCategories are all valid', () => {
    const { isValid, errors } = validateOrder({ name: 'Widget', amount: 10, productCategories: ['merch'] })
    expect(isValid).toBe(true)
    expect(errors).toEqual({ name: null, amount: null, productCategories: null })
  })

  it('sets errors.name when name is an empty string', () => {
    const { isValid, errors } = validateOrder({ name: '', amount: 10, productCategories: ['merch'] })
    expect(isValid).toBe(false)
    expect(errors.name).toBe('商品名稱不可為空')
    expect(errors.amount).toBeNull()
    expect(errors.productCategories).toBeNull()
  })

  it('sets errors.amount when amount is zero', () => {
    const { isValid, errors } = validateOrder({ name: 'Widget', amount: 0, productCategories: ['merch'] })
    expect(isValid).toBe(false)
    expect(errors.amount).toBe('金額須為大於 0 的數字')
    expect(errors.name).toBeNull()
    expect(errors.productCategories).toBeNull()
  })

  it('sets errors.amount when amount is negative', () => {
    const { isValid, errors } = validateOrder({ name: 'Widget', amount: -5, productCategories: ['merch'] })
    expect(isValid).toBe(false)
    expect(errors.amount).toBe('金額須為大於 0 的數字')
  })

  it('sets errors.productCategories when productCategories is an empty array', () => {
    const { isValid, errors } = validateOrder({ name: 'Widget', amount: 10, productCategories: [] })
    expect(isValid).toBe(false)
    expect(errors.productCategories).toBe('請至少選擇一項商品分類')
    expect(errors.name).toBeNull()
    expect(errors.amount).toBeNull()
  })
})
