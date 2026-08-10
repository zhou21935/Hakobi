export const normalizeOrderInput = (data) => {
  return {
    ...data,
    name: typeof data.name === 'string' ? data.name.trim() : data.name,
    amount: Number(data.amount)
  }
}

const isSafeProductUrl = (value) => {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return false
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export const validateOrder = (data) => {
  const supportedCategories = ['agent', 'parcel']
  const errors = {
    category: supportedCategories.includes(data.category) ? null : '請選擇訂單分類',
    name: typeof data.name !== 'string' || data.name.trim() === '' ? '商品名稱不可為空' : null,
    amount: Number.isFinite(data.amount) && data.amount > 0 ? null : '金額須為大於 0 的數字',
    productCategories: Array.isArray(data.productCategories) && data.productCategories.length > 0 ? null : '請至少選擇一項商品分類',
    productUrl: isSafeProductUrl(data.productUrl) ? null : '商品連結須為有效的 HTTP 或 HTTPS 網址'
  }

  const isValid = Object.values(errors).every((error) => error === null)

  return { isValid, errors }
}
