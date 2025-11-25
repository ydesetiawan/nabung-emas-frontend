<script setup lang="ts">

import type {ITransactionCreate} from "@/types/transaction";

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t.value.transactions.title} - Gold Savings`),
})

const showAddTransaction = ref(false)
const searchQuery = ref('')
const selectedPocketId = ref<string | null>(null)
const selectedBrand = ref<string | null>(null)
const dateRange = ref<'all' | '7d' | '30d' | '3m' | '1y'>('all')
const sortBy = ref<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'weight-desc' | 'weight-asc'>('date-desc')
const showFilters = ref(false)

const handleTransactionSuccess = (transaction: ITransactionCreate) => {
  console.log('Transaction created:', transaction)
  showAddTransaction.value = false
  // In real app, this would refresh the transaction list
  alert(`Transaction added successfully!\n${transaction.weight}g of ${transaction.brand} gold`)
}

// Filter transactions
const filteredTransactions = computed(() => {
  let result = [...mockTransactions]

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.brand.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      getPocketName(t.pocketId).toLowerCase().includes(query)
    )
  }

  // Filter by pocket
  if (selectedPocketId.value) {
    result = result.filter(t => t.pocketId === selectedPocketId.value)
  }

  // Filter by brand
  if (selectedBrand.value) {
    result = result.filter(t => t.brand === selectedBrand.value)
  }

  // Filter by date range
  if (dateRange.value !== 'all') {
    const now = new Date()
    const ranges: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '3m': 90,
      '1y': 365,
    }
    const days = ranges[dateRange.value]
    if (days !== undefined) {
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      result = result.filter(t => new Date(t.transactionDate) >= cutoff)
    }
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      case 'date-asc':
        return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
      case 'amount-desc':
        return b.totalPrice - a.totalPrice
      case 'amount-asc':
        return a.totalPrice - b.totalPrice
      case 'weight-desc':
        return b.weight - a.weight
      case 'weight-asc':
        return a.weight - b.weight
      default:
        return 0
    }
  })

  return result
})

// Summary stats
const totalStats = computed(() => ({
  count: filteredTransactions.value.length,
  totalWeight: filteredTransactions.value.reduce((sum, t) => sum + t.weight, 0),
  totalValue: filteredTransactions.value.reduce((sum, t) => sum + t.totalPrice, 0),
}))

const getPocketName = (pocketId: string) => {
  return mockPockets.find(p => p.id === pocketId)?.name || 'Unknown'
}

const getBrandColor = (brand: string) => {
  const colors: Record<string, string> = {
    'Antam': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'UBS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Pegadaian': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'King Halim': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return colors[brand] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

const clearFilters = () => {
  selectedPocketId.value = null
  selectedBrand.value = null
  dateRange.value = 'all'
  sortBy.value = 'date-desc'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 safe-top transition-colors">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t.transactions.title }}</h1>
          <button
            @click="showFilters = !showFilters"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <Icon name="heroicons:funnel" class="w-5 h-5" />
            <span>{{ t.transactions.filters }}</span>
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t.transactions.searchPlaceholder"
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t.transactions.dateRange }}</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="option in [
                { value: 'all', label: t.transactions.allTime },
                { value: '7d', label: t.transactions.days7 },
                { value: '30d', label: t.transactions.days30 },
                { value: '3m', label: t.transactions.months3 },
                { value: '1y', label: t.transactions.year1 },
              ]"
              :key="option.value"
              @click="dateRange = option.value as any"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                dateRange === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Pocket Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t.transactions.pocket }}</label>
          <select
            v-model="selectedPocketId"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
          >
            <option :value="null">{{ t.transactions.allPockets }}</option>
            <option v-for="pocket in mockPockets" :key="pocket.id" :value="pocket.id">
              {{ pocket.name }}
            </option>
          </select>
        </div>

        <!-- Brand Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t.transactions.brand }}</label>
          <select
            v-model="selectedBrand"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
          >
            <option :value="null">{{ t.transactions.allBrands }}</option>
            <option v-for="brand in GOLD_BRAND_LIST" :key="brand" :value="brand">
              {{ brand }}
            </option>
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t.transactions.sortBy }}</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
          >
            <option value="date-desc">{{ t.transactions.newestFirst }}</option>
            <option value="date-asc">{{ t.transactions.oldestFirst }}</option>
            <option value="amount-desc">{{ t.transactions.highestAmount }}</option>
            <option value="amount-asc">{{ t.transactions.lowestAmount }}</option>
            <option value="weight-desc">{{ t.transactions.heaviestWeight }}</option>
            <option value="weight-asc">{{ t.transactions.lightestWeight }}</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <button
          @click="clearFilters"
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
        >
          {{ t.transactions.clearFilters }}
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-6 space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 transition-colors">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t.transactions.totalTransactions }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalStats.count }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 transition-colors">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t.dashboard.totalWeight }}</p>
          <p class="text-lg font-bold text-gold-600 dark:text-gold-400 tabular-nums">
            {{ formatWeight(totalStats.totalWeight) }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 transition-colors">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t.pockets.value }}</p>
          <p class="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {{ formatCompactCurrency(totalStats.totalValue) }}
          </p>
        </div>
      </div>

      <!-- Transaction List -->
      <div v-if="filteredTransactions.length > 0" class="space-y-3">
        <NuxtLink
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          :to="`/transactions/${transaction.id}`"
          class="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 hover:shadow-md transition-all active:scale-98"
        >
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span :class="['px-2.5 py-1 rounded-lg text-xs font-semibold', getBrandColor(transaction.brand)]">
                {{ transaction.brand }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatRelativeTime(transaction.transactionDate) }}
              </span>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
          </div>

          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ getPocketName(transaction.pocketId) }}</p>
              <p v-if="transaction.description" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ transaction.description }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ formatDate(transaction.transactionDate) }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                {{ formatWeight(transaction.weight) }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 tabular-nums">
                {{ formatCompactCurrency(transaction.pricePerGram) }}/g
              </p>
              <p class="text-sm font-medium text-gold-600 dark:text-gold-400 tabular-nums mt-1">
                {{ formatCompactCurrency(transaction.totalPrice) }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:arrow-path" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t.transactions.noTransactionsFound }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t.transactions.noTransactionsFound }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t.transactions.tryDifferentFilters }}</p>
      </div>
    </div>

    <!-- FAB -->
    <button
      @click="showAddTransaction = true"
      class="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      aria-label="Add transaction"
    >
      <Icon name="heroicons:plus" class="w-6 h-6" />
    </button>

    <!-- Add Transaction Sheet -->
    <PageTransactionAddTransactionSheet
      :open="showAddTransaction"
      @update:open="showAddTransaction = $event"
      @success="handleTransactionSuccess"
    />
  </div>
</template>
