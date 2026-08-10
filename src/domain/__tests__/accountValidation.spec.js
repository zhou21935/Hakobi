import { describe, expect, it } from 'vitest'
import { normalizeUsername, validatePassword, validateRegistration, validateUsername } from '@/domain/accountValidation'

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
