<template>
  <div class="p-8 space-y-10">
    <div class="max-w-6xl">
      <h1 class="text-4xl font-heading font-bold text-ink mb-4">UI 元件展示</h1>
      <p class="text-lg text-ink-muted">基礎元件預覽,之後可依此調整風格</p>
    </div>

    <section class="max-w-6xl">
      <h2 class="text-xl font-heading font-semibold text-ink mb-3">Button</h2>
      <Card>
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>
    </section>

    <section class="max-w-6xl">
      <h2 class="text-xl font-heading font-semibold text-ink mb-3">Card</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <template #header>
            <h3 class="font-heading font-semibold text-ink">卡片標題</h3>
          </template>

          <p class="text-ink-muted">這是 Card 元件的內容區域,可以放任意內容。</p>

          <template #footer>
            <Button variant="secondary" size="sm">取消</Button>
            <Button size="sm">確認</Button>
          </template>
        </Card>

        <div
          class="rounded-card border border-card-border-accent shadow-card bg-gradient-to-br from-accentcard-from to-accentcard-to p-5"
        >
          <h3 class="font-heading font-semibold text-ink mb-2">範例:強調卡(待付款)</h3>
          <p class="text-ink-muted">用於凸顯需要留意的項目,例如待付款訂單。</p>
        </div>
      </div>
    </section>

    <section class="max-w-6xl">
      <h2 class="text-xl font-heading font-semibold text-ink mb-3">Input</h2>
      <Card>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input v-model="normalInput" label="訂單名稱" placeholder="請輸入訂單名稱" />
          <Input v-model="errorInput" label="金額" error="金額不可為空" />
        </div>
      </Card>
    </section>

    <section class="max-w-6xl">
      <h2 class="text-xl font-heading font-semibold text-ink mb-3">Select</h2>
      <Card>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select v-model="selectedCurrency" label="幣別" :options="currencyOptions" />
          <Select v-model="selectedCurrency" label="幣別(disabled)" :options="currencyOptions" disabled />
        </div>
      </Card>
    </section>

    <section class="max-w-6xl">
      <h2 class="text-xl font-heading font-semibold text-ink mb-3">Table</h2>
      <Table :columns="tableColumns" :rows="tableRows">
        <template #cell-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>
      </Table>
    </section>

    <section class="max-w-6xl">
      <h2 class="text-xl font-heading font-semibold text-ink mb-3">Modal</h2>
      <Card>
        <Button @click="isModalOpen = true">開啟 Modal</Button>
      </Card>

      <Modal v-model="isModalOpen" title="範例 Modal">
        <p class="text-ink-muted">這是 Modal 元件的內容區域。</p>

        <template #footer>
          <Button variant="secondary" size="sm" @click="isModalOpen = false">取消</Button>
          <Button size="sm" @click="isModalOpen = false">確認</Button>
        </template>
      </Modal>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Table from '@/components/ui/Table.vue'
import Modal from '@/components/ui/Modal.vue'
import Select from '@/components/ui/Select.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const normalInput = ref('')
const errorInput = ref('')
const isModalOpen = ref(false)
const selectedCurrency = ref('TWD')

const currencyOptions = [
  { value: 'TWD', label: 'TWD' },
  { value: 'USD', label: 'USD' },
  { value: 'KRW', label: 'KRW' },
  { value: 'JPY', label: 'JPY' }
]

const tableColumns = [
  { key: 'name', label: '訂單' },
  { key: 'platform', label: '平台' },
  { key: 'amount', label: '金額' },
  { key: 'status', label: '狀態' }
]

const tableRows = [
  { id: 1, name: '航海王 第 108 集', platform: 'Amazon', amount: 320, status: 'PENDING_PAYMENT' },
  { id: 2, name: '鬼滅之刃周邊', platform: '樂天', amount: 1580, status: 'CONSOLIDATING' },
  { id: 3, name: '代購包裹 #A392', platform: 'Mercari', amount: 4200, status: 'COMPLETED' }
]
</script>
