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
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm safe-top transition-colors">
      <div class="flex items-center justify-between px-4 h-16">
        <div>
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ t.dashboard.welcomeBack }}</p>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t.dashboard.goldSavings }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Icon name="heroicons:bell" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <NuxtLink to="/settings" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-6 space-y-6">
      <PageDashboardPortfolioCard />
      <PageDashboardQuickStats />

      <!-- Pockets Section -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t.dashboard.pockets }}</h2>
          <NuxtLink to="/pockets" class="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            {{ t.common.seeAll }}
          </NuxtLink>
        </div>

        <div class="grid gap-3">
          <NuxtLink
            v-for="pocket in topPockets"
            :key="pocket.id"
            :to="`/pockets/${pocket.id}`"
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 hover:shadow-md transition-all active:scale-98"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', getColorClass(getTypePocket(pocket.typePocketId)?.color || 'blue')]">
                <Icon :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ pocket.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ formatWeight(pocket.aggregateTotalWeight) }} • {{ formatCurrency(pocket.aggregateTotalPrice) }}</p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </NuxtLink>

          <!-- Create Pocket Button -->
          <NuxtLink
            to="/pockets"
            class="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t.pockets.createPocket }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Transactions Section -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t.dashboard.transactions }}</h2>
          <NuxtLink to="/transactions" class="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            {{ t.common.seeAll }}
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            :to="`/transactions/${transaction.id}`"
            class="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 hover:shadow-md transition-all active:scale-98"
          >
            <div class="flex items-center justify-between gap-3 mb-2">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span :class="['px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider', getBrandColor(transaction.brand)]">
                  {{ transaction.brand }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatRelativeTime(transaction.transactionDate) }}
                </span>
              </div>
              <p class="text-sm font-semibold text-gold-600 dark:text-gold-400 tabular-nums">
                {{ formatCurrency(transaction.totalPrice) }}
              </p>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ getPocketName(transaction.pocketId) }}</p>
              </div>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 tabular-nums">
                {{ formatWeight(transaction.weight) }}
              </p>
            </div>
          </NuxtLink>
          
          <div v-if="recentTransactions.length === 0" class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t.transactions.noTransactionsFound }}</p>
          </div>
        </div>
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
