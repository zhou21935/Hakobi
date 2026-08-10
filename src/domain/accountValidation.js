const USERNAME_PATTERN = /^[\p{Script=Han}A-Za-z0-9_]+$/u
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WEAK_PASSWORDS = new Set(['password', 'password123', '12345678', 'qwerty123', 'admin123'])

export const normalizeUsername = (value = '') => String(value).trim().toLowerCase()

export const validateUsername = (value) => {
  const username = String(value ?? '').trim()
  const length = Array.from(username).length
  let error = null
  if (length < 3 || length > 20) error = '使用名稱須為 3–20 個字元'
  else if (!USERNAME_PATTERN.test(username)) error = '使用名稱只能包含中文、英文字母、數字及底線'
  return { isValid: !error, error, value: username, normalized: normalizeUsername(username) }
}

export const validateEmail = (value) => {
  const email = String(value ?? '').trim()
  const error = EMAIL_PATTERN.test(email) ? null : '請輸入有效的電子郵件'
  return { isValid: !error, error, value: email }
}

export const validatePassword = (value, username = '') => {
  const password = String(value ?? '')
  let error = null
  if (password.length < 8 || password.length > 64) error = '密碼須為 8–64 個字元'
  else if (/\s/u.test(password)) error = '密碼不可包含空白'
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) error = '密碼須至少包含一個英文字母與一個數字'
  else if (normalizeUsername(password) === normalizeUsername(username)) error = '密碼不可與使用名稱相同'
  else if (WEAK_PASSWORDS.has(password.toLowerCase())) error = '此密碼過於常見，請更換其他密碼'
  return { isValid: !error, error }
}

export const validatePasswordConfirmation = (password, confirmation) => {
  const error = password === confirmation ? null : '兩次輸入的密碼不一致'
  return { isValid: !error, error }
}

export const validateRegistration = ({ email, username, password, confirmPassword }) => {
  const emailResult = validateEmail(email)
  const usernameResult = validateUsername(username)
  const passwordResult = validatePassword(password, usernameResult.value)
  const confirmationResult = validatePasswordConfirmation(password, confirmPassword)
  const errors = {
    email: emailResult.error,
    username: usernameResult.error,
    password: passwordResult.error,
    confirmPassword: confirmationResult.error
  }
  return {
    isValid: Object.values(errors).every(error => !error),
    errors,
    values: { email: emailResult.value, username: usernameResult.value, password }
  }
}
