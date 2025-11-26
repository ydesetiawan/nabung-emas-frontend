<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Use composables directly
const transactionApi = useTransactionApi()
const typePocketStore = useTypePocketStore()

const transactionId = route.params.id as string

const isLoading = ref(true)
const transaction = ref<any>(null)

// Fetch transaction data on mount
onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      typePocketStore.fetchTypePockets(),
      fetchTransactionData()
    ])
  } catch (error) {
    console.error('Failed to fetch transaction data:', error)
  } finally {
    isLoading.value = false
  }
})

const fetchTransactionData = async () => {
  transaction.value = await transactionApi.fetchTransactionById(transactionId)
}

// Find pocket
const pocket = computed(() => {
  if (!transaction.value?.pocket) return null
  return transaction.value.pocket
})

// Find type pocket
const typePocket = computed(() => {
  if (!pocket.value) return null
  return typePocketStore.getTypePocketById(pocket.value.typePocketId)
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

const showDeleteModal = ref(false)
const isDeleting = ref(false)
const showEditTransaction = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await transactionApi.deleteTransaction(transactionId)
    showDeleteModal.value = false
    router.push('/transactions')
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    alert(t.value.transactions.deleteFailed)
  } finally {
    isDeleting.value = false
  }
}

const handleTransactionUpdate = async () => {
  showEditTransaction.value = false
  await fetchTransactionData()
}

const handleEdit = () => {
  showEditTransaction.value = true
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
          {{ t.transactions.transactionDetails }}
        </h1>
        <button
          @click="handleEdit"
          class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
        >
          <Icon name="heroicons:pencil" class="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <div v-if="transaction" class="px-5 py-6 space-y-6 max-w-2xl mx-auto pb-24">
      <!-- Transaction Header Card with Premium Gradient -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 text-white rounded-3xl p-6 shadow-premium animate-slide-up">
        <!-- Animated decorative elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-soft" style="animation-delay: 1s;" />
        
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <span :class="['px-3 py-1.5 rounded-xl text-sm font-bold backdrop-blur-sm', getBrandColor(transaction.brand)]">
              {{ transaction.brand }}
            </span>
            <span class="text-sm text-white/90 font-medium">
              {{ formatDate(transaction.transactionDate) }}
            </span>
          </div>
          
          <div class="space-y-2">
            <p class="text-sm text-white/90 font-semibold">{{ t.transactions.totalPrice }}</p>
            <p class="text-5xl font-bold drop-shadow-lg tabular-nums">{{ formatCurrency(transaction.totalPrice) }}</p>
          </div>
        </div>
      </div>

      <!-- Transaction Details -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark divide-y divide-gray-200/50 dark:divide-gray-700/50 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <!-- Weight -->
        <div class="p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
              <Icon name="heroicons:scale" class="w-6 h-6 text-gold-600 dark:text-gold-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.transactions.weightLabel }}</p>
              <p class="font-bold text-gray-900 dark:text-gray-100 tabular-nums text-lg">{{ formatWeight(transaction.weight) }}</p>
            </div>
          </div>
        </div>

        <!-- Price per Gram -->
        <div class="p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.transactions.pricePerGramLabel }}</p>
              <p class="font-bold text-gray-900 dark:text-gray-100 tabular-nums text-lg">{{ formatCurrency(transaction.pricePerGram) }}</p>
            </div>
          </div>
        </div>

        <!-- Pocket -->
        <NuxtLink
          v-if="pocket"
          :to="`/pockets/${pocket.id}`"
          class="p-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all group"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="heroicons:wallet" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.transactions.pocketLabel }}</p>
              <p class="font-bold text-gray-900 dark:text-gray-100">{{ pocket.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ typePocket?.name }}</p>
            </div>
          </div>
          <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>

        <!-- Transaction Date -->
        <div class="p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Icon name="heroicons:calendar" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.transactions.transactionDateLabel }}</p>
              <p class="font-bold text-gray-900 dark:text-gray-100">{{ formatDate(transaction.transactionDate, 'long') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ formatRelativeTime(transaction.transactionDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="transaction.description" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark p-5 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{{ t.transactions.descriptionLabel }}</h3>
        <p class="text-gray-900 dark:text-gray-100 font-medium">{{ transaction.description }}</p>
      </div>

      <!-- Receipt Image -->
      <div v-if="transaction.receiptImage" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark p-5 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">{{ t.transactions.receiptLabel }}</h3>
        <img
          :src="transaction.receiptImage"
          :alt="t.transactions.receiptLabel"
          class="w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50"
        />
      </div>

      <!-- Danger Zone -->
      <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 backdrop-blur-sm rounded-2xl p-5 border border-red-200/50 dark:border-red-700/50 animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">{{ t.transactions.dangerZone }}</h3>
        <button
          @click="openDeleteModal"
          class="w-full px-5 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
        >
          <Icon name="heroicons:trash" class="w-5 h-5" />
          <span>{{ t.transactions.deleteTransaction }}</span>
        </button>
      </div>

      <!-- Transaction Info -->
      <div class="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.6s; animation-fill-mode: both;">
        <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">
          {{ t.transactions.created }} {{ formatRelativeTime(transaction.createdAt) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
          ID: {{ transaction.id }}
        </p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="px-5 py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:exclamation-circle" class="w-10 h-10 text-gray-400" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t.transactions.transactionNotFound }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6 font-medium">{{ t.transactions.transactionNotFoundMessage }}</p>
      <NuxtLink
        to="/transactions"
        class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
      >
        {{ t.transactions.backToTransactions }}
      </NuxtLink>
    </div>

    <!-- Edit Transaction Sheet -->
    <PageTransactionAddTransactionSheet
      :open="showEditTransaction"
      :edit-mode="true"
      :edit-data="transaction"
      @update:open="showEditTransaction = $event"
      @update="handleTransactionUpdate"
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
                  <h3 class="text-xl font-bold text-white mb-1">{{ t.transactions.deleteTransactionTitle }}</h3>
                  <p class="text-white/80 text-sm font-medium">{{ t.transactions.deleteCannotUndo }}</p>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700/50 rounded-xl p-4">
                  <p class="text-sm text-red-800 dark:text-red-300 font-medium text-center">
                    {{ t.transactions.deleteTransactionMessage }} <span class="font-bold">{{ transaction?.brand }}</span> {{ t.transactions.transactionOf }} <span class="font-bold">{{ transaction?.weight }}g</span>.
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
                    <span>{{ isDeleting ? t.transactions.deleting : t.transactions.deleteButton }}</span>
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
