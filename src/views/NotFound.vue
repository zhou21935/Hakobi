<template>
  <div class="p-4 md:p-8">
    <div class="mx-auto max-w-xl rounded-card border border-card-border bg-white p-8 text-center shadow-card">
      <p class="text-sm font-semibold text-primary-from">404</p>
      <h1 class="mt-2 text-3xl font-heading font-bold text-ink">找不到頁面</h1>
      <p class="mt-3 text-ink-muted">這個頁面不存在，或訂單分類不受支援。</p>
      <RouterLink to="/orders" class="mt-6 inline-flex rounded-full bg-gradient-to-br from-primary-from to-primary-to px-5 py-2 font-semibold text-white shadow-emphasis">
        返回全部訂單
      </RouterLink>
    </div>
  </div>
</template>
