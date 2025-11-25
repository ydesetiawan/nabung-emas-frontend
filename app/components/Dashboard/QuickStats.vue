<script setup lang="ts">
import { mockPockets, mockTransactions } from '~/utils/mockData'

const { t } = useI18n()
const { currentGoldPrice } = useGoldCalculator()

const stats = computed(() => [
  {
    icon: 'heroicons:wallet',
    label: t.value.dashboard.pockets,
    value: mockPockets.length.toString(),
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: 'heroicons:arrow-path',
    label: t.value.dashboard.transactions,
    value: mockTransactions.length.toString(),
    color: 'bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400',
  },
  {
    icon: 'heroicons:chart-bar',
    label: t.value.dashboard.marketPrice,
    value: formatCurrency(currentGoldPrice).replace('Rp', '').trim(),
    suffix: '/g',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
])
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm dark:shadow-gray-900/10"
    >
      <div :class="['w-9 h-9 rounded-lg flex items-center justify-center mb-2', stat.color]">
        <Icon :name="stat.icon" class="w-5 h-5" />
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{{ stat.label }}</p>
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums truncate">
        {{ stat.value }}
        <span v-if="stat.suffix" class="text-xs font-normal text-gray-600 dark:text-gray-400">{{ stat.suffix }}</span>
      </p>
    </div>
  </div>
</template>
