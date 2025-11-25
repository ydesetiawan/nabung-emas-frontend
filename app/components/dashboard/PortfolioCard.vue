<script setup lang="ts">
import { calculatePortfolioStats, formatCurrency, formatWeight } from '~/utils/gold'
import { cn } from '~/utils/cn'

const { t } = useI18n()
const stats = computed(() => calculatePortfolioStats())
const isProfit = computed(() => stats.value.profitLoss > 0)
const isLoss = computed(() => stats.value.profitLoss < 0)
</script>

<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-5 rounded-xl">
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

    <div class="relative z-10">
      <p class="text-sm text-primary-foreground/70 font-medium">{{ t.dashboard.totalPortfolioValue }}</p>
      <h2 class="text-3xl font-bold mt-1 tracking-tight">{{ formatCurrency(stats.currentValue) }}</h2>

      <div
        :class="cn(
          'inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-semibold',
          isProfit && 'bg-success/20 text-success-foreground',
          isLoss && 'bg-destructive/20 text-destructive-foreground',
          !isProfit && !isLoss && 'bg-white/20',
        )"
      >
        <Icon v-if="isProfit" name="lucide:trending-up" class="h-3 w-3" />
        <Icon v-if="isLoss" name="lucide:trending-down" class="h-3 w-3" />
        <Icon v-if="!isProfit && !isLoss" name="lucide:minus" class="h-3 w-3" />
        <span>
          {{ isProfit ? "+" : "" }}
          {{ stats.profitLossPercent.toFixed(2) }}%
        </span>
        <span class="text-primary-foreground/70">
          ({{ isProfit ? "+" : "" }}
          {{ formatCurrency(stats.profitLoss) }})
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/20">
        <div>
          <p class="text-xs text-primary-foreground/70">{{ t.dashboard.totalWeight }}</p>
          <p class="text-lg font-semibold">{{ formatWeight(stats.totalWeight) }}</p>
        </div>
        <div>
          <p class="text-xs text-primary-foreground/70">{{ t.dashboard.avgPricePerGram }}</p>
          <p class="text-lg font-semibold">{{ formatCurrency(stats.avgPricePerGram) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
