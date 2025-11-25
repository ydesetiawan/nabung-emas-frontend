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

const getTypePocket = (id: string) => {
  return mockTypePockets.find(t => t.id === id)
}

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    gold: 'bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return colors[color] || colors.blue
}

const clearFilters = () => {
  selectedPocketId.value = null
  selectedBrand.value = null
  dateRange.value = 'all'
  sortBy.value = 'date-desc'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <!-- Header with gradient -->
    <header class="sticky top-0 z-40 safe-top">
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"></div>
      <div class="relative px-5 py-4">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {{ t.transactions.title }}
          </h1>
          <button
            @click="showFilters = !showFilters"
            :class="[
              'px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg',
              showFilters 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105' 
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105'
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
            class="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-glass dark:shadow-glass-dark"
          />
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="relative px-5 pb-5 pt-4 animate-slide-down">
        <!-- Glassmorphic background -->
        <div class="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50"></div>
        
        <div class="relative space-y-5">
          <!-- Date Range - Segmented Control (Apple Style) -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{{ t.transactions.dateRange }}</label>
            <div class="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-2xl shadow-inner">
              <div class="grid grid-cols-3 gap-1">
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
                    'px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                    dateRange === option.value
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-lg scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Pocket Filter - Apple Style Picker -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{{ t.transactions.pocket }}</label>
            <div class="space-y-2">
              <!-- All Pockets Option -->
              <button
                @click="selectedPocketId = null"
                :class="[
                  'w-full p-4 rounded-2xl transition-all text-left group',
                  selectedPocketId === null
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-premium scale-105'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 shadow-glass dark:shadow-glass-dark'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    selectedPocketId === null 
                      ? 'bg-white/20' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  ]">
                    <Icon name="heroicons:wallet" :class="[
                      'w-5 h-5',
                      selectedPocketId === null ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                    ]" />
                  </div>
                  <span :class="[
                    'font-bold',
                    selectedPocketId === null ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  ]">{{ t.transactions.allPockets }}</span>
                  <Icon 
                    v-if="selectedPocketId === null"
                    name="heroicons:check-circle-solid" 
                    class="w-6 h-6 text-white ml-auto" 
                  />
                </div>
              </button>

              <!-- Individual Pockets -->
              <button
                v-for="pocket in mockPockets.slice(0, 5)"
                :key="pocket.id"
                @click="selectedPocketId = pocket.id"
                :class="[
                  'w-full p-4 rounded-2xl transition-all text-left group',
                  selectedPocketId === pocket.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-premium scale-105'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 shadow-glass dark:shadow-glass-dark'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    selectedPocketId === pocket.id 
                      ? 'bg-white/20' 
                      : getColorClass(getTypePocket(pocket.typePocketId)?.color || 'blue')
                  ]">
                    <Icon 
                      :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" 
                      :class="[
                        'w-5 h-5',
                        selectedPocketId === pocket.id ? 'text-white' : ''
                      ]"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p :class="[
                      'font-bold text-sm',
                      selectedPocketId === pocket.id ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                    ]">{{ pocket.name }}</p>
                    <p :class="[
                      'text-xs font-medium',
                      selectedPocketId === pocket.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    ]">{{ getTypePocket(pocket.typePocketId)?.name }}</p>
                  </div>
                  <Icon 
                    v-if="selectedPocketId === pocket.id"
                    name="heroicons:check-circle-solid" 
                    class="w-6 h-6 text-white" 
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Brand Filter - Segmented Pills -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{{ t.transactions.brand }}</label>
            <div class="flex flex-wrap gap-2">
              <button
                @click="selectedBrand = null"
                :class="[
                  'px-4 py-2.5 rounded-full font-bold text-sm transition-all',
                  selectedBrand === null
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 shadow-glass dark:shadow-glass-dark'
                ]"
              >
                {{ t.transactions.allBrands }}
              </button>
              <button
                v-for="brand in GOLD_BRAND_LIST"
                :key="brand"
                @click="selectedBrand = brand"
                :class="[
                  'px-4 py-2.5 rounded-full font-bold text-sm transition-all',
                  selectedBrand === brand
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 shadow-glass dark:shadow-glass-dark'
                ]"
              >
                {{ brand }}
              </button>
            </div>
          </div>

          <!-- Sort By - List Style -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{{ t.transactions.sortBy }}</label>
            <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-glass dark:shadow-glass-dark">
              <button
                v-for="(option, index) in [
                  { value: 'date-desc', label: t.transactions.newestFirst, icon: 'heroicons:arrow-down' },
                  { value: 'date-asc', label: t.transactions.oldestFirst, icon: 'heroicons:arrow-up' },
                  { value: 'amount-desc', label: t.transactions.highestAmount, icon: 'heroicons:currency-dollar' },
                  { value: 'amount-asc', label: t.transactions.lowestAmount, icon: 'heroicons:currency-dollar' },
                  { value: 'weight-desc', label: t.transactions.heaviestWeight, icon: 'heroicons:scale' },
                  { value: 'weight-asc', label: t.transactions.lightestWeight, icon: 'heroicons:scale' },
                ]"
                :key="option.value"
                @click="sortBy = option.value as any"
                :class="[
                  'w-full p-4 transition-all text-left flex items-center gap-3',
                  index !== 0 && 'border-t border-gray-200/50 dark:border-gray-700/50',
                  sortBy === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <div :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  sortBy === option.value
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700'
                ]">
                  <Icon 
                    :name="option.icon" 
                    :class="[
                      'w-4 h-4',
                      sortBy === option.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    ]"
                  />
                </div>
                <span :class="[
                  'font-bold text-sm flex-1',
                  sortBy === option.value 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-gray-100'
                ]">{{ option.label }}</span>
                <Icon 
                  v-if="sortBy === option.value"
                  name="heroicons:check-circle-solid" 
                  class="w-5 h-5 text-blue-600 dark:text-blue-400" 
                />
              </button>
            </div>
          </div>

          <!-- Clear Filters -->
          <button
            @click="clearFilters"
            class="w-full px-5 py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="heroicons:x-circle" class="w-5 h-5" />
            {{ t.transactions.clearFilters }}
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-5 py-6 space-y-6 pb-24">
      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3 animate-slide-up">
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">{{ t.transactions.totalTransactions }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalStats.count }}</p>
        </div>
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">{{ t.dashboard.totalWeight }}</p>
          <p class="text-lg font-bold text-gold-600 dark:text-gold-400 tabular-nums">
            {{ formatWeight(totalStats.totalWeight) }}
          </p>
        </div>
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">{{ t.pockets.value }}</p>
          <p class="text-base font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {{ formatCompactCurrency(totalStats.totalValue) }}
          </p>
        </div>
      </div>

      <!-- Transaction List -->
      <div v-if="filteredTransactions.length > 0" class="space-y-3">
        <NuxtLink
          v-for="(transaction, index) in filteredTransactions"
          :key="transaction.id"
          :to="`/transactions/${transaction.id}`"
          class="group block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark hover:shadow-premium transition-all duration-300 active:scale-[0.98] border border-gray-100/50 dark:border-gray-700/50 animate-slide-up"
          :style="{ animationDelay: `${index * 0.03}s`, animationFillMode: 'both' }"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 dark:from-gold-600 dark:to-amber-700 flex items-center justify-center shrink-0 shadow-lg">
                <Icon name="heroicons:arrow-trending-up" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ getPocketName(transaction.pocketId) }}
                </p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span :class="['px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider', getBrandColor(transaction.brand)]">
                    {{ transaction.brand }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {{ formatRelativeTime(transaction.transactionDate) }}
                  </span>
                </div>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>

          <div class="flex items-center justify-between gap-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div class="flex items-center gap-4">
              <div>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">{{ t.transactions.weight }}</p>
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                  {{ formatWeight(transaction.weight) }}
                </p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">{{ t.transactions.pricePerGram }}</p>
                <p class="text-sm font-bold text-gray-600 dark:text-gray-400 tabular-nums">
                  {{ formatCompactCurrency(transaction.pricePerGram) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">{{ t.transactions.total }}</p>
              <p class="text-lg font-bold text-gold-600 dark:text-gold-400 tabular-nums">
                {{ formatCompactCurrency(transaction.totalPrice) }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-slide-up">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t.transactions.noTransactionsFound }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ t.transactions.tryDifferentFilters }}</p>
      </div>
    </div>

    <!-- Premium FAB -->
    <button
      @click="showAddTransaction = true"
      class="fixed bottom-24 right-5 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-premium hover:shadow-premium-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Add transaction"
    >
      <Icon name="heroicons:plus" class="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
    </button>

    <!-- Add Transaction Sheet -->
    <PageTransactionAddTransactionSheet
      :open="showAddTransaction"
      @update:open="showAddTransaction = $event"
      @success="handleTransactionSuccess"
    />
  </div>
</template>
