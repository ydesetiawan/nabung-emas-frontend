<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const { currentGoldPrice } = useGoldCalculator()

// Use composables directly
const pocketApi = usePocketApi()
const transactionApi = useTransactionApi()

useHead({
  title: computed(() => `${t.value.analytics.title} - Gold Savings`),
})

const pockets = ref<any[]>([])
const transactions = ref<any[]>([])

// Fetch data on mount
onMounted(async () => {
  try {
    const [pocketsData, transactionsData] = await Promise.all([
      pocketApi.fetchPockets(),
      transactionApi.fetchTransactions()
    ])
    pockets.value = pocketsData
    transactions.value = transactionsData
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})

// Calculate portfolio metrics
const portfolioMetrics = computed(() => {
  const totalValue = pockets.value.reduce((sum, p) => sum + p.aggregateTotalPrice, 0)
  const totalWeight = pockets.value.reduce((sum, p) => sum + p.aggregateTotalWeight, 0)
  const avgPrice = totalWeight > 0 ? totalValue / totalWeight : 0
  
  return {
    totalValue,
    totalWeight,
    avgPrice,
  }
})

// Calculate monthly purchases
const monthlyPurchases = computed(() => {
  const monthlyData: Record<string, { weight: number; amount: number; count: number }> = {}
  
  transactions.value.forEach(transaction => {
    const date = new Date(transaction.transactionDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { weight: 0, amount: 0, count: 0 }
    }
    
    monthlyData[monthKey].weight += transaction.weight
    monthlyData[monthKey].amount += transaction.totalPrice
    monthlyData[monthKey].count += 1
  })
  
  return Object.entries(monthlyData)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 6)
    .reverse()
})

// Calculate average monthly purchase
const avgMonthlyPurchase = computed(() => {
  if (monthlyPurchases.value.length === 0) return 0
  const total = monthlyPurchases.value.reduce((sum, m) => sum + m.amount, 0)
  return total / monthlyPurchases.value.length
})

// Portfolio distribution by pocket
const portfolioDistribution = computed(() => {
  return pockets.value.map(pocket => ({
    ...pocket,
    percentage: (pocket.aggregateTotalPrice / portfolioMetrics.value.totalValue) * 100,
  })).sort((a, b) => b.aggregateTotalPrice - a.aggregateTotalPrice)
})

const priceDifference = computed(() => {
  return portfolioMetrics.value.avgPrice - currentGoldPrice.value
})

const pricePercentageDiff = computed(() => {
  return ((priceDifference.value / currentGoldPrice.value) * 100)
})

const getColorClass = (index: number) => {
  const colors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-gold-500 to-amber-600',
    'bg-gradient-to-r from-pink-500 to-rose-600',
    'bg-gradient-to-r from-emerald-500 to-green-600',
    'bg-gradient-to-r from-purple-500 to-pink-600',
  ]
  return colors[index % colors.length]
}

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year || '0'), parseInt(month || '1') - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <!-- Header with gradient -->
    <header class="sticky top-0 z-40 safe-top">
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"></div>
      <div class="relative flex items-center justify-between px-5 h-16">
        <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t.analytics.title }}
        </h1>
        <button class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95">
          <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="px-5 py-6 space-y-6 pb-24">
      <!-- Portfolio Value Card with Premium Gradient -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-6 text-white shadow-premium animate-slide-up">
        <!-- Animated decorative elements -->
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-soft" style="animation-delay: 1s;" />
        
        <div class="relative z-10">
          <p class="text-sm opacity-90 mb-2 font-semibold">{{ t.analytics.portfolioValue }}</p>
          <h2 class="text-4xl font-bold mb-5 tabular-nums drop-shadow-lg">{{ formatCurrency(portfolioMetrics.totalValue) }}</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
              <p class="text-xs opacity-80 mb-1.5 font-medium">{{ t.dashboard.totalWeight }}</p>
              <p class="text-xl font-bold tabular-nums">{{ formatWeight(portfolioMetrics.totalWeight) }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
              <p class="text-xs opacity-80 mb-1.5 font-medium">{{ t.dashboard.avgPrice }}</p>
              <p class="text-xl font-bold tabular-nums">{{ formatCurrency(portfolioMetrics.avgPrice) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Comparison -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <h3 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:scale" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          {{ t.analytics.priceComparison }}
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.analytics.yourAvgPrice }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(portfolioMetrics.avgPrice) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.analytics.marketPrice }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(currentGoldPrice) }}</span>
          </div>
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ t.analytics.priceDifference }}</span>
              <div class="text-right">
                <p :class="['text-base font-bold tabular-nums', priceDifference >= 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400']">
                  {{ priceDifference >= 0 ? '+' : '' }}{{ formatCurrency(priceDifference) }}
                </p>
                <p :class="['text-xs tabular-nums font-semibold', priceDifference >= 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400']">
                  {{ pricePercentageDiff >= 0 ? '+' : '' }}{{ pricePercentageDiff.toFixed(2) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Purchases -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <h3 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div class="w-8 h-8 bg-gold-50 dark:bg-gold-500/10 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:chart-bar" class="w-4 h-4 text-gold-600 dark:text-gold-400" />
          </div>
          {{ t.analytics.monthlyPurchases }}
        </h3>
        <div class="space-y-4 mb-4">
          <div v-for="month in monthlyPurchases" :key="month.month" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400 font-medium">{{ formatMonth(month.month) }}</span>
              <span class="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(month.amount) }}</span>
            </div>
            <div class="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full transition-all duration-500"
                :style="{ width: `${(month.amount / Math.max(...monthlyPurchases.map(m => m.amount))) * 100}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>{{ formatWeight(month.weight) }}</span>
              <span>{{ month.count }} {{ month.count === 1 ? 'transaction' : 'transactions' }}</span>
            </div>
          </div>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.analytics.avgMonthly }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(avgMonthlyPurchase) }}</span>
          </div>
        </div>
      </div>

      <!-- Portfolio Distribution -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
        <h3 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div class="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:chart-pie" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          {{ t.analytics.portfolioDistribution }}
        </h3>
        <div class="space-y-4">
          <div v-for="(pocket, index) in portfolioDistribution" :key="pocket.id" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">{{ pocket.name }}</span>
              <span class="text-gray-600 dark:text-gray-400 ml-2 tabular-nums font-bold">{{ pocket.percentage.toFixed(1) }}%</span>
            </div>
            <div class="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                :class="['h-full rounded-full transition-all duration-500', getColorClass(index)]"
                :style="{ width: `${pocket.percentage}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>{{ formatWeight(pocket.aggregateTotalWeight) }}</span>
              <span class="tabular-nums">{{ formatCurrency(pocket.aggregateTotalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Data -->
      <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/50 dark:border-blue-700/50 animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <Icon name="heroicons:arrow-down-tray" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{{ t.analytics.exportData }}</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">{{ t.analytics.exportDescription }}</p>
            <button class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg">
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
