import { describe, expect, it } from 'vitest'
import { normalizeUsername, validateDisplayName, validatePassword, validateRegistration, validateUsername } from '@/domain/accountValidation'

describe('account validation', () => {
  it.each([
    ['Hakobi_01', true, 'hakobi_01'],
    ['箱子君', true, '箱子君'],
    ['ab', false, 'ab'],
    ['a'.repeat(21), false, 'a'.repeat(21)],
    ['hako bi', false, 'hako bi'],
    ['hako-bi', false, 'hako-bi']
  ])('validates username %s', (input, valid, normalized) => {
    expect(normalizeUsername(input)).toBe(normalized)
    expect(validateUsername(input).isValid).toBe(valid)
  })

  it.each([
    ['王小明', true],
    ['Hakobi01', true],
    ['王小明88', true],
    ['王', false],
    ['a'.repeat(31), false],
    ['王 小明', false],
    ['Hakobi_01', false],
    ['王小明🙂', false],
    ['', false]
  ])('validates display name %s', (input, valid) => {
    expect(validateDisplayName(input).isValid).toBe(valid)
  })

  it.each([
    ['hako2026', 'mika', true],
    ['Hakobi@2026', 'mika', true],
    ['abc1234', 'mika', false],
    [`a1${'x'.repeat(63)}`, 'mika', false],
    ['hakobihakobi', 'mika', false],
    ['123456789', 'mika', false],
    ['hako bi2026', 'mika', false],
    ['MIKA2026', 'mika2026', false],
    ['Password123', 'mika', false]
  ])('validates password policy for %s', (password, username, valid) => {
    expect(validatePassword(password, username).isValid).toBe(valid)
  })

  it('requires exact confirmation and valid email', () => {
    const result = validateRegistration({ email: 'bad', username: 'Hakobi_01', password: 'hako2026', confirmPassword: 'different' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeTruthy()
    expect(result.errors.confirmPassword).toBeTruthy()
  })
})
