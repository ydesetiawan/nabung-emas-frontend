<script setup lang="ts">
import { mockTransactions, mockPockets, mockTypePockets } from '~/utils/mockData'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const transactionId = route.params.id as string

// Find transaction
const transaction = computed(() => {
  return mockTransactions.find(t => t.id === transactionId)
})

// Find pocket
const pocket = computed(() => {
  if (!transaction.value) return null
  return mockPockets.find(p => p.id === transaction.value.pocketId)
})

// Find type pocket
const typePocket = computed(() => {
  if (!pocket.value) return null
  return mockTypePockets.find(tp => tp.id === pocket.value.typePocketId)
})

useHead({
  title: computed(() => transaction.value 
    ? `${t.value.transactions.title} - ${transaction.value.brand}` 
    : t.value.transactions.title
  ),
})

const getBrandColor = (brand: string) => {
  const colors: Record<string, string> = {
    'Antam': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'UBS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Pegadaian': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'King Halim': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return colors[brand] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    // In real app, would call API
    alert('Transaction deleted (mock)')
    router.push('/transactions')
  }
}

const handleEdit = () => {
  // In real app, would open edit modal
  alert('Edit transaction (coming soon)')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 safe-top">
      <div class="flex items-center gap-3 px-4 h-16">
        <button
          @click="router.back()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Transaction Details</h1>
      </div>
    </header>

    <!-- Content -->
    <div v-if="transaction" class="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <!-- Transaction Header Card -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
        <div class="flex items-start justify-between mb-4">
          <span :class="['px-3 py-1.5 rounded-lg text-sm font-semibold', getBrandColor(transaction.brand)]">
            {{ transaction.brand }}
          </span>
          <span class="text-sm text-white/80">
            {{ formatDate(transaction.transactionDate) }}
          </span>
        </div>
        
        <div class="space-y-2">
          <p class="text-sm text-white/80">Total Price</p>
          <p class="text-4xl font-bold">{{ formatCurrency(transaction.totalPrice) }}</p>
        </div>
      </div>

      <!-- Transaction Details -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Weight -->
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
              <Icon name="heroicons:scale" class="w-5 h-5 text-gold-600 dark:text-gold-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Weight</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatWeight(transaction.weight) }}</p>
            </div>
          </div>
        </div>

        <!-- Price per Gram -->
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Icon name="heroicons:currency-dollar" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Price per Gram</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCurrency(transaction.pricePerGram) }}</p>
            </div>
          </div>
        </div>

        <!-- Pocket -->
        <NuxtLink
          v-if="pocket"
          :to="`/pockets/${pocket.id}`"
          class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Icon name="heroicons:wallet" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pocket</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100">{{ pocket.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ typePocket?.name }}</p>
            </div>
          </div>
          <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
        </NuxtLink>

        <!-- Transaction Date -->
        <div class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Icon name="heroicons:calendar" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Transaction Date</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100">{{ formatDate(transaction.transactionDate, 'long') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatRelativeTime(transaction.transactionDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="transaction.description" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</h3>
        <p class="text-gray-900 dark:text-gray-100">{{ transaction.description }}</p>
      </div>

      <!-- Receipt Image -->
      <div v-if="transaction.receiptImage" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Receipt</h3>
        <img
          :src="transaction.receiptImage"
          alt="Receipt"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700"
        />
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="handleEdit"
          class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="heroicons:pencil" class="w-5 h-5" />
          <span>Edit</span>
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="heroicons:trash" class="w-5 h-5" />
          <span>Delete</span>
        </button>
      </div>

      <!-- Transaction Info -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Created {{ formatRelativeTime(transaction.createdAt) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          ID: {{ transaction.id }}
        </p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="px-4 py-12 text-center">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Transaction Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The transaction you're looking for doesn't exist.</p>
      <NuxtLink
        to="/transactions"
        class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Back to Transactions
      </NuxtLink>
    </div>
  </div>
</template>
