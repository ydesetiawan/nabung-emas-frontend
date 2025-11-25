<script setup lang="ts">
import { mockPockets, mockTransactions } from '../../utils/mockData'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t.value.analytics.title} - Gold Savings`),
})

// Calculate portfolio metrics
const portfolioMetrics = computed(() => {
  const totalValue = mockPockets.reduce((sum, p) => sum + p.aggregateTotalPrice, 0)
  const totalWeight = mockPockets.reduce((sum, p) => sum + p.aggregateTotalWeight, 0)
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
  
  mockTransactions.forEach(transaction => {
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
  return mockPockets.map(pocket => ({
    ...pocket,
    percentage: (pocket.aggregateTotalPrice / portfolioMetrics.value.totalValue) * 100,
  })).sort((a, b) => b.aggregateTotalPrice - a.aggregateTotalPrice)
})

// Mock market price (in real app, this would come from an API)
const marketPrice = 1055000

const priceDifference = computed(() => {
  return portfolioMetrics.value.avgPrice - marketPrice
})

const pricePercentageDiff = computed(() => {
  return ((priceDifference.value / marketPrice) * 100)
})

const getColorClass = (index: number) => {
  const colors = [
    'bg-blue-500',
    'bg-gold-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-purple-500',
  ]
  return colors[index % colors.length]
}

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm safe-top transition-colors border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between px-4 h-16">
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t.analytics.title }}</h1>
        <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-6 space-y-6 pb-24">
      <!-- Portfolio Value Card -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-lg">
        <p class="text-sm opacity-90 mb-1">{{ t.analytics.portfolioValue }}</p>
        <h2 class="text-3xl font-bold mb-4 tabular-nums">{{ formatCurrency(portfolioMetrics.totalValue) }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs opacity-75 mb-1">{{ t.dashboard.totalWeight }}</p>
            <p class="text-lg font-semibold tabular-nums">{{ formatWeight(portfolioMetrics.totalWeight) }}</p>
          </div>
          <div>
            <p class="text-xs opacity-75 mb-1">{{ t.dashboard.avgPrice }}</p>
            <p class="text-lg font-semibold tabular-nums">{{ formatCurrency(portfolioMetrics.avgPrice) }}</p>
          </div>
        </div>
      </div>

      <!-- Price Comparison -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm dark:shadow-gray-900/10">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t.analytics.priceComparison }}</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t.analytics.yourAvgPrice }}</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(portfolioMetrics.avgPrice) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t.analytics.marketPrice }}</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(marketPrice) }}</span>
          </div>
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t.analytics.priceDifference }}</span>
              <div class="text-right">
                <p :class="['text-sm font-bold tabular-nums', priceDifference >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
                  {{ priceDifference >= 0 ? '+' : '' }}{{ formatCurrency(priceDifference) }}
                </p>
                <p :class="['text-xs tabular-nums', priceDifference >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
                  {{ pricePercentageDiff >= 0 ? '+' : '' }}{{ pricePercentageDiff.toFixed(2) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Purchases -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm dark:shadow-gray-900/10">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t.analytics.monthlyPurchases }}</h3>
        <div class="space-y-3 mb-4">
          <div v-for="month in monthlyPurchases" :key="month.month" class="space-y-1">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ formatMonth(month.month) }}</span>
              <span class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(month.amount) }}</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all"
                :style="{ width: `${(month.amount / Math.max(...monthlyPurchases.map(m => m.amount))) * 100}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ formatWeight(month.weight) }}</span>
              <span>{{ month.count }} {{ month.count === 1 ? 'transaction' : 'transactions' }}</span>
            </div>
          </div>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t.analytics.avgMonthly }}</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(avgMonthlyPurchase) }}</span>
          </div>
        </div>
      </div>

      <!-- Portfolio Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm dark:shadow-gray-900/10">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t.analytics.portfolioDistribution }}</h3>
        <div class="space-y-3">
          <div v-for="(pocket, index) in portfolioDistribution" :key="pocket.id" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-gray-900 dark:text-gray-100 truncate flex-1">{{ pocket.name }}</span>
              <span class="text-gray-600 dark:text-gray-400 ml-2 tabular-nums">{{ pocket.percentage.toFixed(1) }}%</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                :class="['h-full rounded-full transition-all', getColorClass(index)]"
                :style="{ width: `${pocket.percentage}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ formatWeight(pocket.aggregateTotalWeight) }}</span>
              <span class="tabular-nums">{{ formatCurrency(pocket.aggregateTotalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Data -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
            <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t.analytics.exportData }}</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">{{ t.analytics.exportDescription }}</p>
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
