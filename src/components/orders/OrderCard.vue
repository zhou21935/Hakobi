<template>
  <Card>
    <div data-testid="order-card-tags" class="flex flex-wrap items-center gap-2">
      <StatusBadge :status="order.status" />
      <span
        v-if="order.isPreorder"
        class="rounded-full bg-badge-category-bg px-3 py-1.5 text-sm font-medium text-ink"
      >
        預購
      </span>
      <span
        v-for="tag in productCategoryTags"
        :key="tag.value"
        class="rounded-full bg-badge-category-bg px-3 py-1.5 text-sm font-medium text-ink"
      >
        {{ tag.label }}
      </span>
    </div>

    <div
      data-testid="order-card-body"
      class="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-4 sm:block"
    >
      <div
        data-testid="order-card-primary"
        class="contents sm:flex sm:min-w-0 sm:flex-row sm:items-center sm:justify-between"
      >
        <h3 class="col-start-1 row-start-1 min-w-0 font-heading text-lg font-semibold text-ink sm:truncate">
          {{ order.name }}
        </h3>

        <div class="contents sm:flex sm:w-auto sm:shrink-0 sm:items-center sm:justify-end sm:gap-3">
          <p class="col-start-2 row-start-1 whitespace-nowrap text-right font-heading text-lg font-bold text-ink">
            {{ currencySymbol }}{{ order.amount }}
          </p>
          <div
            data-testid="order-card-actions"
            class="col-start-2 row-start-2 flex shrink-0 items-center justify-end gap-2 sm:row-auto"
          >
          <button
            type="button"
            aria-label="查看詳情"
            class="flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-card-border bg-white px-4 font-medium text-ink transition hover:bg-badge-category-bg"
            @click="$emit('details', order)"
          >
            訂單詳情
          </button>
          <button
            type="button"
            aria-label="編輯"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-badge-category-bg text-ink transition hover:brightness-95"
            @click="$emit('edit', order)"
          >
            <svg data-icon="pen-to-square" aria-hidden="true" class="h-4 w-4 fill-current" viewBox="0 0 640 640">
              <path d="M505 122.9L517.1 135C526.5 144.4 526.5 159.6 517.1 168.9L488 198.1L441.9 152L471 122.9C480.4 113.5 495.6 113.5 504.9 122.9zM273.8 320.2L408 185.9L454.1 232L319.8 366.2C316.9 369.1 313.3 371.2 309.4 372.3L250.9 389L267.6 330.5C268.7 326.6 270.8 323 273.7 320.1zM437.1 89L239.8 286.2C231.1 294.9 224.8 305.6 221.5 317.3L192.9 417.3C190.5 425.7 192.8 434.7 199 440.9C205.2 447.1 214.2 449.4 222.6 447L322.6 418.4C334.4 415 345.1 408.7 353.7 400.1L551 202.9C579.1 174.8 579.1 129.2 551 101.1L538.9 89C510.8 60.9 465.2 60.9 437.1 89zM152 128C103.4 128 64 167.4 64 216L64 488C64 536.6 103.4 576 152 576L424 576C472.6 576 512 536.6 512 488L512 376C512 362.7 501.3 352 488 352C474.7 352 464 362.7 464 376L464 488C464 510.1 446.1 528 424 528L152 528C129.9 528 112 510.1 112 488L112 216C112 193.9 129.9 176 152 176L264 176C277.3 176 288 165.3 288 152C288 138.7 277.3 128 264 128L152 128z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="刪除"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
            @click="$emit('request-delete', order.id)"
          >
            <svg data-icon="trash-can" aria-hidden="true" class="h-4 w-4 fill-current" viewBox="0 0 640 640">
              <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z" />
            </svg>
          </button>
          </div>
        </div>
      </div>

      <p
        v-if="order.estimatedShipDate"
        data-testid="order-card-shipping"
        class="col-start-1 row-start-2 min-w-0 text-sm font-medium text-ink-muted sm:mt-5"
      >
        預計出貨日 {{ formattedEstimatedShipDate }}
      </p>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from '@/stores/orders'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

defineEmits(['details', 'edit', 'request-delete'])

const CURRENCY_SYMBOLS = {
  TWD: 'NT$',
  USD: '$',
  KRW: '₩',
  JPY: '¥'
}

const currencySymbol = computed(() => CURRENCY_SYMBOLS[props.order.currency] || '')

const formattedEstimatedShipDate = computed(() => {
  const value = props.order.estimatedShipDate
  if (!value) return ''
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/)
  return match ? match[0] : String(value)
})

const productCategoryTags = computed(() =>
  Object.values(PRODUCT_CATEGORIES)
    .filter((value) => (props.order.productCategories || []).includes(value))
    .map((value) => ({ value, label: PRODUCT_CATEGORY_LABELS[value] }))
)
</script>
