<script setup lang="ts">
import type { IPortfolioSummary } from '~/types/analytics'

const props = defineProps<{
  portfolio?: IPortfolioSummary
  isLoading?: boolean
}>()

const { t } = useI18n()

const stats = computed(() => [
  {
    icon: 'heroicons:wallet',
    label: t.value.dashboard.pockets,
    value: (props.portfolio?.totalPockets || 0).toString(),
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: 'heroicons:arrow-path',
    label: t.value.dashboard.transactions,
    value: (props.portfolio?.totalTransactions || 0).toString(),
    color: 'from-gold-500 to-amber-600',
    bgColor: 'bg-gold-50 dark:bg-gold-500/10',
    textColor: 'text-gold-600 dark:text-gold-400',
  },
  {
    icon: 'heroicons:chart-bar',
    label: t.value.dashboard.marketPrice,
    value: formatCurrency(props.portfolio?.currentGoldPrice || 0).replace('Rp', '').trim(),
    suffix: '/g',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
])
</script>

<template>
  <div class="grid grid-cols-3 gap-3 animate-slide-up">
    <div
      v-for="(stat, index) in stats"
      :key="stat.label"
      class="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-glass dark:shadow-glass-dark hover:shadow-premium transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-100/50 dark:border-gray-700/50"
      :style="{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }"
    >
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110', stat.bgColor]">
        <Icon :name="stat.icon" :class="['w-5 h-5', stat.textColor]" />
      </div>
      <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">{{ stat.label }}</p>
      
      <div v-if="isLoading" class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <p v-else :class="['text-base font-bold tabular-nums truncate', stat.textColor]">
        {{ stat.value }}
        <span v-if="stat.suffix" class="text-xs font-medium opacity-70">{{ stat.suffix }}</span>
      </p>
    </div>
  </div>
</template>
