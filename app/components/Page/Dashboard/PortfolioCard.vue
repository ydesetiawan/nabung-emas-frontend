<script setup lang="ts">
import { mockPockets } from "@/utils/mockData"

const { t } = useI18n()
const { calculatePocketStats } = useGoldCalculator()

// Calculate total portfolio stats
const totalStats = computed(() => {
  const totalPrice = mockPockets.reduce((sum, p) => sum + p.aggregateTotalPrice, 0)
  const totalWeight = mockPockets.reduce((sum, p) => sum + p.aggregateTotalWeight, 0)
  return calculatePocketStats(totalPrice, totalWeight)
})

const isProfit = computed(() => totalStats.value.profitLoss >= 0)
</script>

<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 dark:from-blue-700 dark:via-blue-600 dark:to-blue-800 text-white p-6 rounded-2xl shadow-lg">
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

    <div class="relative z-10">
      <p class="text-sm text-white/80 font-medium mb-1">{{ t.dashboard.totalPortfolio }}</p>
      <h2 class="text-3xl font-bold tracking-tight mb-3 tabular-nums">
        {{ formatCurrency(totalStats.currentValue) }}
      </h2>

      <!-- Profit/Loss Badge -->
      <div
        :class="[
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
          isProfit ? 'bg-green-500/20 dark:bg-green-500/30 text-green-100' : 'bg-red-500/20 dark:bg-red-500/30 text-red-100'
        ]"
      >
        <Icon
          :name="isProfit ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
          class="w-4 h-4"
        />
        <span class="tabular-nums">
          {{ isProfit ? '+' : '' }}{{ totalStats.profitLossPercentage.toFixed(2) }}%
        </span>
        <span class="text-white/70 tabular-nums">
          ({{ isProfit ? '+' : '' }}{{ formatCurrency(totalStats.profitLoss) }})
        </span>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/20 dark:border-white/10">
        <div>
          <p class="text-xs text-white/70 mb-1">{{ t.dashboard.totalWeight }}</p>
          <p class="text-lg font-semibold tabular-nums">{{ formatWeight(totalStats.totalWeight) }}</p>
        </div>
        <div>
          <p class="text-xs text-white/70 mb-1">{{ t.dashboard.avgPrice }}</p>
          <p class="text-lg font-semibold tabular-nums">{{ formatCurrency(totalStats.averagePricePerGram) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
