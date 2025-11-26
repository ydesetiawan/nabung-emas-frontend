<script setup lang="ts">

import type {IPocketCreate} from "@/types/pocket";

definePageMeta({
  layout: 'default',
  middleware: 'auth', // Require authentication
})

const { t } = useI18n()
const pocketStore = usePocketStore()
const typePocketStore = useTypePocketStore()

const searchQuery = ref('')
const selectedType = ref<string | null>(null)
const showCreatePocket = ref(false)
const isLoading = ref(true)

useHead({
  title: computed(() => `${t.value.pockets.title} - EmasGo`),
})

// Fetch data on mount
onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      pocketStore.fetchPockets(),
      typePocketStore.fetchTypePockets(),
    ])
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
})

const filteredPockets = computed(() => {
  let result = pocketStore.pockets

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(query))
  }

  if (selectedType.value) {
    result = result.filter(p => p.typePocketId === selectedType.value)
  }

  return result
})

const totalStats = computed(() => ({
  count: filteredPockets.value.length,
  totalWeight: filteredPockets.value.reduce((sum, p) => sum + p.aggregateTotalWeight, 0),
  totalValue: filteredPockets.value.reduce((sum, p) => sum + p.aggregateTotalPrice, 0),
}))

const getTypePocket = (id: string) => {
  return typePocketStore.getTypePocketById(id)
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

const handleCreatePocket = async (pocket: IPocketCreate) => {
  try {
    await pocketStore.createPocket(pocket)
    showCreatePocket.value = false
    // Refresh pockets
    await pocketStore.fetchPockets()
  } catch (error) {
    console.error('Failed to create pocket:', error)
  }
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
            {{ t.pockets.title }}
          </h1>
          <button
            @click="showCreatePocket = true"
            class="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            <span>{{ t.pockets.newPocket }}</span>
          </button>
        </div>

        <!-- Search -->
        <div class="mb-3">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t.pockets.searchPlaceholder"
              class="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-glass dark:shadow-glass-dark"
            />
          </div>
        </div>

        <!-- Type Filter -->
        <div class="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          <button
            @click="selectedType = null"
            :class="[
              'px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all shrink-0',
              !selectedType
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105'
            ]"
          >
            {{ t.pockets.all }}
          </button>
          <button
            v-for="type in typePocketStore.typePocketList"
            :key="type.id"
            @click="selectedType = type.id"
            :class="[
              'px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0',
              selectedType === type.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105'
            ]"
          >
            <Icon :name="type.icon" class="w-4 h-4" />
            {{ type.name }}
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-5 py-6 space-y-6 pb-24">
      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3 animate-slide-up">
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">{{ t.pockets.totalPockets }}</p>
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

      <!-- Pockets Grid -->
      <div v-if="filteredPockets.length > 0" class="grid gap-4">
        <NuxtLink
          v-for="(pocket, index) in filteredPockets"
          :key="pocket.id"
          :to="`/pockets/${pocket.id}`"
          class="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark hover:shadow-premium transition-all duration-300 active:scale-[0.98] border border-gray-100/50 dark:border-gray-700/50 animate-slide-up"
          :style="{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', getColorClass(getTypePocket(pocket.typePocketId)?.color || 'blue')]">
                <Icon :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" class="w-7 h-7" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ pocket.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ getTypePocket(pocket.typePocketId)?.name }}</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div class="space-y-4">
            <div class="flex items-end justify-between">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">{{ t.pockets.weight }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatWeight(pocket.aggregateTotalWeight) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">{{ t.pockets.value }}</p>
                <p class="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{{ formatCurrency(pocket.aggregateTotalPrice) }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="pocket.targetWeight > 0">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="text-gray-600 dark:text-gray-400 font-medium">{{ t.pockets.progress }}</span>
                <span class="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                  {{ Math.round((pocket.aggregateTotalWeight / pocket.targetWeight) * 100) }}%
                </span>
              </div>
              <div class="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min((pocket.aggregateTotalWeight / pocket.targetWeight) * 100, 100)}%` }"
                />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right font-medium">
                Target: {{ formatWeight(pocket.targetWeight) }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-slide-up">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:wallet" class="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t.pockets.noPocketsFound }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">{{ t.pockets.noPocketsDescription }}</p>
        <button
          @click="showCreatePocket = true"
          class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto shadow-lg"
        >
          <Icon name="heroicons:plus" class="w-5 h-5" />
          <span>{{ t.pockets.createFirstPocket }}</span>
        </button>
      </div>
    </div>

    <!-- Create Pocket Sheet -->
    <PagePocketAddPocketSheet
      :open="showCreatePocket"
      @update:open="showCreatePocket = $event"
      @success="handleCreatePocket"
    />
  </div>
</template>
