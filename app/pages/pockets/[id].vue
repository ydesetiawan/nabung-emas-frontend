<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { calculatePocketStats } = useGoldCalculator()

const pocketId = route.params.id as string

// Find pocket
const pocket = computed(() => {
  return mockPockets.find(p => p.id === pocketId)
})

// Find type pocket
const typePocket = computed(() => {
  if (!pocket.value) return null
  return mockTypePockets.find(tp => tp.id === pocket.value.typePocketId)
})

// Get pocket transactions
const pocketTransactions = computed(() => {
  return mockTransactions
    .filter(t => t.pocketId === pocketId)
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
})

// Calculate stats
const stats = computed(() => {
  if (!pocket.value) return null
  return calculatePocketStats(pocket.value.aggregateTotalPrice, pocket.value.aggregateTotalWeight)
})

// Calculate progress
const progress = computed(() => {
  if (!pocket.value?.targetWeight) return null
  return (pocket.value.aggregateTotalWeight / pocket.value.targetWeight) * 100
})

useHead({
  title: computed(() => pocket.value 
    ? `${pocket.value.name} - ${t.value.pockets.title}` 
    : t.value.pockets.title
  ),
})

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
  return colors[brand] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

const showAddTransaction = ref(false)

const handleTransactionSuccess = () => {
  showAddTransaction.value = false
  alert('Transaction added successfully!')
  // In real app, would refresh pocket data
}

const handleEdit = () => {
  alert('Edit pocket (coming soon)')
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this pocket and all its transactions?')) {
    alert('Pocket deleted (mock)')
    router.push('/pockets')
  }
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
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex-1 truncate">
          {{ pocket?.name || 'Pocket Details' }}
        </h1>
        <button
          @click="handleEdit"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="heroicons:pencil" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <div v-if="pocket && typePocket && stats" class="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <!-- Pocket Header Card -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
        <div class="flex items-start gap-4 mb-4">
          <div :class="['w-14 h-14 rounded-xl flex items-center justify-center', getColorClass(typePocket.color)]">
            <Icon :name="typePocket.icon" class="w-7 h-7" />
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-1">{{ pocket.name }}</h2>
            <p class="text-sm text-white/80">{{ typePocket.name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p class="text-xs text-white/70 mb-1">Total Weight</p>
            <p class="text-2xl font-bold tabular-nums">{{ formatWeight(pocket.aggregateTotalWeight) }}</p>
          </div>
          <div>
            <p class="text-xs text-white/70 mb-1">Total Value</p>
            <p class="text-2xl font-bold tabular-nums">{{ formatCurrency(pocket.aggregateTotalPrice) }}</p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:chart-bar" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400">Current Value</p>
          </div>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {{ formatCurrency(stats.currentValue) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:arrow-trending-up" class="w-5 h-5 text-green-600 dark:text-green-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400">Profit/Loss</p>
          </div>
          <p :class="['text-xl font-bold tabular-nums', stats.profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
            {{ stats.profitLoss >= 0 ? '+' : '' }}{{ formatCurrency(stats.profitLoss) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:calculator" class="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400">Avg Price/g</p>
          </div>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {{ formatCurrency(stats.averagePricePerGram) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:arrow-path" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
          </div>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ pocketTransactions.length }}
          </p>
        </div>
      </div>

      <!-- Progress -->
      <div v-if="pocket.targetWeight" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">Target Progress</h3>
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">{{ progress?.toFixed(1) }}%</span>
        </div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            class="h-full bg-blue-600 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min(progress || 0, 100)}%` }"
          />
        </div>
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{{ formatWeight(pocket.aggregateTotalWeight) }}</span>
          <span>{{ formatWeight(pocket.targetWeight) }}</span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="pocket.description" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</h3>
        <p class="text-gray-900 dark:text-gray-100">{{ pocket.description }}</p>
      </div>

      <!-- Transactions List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">Transactions</h3>
          <button
            @click="showAddTransaction = true"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Add
          </button>
        </div>

        <div v-if="pocketTransactions.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
          <NuxtLink
            v-for="transaction in pocketTransactions"
            :key="transaction.id"
            :to="`/transactions/${transaction.id}`"
            class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center justify-between gap-3 mb-2">
              <span :class="['px-2.5 py-1 rounded-lg text-xs font-semibold', getBrandColor(transaction.brand)]">
                {{ transaction.brand }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatRelativeTime(transaction.transactionDate) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ formatWeight(transaction.weight) }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatCurrency(transaction.pricePerGram) }}/g</p>
              </div>
              <p class="text-lg font-semibold text-gold-600 dark:text-gold-400 tabular-nums">
                {{ formatCurrency(transaction.totalPrice) }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="p-8 text-center">
          <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-600 dark:text-gray-400 mb-4">No transactions yet</p>
          <button
            @click="showAddTransaction = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add First Transaction
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <h3 class="text-sm font-medium text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
        <button
          @click="handleDelete"
          class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="heroicons:trash" class="w-5 h-5" />
          <span>Delete Pocket</span>
        </button>
      </div>

      <!-- Pocket Info -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Created {{ formatRelativeTime(pocket.createdAt) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          ID: {{ pocket.id }}
        </p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="px-4 py-12 text-center">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pocket Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The pocket you're looking for doesn't exist.</p>
      <NuxtLink
        to="/pockets"
        class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Back to Pockets
      </NuxtLink>
    </div>

    <!-- Add Transaction Sheet -->
    <TransactionAddTransactionSheet
      :open="showAddTransaction"
      :default-pocket-id="pocketId"
      @update:open="showAddTransaction = $event"
      @success="handleTransactionSuccess"
    />
  </div>
</template>
