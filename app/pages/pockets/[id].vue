<script setup lang="ts">
import type { IPocket } from '@/types/pocket'
import type { ITransaction } from '@/types/transaction'


definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { calculatePocketStats } = useGoldCalculator()

// Use composables directly
const pocketApi = usePocketApi()
const transactionApi = useTransactionApi()
const typePocketStore = useTypePocketStore()

const pocketId = route.params.id as string

const isLoading = ref(true)
const pocket = ref<IPocket>()
const transactions = ref<ITransaction[]>([])

// Fetch pocket data on mount
onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      typePocketStore.fetchTypePockets(),
      fetchPocketData(),
      fetchTransactionsData()
    ])
  } catch (error) {
    console.error('Failed to fetch pocket data:', error)
  } finally {
    isLoading.value = false
  }
})

const fetchPocketData = async () => {
  pocket.value = await pocketApi.fetchPocketById(pocketId)
}

const fetchTransactionsData = async () => {
  transactions.value = await transactionApi.fetchTransactions(pocketId)
}

// Find type pocket
const typePocket = computed(() => {
  if (!pocket.value) return null
  return typePocketStore.getTypePocketById(pocket.value.typePocketId)
})

// Get pocket transactions
const pocketTransactions = computed(() => {
  if (!pocket.value?.transactions) return []
  return pocket.value.transactions.sort((a: any, b: any) => 
    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  )
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
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const showEditPocket = ref(false)

const handleTransactionSuccess = async () => {
  showAddTransaction.value = false
  await fetchPocketData()
  await fetchTransactionsData()
}

const handlePocketUpdate = async () => {
  showEditPocket.value = false
  await fetchPocketData()
}

const handleEdit = () => {
  showEditPocket.value = true
}

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await pocketApi.deletePocket(pocketId)
    showDeleteModal.value = false
    router.push('/pockets')
  } catch (error) {
    console.error('Failed to delete pocket:', error)
    alert(t.value.pockets.deleteFailed)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <!-- Header with gradient -->
    <header class="sticky top-0 z-40 safe-top">
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"></div>
      <div class="relative flex items-center gap-3 px-5 h-16">
        <button
          @click="router.back()"
          class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
        >
          <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex-1 truncate">
          {{ pocket?.name || t.pockets.pocketDetails }}
        </h1>
        <button
          @click="handleEdit"
          class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
        >
          <Icon name="heroicons:pencil" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <div v-if="pocket && typePocket && stats" class="px-5 py-6 space-y-6 max-w-2xl mx-auto pb-24">
      <!-- Pocket Header Card with Premium Gradient -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 text-white rounded-3xl p-6 shadow-premium animate-slide-up">
        <!-- Animated decorative elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-soft" style="animation-delay: 1s;" />
        
        <div class="relative z-10">
          <div class="flex items-start gap-4 mb-6">
            <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm', getColorClass(typePocket.color)]">
              <Icon :name="typePocket.icon" class="w-8 h-8" />
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-bold mb-1 drop-shadow-lg">{{ pocket.name }}</h2>
              <p class="text-sm text-white/90 font-semibold">{{ typePocket.name }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
              <p class="text-xs text-white/80 mb-1.5 font-medium">{{ t.pockets.totalWeight }}</p>
              <p class="text-2xl font-bold tabular-nums">{{ formatWeight(pocket.aggregateTotalWeight) }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
              <p class="text-xs text-white/80 mb-1.5 font-medium">{{ t.pockets.totalValue }}</p>
              <p class="text-2xl font-bold tabular-nums">{{ formatCurrency(pocket.aggregateTotalPrice) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-3 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:chart-bar" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.pockets.currentValue }}</p>
          </div>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {{ formatCurrency(stats.currentValue) }}
          </p>
        </div>

        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:arrow-trending-up" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.pockets.profitLoss }}</p>
          </div>
          <p :class="['text-xl font-bold tabular-nums', stats.profitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400']">
            {{ stats.profitLoss >= 0 ? '+' : '' }}{{ formatCurrency(stats.profitLoss) }}
          </p>
        </div>

        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:calculator" class="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.pockets.avgPricePerGram }}</p>
          </div>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {{ formatCurrency(stats.averagePricePerGram) }}
          </p>
        </div>

        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="heroicons:arrow-path" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.pockets.transactionsSection }}</p>
          </div>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ pocketTransactions.length }}
          </p>
        </div>
      </div>

      <!-- Progress -->
      <div v-if="pocket.targetWeight" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-gray-900 dark:text-gray-100">{{ t.pockets.targetProgress }}</h3>
          <span class="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">{{ progress?.toFixed(1) }}%</span>
        </div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min(progress || 0, 100)}%` }"
          />
        </div>
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
          <span>{{ formatWeight(pocket.aggregateTotalWeight) }}</span>
          <span>{{ formatWeight(pocket.targetWeight) }}</span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="pocket.description" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{{ t.pockets.description }}</h3>
        <p class="text-gray-900 dark:text-gray-100 font-medium">{{ pocket.description }}</p>
      </div>

      <!-- Transactions List -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
        <div class="p-5 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900 dark:text-gray-100">{{ t.pockets.transactionsSection }}</h3>
          <button
            @click="showAddTransaction = true"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {{ t.pockets.addButton }}
          </button>
        </div>

        <div v-if="transactions.length > 0" class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
          <NuxtLink
            v-for="transaction in transactions"
            :key="transaction.id"
            :to="`/transactions/${transaction.id}`"
            class="block p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all group"
          >
            <div class="flex items-center justify-between gap-3 mb-2">
              <span :class="['px-3 py-1 rounded-xl text-xs font-bold', getBrandColor(transaction.brand)]">
                {{ transaction.brand }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {{ formatRelativeTime(transaction.transactionDate) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatWeight(transaction.weight) }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-medium tabular-nums">{{ formatCurrency(transaction.pricePerGram) }}/g</p>
              </div>
              <p class="text-lg font-bold text-gold-600 dark:text-gold-400 tabular-nums">
                {{ formatCurrency(transaction.totalPrice) }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Icon name="heroicons:inbox" class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4 font-medium">{{ t.pockets.noTransactionsYet }}</p>
          <button
            @click="showAddTransaction = true"
            class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {{ t.pockets.addFirstTransaction }}
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 backdrop-blur-sm rounded-2xl p-5 border border-red-200/50 dark:border-red-700/50 animate-slide-up" style="animation-delay: 0.5s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">{{ t.pockets.dangerZone }}</h3>
        <button
          @click="openDeleteModal"
          class="w-full px-5 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
        >
          <Icon name="heroicons:trash" class="w-5 h-5" />
          <span>{{ t.pockets.deletePocket }}</span>
        </button>
      </div>

      <!-- Pocket Info -->
      <div class="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.6s; animation-fill-mode: both;">
        <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">
          {{ t.pockets.created }} {{ formatRelativeTime(pocket.createdAt) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
          ID: {{ pocket.id }}
        </p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="px-5 py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:exclamation-circle" class="w-10 h-10 text-gray-400" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t.pockets.pocketNotFound }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6 font-medium">{{ t.pockets.pocketNotFoundMessage }}</p>
      <NuxtLink
        to="/pockets"
        class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
      >
        {{ t.pockets.backToPockets }}
      </NuxtLink>
    </div>

    <!-- Add Transaction Sheet -->
    <PageTransactionAddTransactionSheet
      :open="showAddTransaction"
      :default-pocket-id="pocketId"
      @update:open="showAddTransaction = $event"
      @success="handleTransactionSuccess"
    />

    <!-- Edit Pocket Sheet -->
    <PagePocketAddPocketSheet
      :open="showEditPocket"
      :edit-mode="true"
      :edit-data="pocket"
      @update:open="showEditPocket = $event"
      @update="handlePocketUpdate"
    />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="showDeleteModal = false"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="showDeleteModal"
              class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <!-- Gradient Header -->
              <div class="relative bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 p-6 text-center">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="relative">
                  <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30">
                    <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-white" />
                  </div>
                  <h3 class="text-xl font-bold text-white mb-1">{{ t.pockets.deletePocketTitle }}</h3>
                  <p class="text-white/80 text-sm font-medium">{{ t.pockets.deleteCannotUndo }}</p>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700/50 rounded-xl p-4">
                  <p class="text-sm text-red-800 dark:text-red-300 font-medium text-center">
                    {{ t.pockets.deletePocketMessage }} <span class="font-bold">"{{ pocket?.name }}"</span> {{ t.pockets.andAllTransactions }}
                  </p>
                </div>

                <div class="flex gap-3">
                  <button
                    @click="showDeleteModal = false"
                    :disabled="isDeleting"
                    class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ t.common.cancel }}
                  </button>
                  <button
                    @click="handleDelete"
                    :disabled="isDeleting"
                    class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Icon v-if="isDeleting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                    <Icon v-else name="heroicons:trash" class="w-5 h-5" />
                    <span>{{ isDeleting ? t.pockets.deleting : t.pockets.deleteButton }}</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
