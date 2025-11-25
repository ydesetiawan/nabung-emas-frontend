<script setup lang="ts">
import type { ITransactionCreate } from '@/types/transaction'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t.value.dashboard.goldSavings} - Gold Savings`),
})

const showAddTransaction = ref(false)

// Mock user data
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleTransactionSuccess = (transaction: ITransactionCreate) => {
  console.log('Transaction created:', transaction)
  // In real app, this would refresh the data
  // For now, just show a success message
  alert(`Transaction added successfully!\n${transaction.weight}g of ${transaction.brand} gold`)
}

// Get recent transactions (limit 5)
const recentTransactions = computed(() => {
  return [...mockTransactions]
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5)
})

// Get top pockets (limit 3)
const topPockets = computed(() => {
  return mockPockets.slice(0, 3)
})

const getTypePocket = (id: string) => {
  return mockTypePockets.find(t => t.id === id)
}

const getPocketName = (pocketId: string) => {
  return mockPockets.find(p => p.id === pocketId)?.name || 'Unknown'
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

const getBrandColor = (brand: string) => {
  const colors: Record<string, string> = {
    'Antam': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'UBS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Pegadaian': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'King Halim': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return colors[brand] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <!-- Header with gradient -->
    <header class="sticky top-0 z-40 safe-top">
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"></div>
      <div class="relative flex items-center justify-between px-5 py-4">
        <div class="flex items-center gap-3">
          <!-- User Avatar -->
          <NuxtLink 
            to="/profile"
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform active:scale-95"
          >
            {{ getInitials(user.name) }}
          </NuxtLink>
          
          <!-- Welcome Text -->
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.dashboard.welcomeBack }}</p>
            <h1 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ user.name }}
            </h1>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button class="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95">
            <Icon name="heroicons:bell" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-soft"></span>
          </button>
          <NuxtLink to="/settings" class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95">
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-5 py-6 space-y-6 pb-24">
      <!-- Portfolio Card with Premium Gradient -->
      <div class="relative overflow-hidden">
        <PageDashboardPortfolioCard />
      </div>

      <!-- Quick Stats -->
      <PageDashboardQuickStats />

      <!-- Pockets Section -->
      <div class="animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ t.dashboard.pockets }}</h2>
          <NuxtLink 
            to="/pockets" 
            class="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all"
          >
            {{ t.common.seeAll }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid gap-3">
          <NuxtLink
            v-for="pocket in topPockets"
            :key="pocket.id"
            :to="`/pockets/${pocket.id}`"
            class="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark hover:shadow-premium transition-all duration-300 active:scale-[0.98] border border-gray-100/50 dark:border-gray-700/50"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110', getColorClass(getTypePocket(pocket.typePocketId)?.color || 'blue')]">
                <Icon :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ pocket.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ formatWeight(pocket.aggregateTotalWeight) }} • {{ formatCurrency(pocket.aggregateTotalPrice) }}
                </p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>

          <!-- Create Pocket Button -->
          <NuxtLink
            to="/pockets"
            class="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all active:scale-[0.98]"
          >
            <Icon name="heroicons:plus-circle" class="w-5 h-5" />
            <span class="font-semibold text-sm">{{ t.pockets.createPocket }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Transactions Section -->
      <div class="animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ t.dashboard.transactions }}</h2>
          <NuxtLink 
            to="/transactions" 
            class="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all"
          >
            {{ t.common.seeAll }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            :to="`/transactions/${transaction.id}`"
            class="group block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark hover:shadow-premium transition-all duration-300 active:scale-[0.98] border border-gray-100/50 dark:border-gray-700/50"
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
          
          <div v-if="recentTransactions.length === 0" class="text-center py-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Icon name="heroicons:arrow-path" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t.transactions.noTransactionsFound }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium FAB -->
    <button
      @click="showAddTransaction = true"
      class="fixed bottom-24 right-5 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-premium hover:shadow-premium-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
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
