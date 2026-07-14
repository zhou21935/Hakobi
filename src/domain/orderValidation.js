export const normalizeOrderInput = (data) => {
  return {
    ...data,
    name: typeof data.name === 'string' ? data.name.trim() : data.name,
    amount: Number(data.amount)
  }
}

export const validateOrder = (data) => {
  const errors = {
    name: typeof data.name !== 'string' || data.name.trim() === '' ? '商品名稱不可為空' : null,
    amount: Number.isFinite(data.amount) && data.amount > 0 ? null : '金額須為大於 0 的數字',
    productCategories: Array.isArray(data.productCategories) && data.productCategories.length > 0 ? null : '請至少選擇一項商品分類'
  }

  const isValid = errors.name === null && errors.amount === null && errors.productCategories === null

  return { isValid, errors }
}
