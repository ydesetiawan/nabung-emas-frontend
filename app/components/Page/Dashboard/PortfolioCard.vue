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
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-600 dark:to-purple-700 text-white p-6 rounded-3xl shadow-premium animate-slide-up">
    <!-- Animated decorative elements -->
    <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
    <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-soft" style="animation-delay: 1s;" />
    <div class="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full animate-bounce-soft" />

    <!-- Glassmorphic overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-white/90 font-semibold">{{ t.dashboard.totalPortfolio }}</p>
        <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Icon name="heroicons:chart-pie" class="w-5 h-5" />
        </div>
      </div>
      
      <h2 class="text-4xl font-bold tracking-tight mb-4 tabular-nums drop-shadow-lg">
        {{ formatCurrency(totalStats.currentValue) }}
      </h2>

      <!-- Profit/Loss Badge with enhanced styling -->
      <div
        :class="[
          'inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-sm',
          isProfit 
            ? 'bg-emerald-500/30 dark:bg-emerald-500/40 text-emerald-50 shadow-inner-glow' 
            : 'bg-red-500/30 dark:bg-red-500/40 text-red-50 shadow-inner-glow'
        ]"
      >
        <Icon
          :name="isProfit ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
          class="w-5 h-5"
        />
        <span class="tabular-nums">
          {{ isProfit ? '+' : '' }}{{ totalStats.profitLossPercentage.toFixed(2) }}%
        </span>
        <span class="text-white/80 tabular-nums text-xs">
          ({{ isProfit ? '+' : '' }}{{ formatCurrency(totalStats.profitLoss) }})
        </span>
      </div>

      <!-- Stats Grid with glassmorphic cards -->
      <div class="grid grid-cols-2 gap-3 mt-6">
        <div class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
          <p class="text-xs text-white/80 mb-1.5 font-medium">{{ t.dashboard.totalWeight }}</p>
          <p class="text-xl font-bold tabular-nums">{{ formatWeight(totalStats.totalWeight) }}</p>
        </div>
        <div class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
          <p class="text-xs text-white/80 mb-1.5 font-medium">{{ t.dashboard.avgPrice }}</p>
          <p class="text-xl font-bold tabular-nums">{{ formatCurrency(totalStats.averagePricePerGram) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
