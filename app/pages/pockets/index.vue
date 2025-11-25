<script setup lang="ts">
import { mockPockets, mockTypePockets } from '~/utils/mockData'
import type { IPocket, IPocketCreate } from '~/types/pocket'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const searchQuery = ref('')
const selectedType = ref<string | null>(null)
const showCreatePocket = ref(false)

useHead({
  title: computed(() => `${t.value.pockets.title} - Gold Savings`),
})

const filteredPockets = computed(() => {
  let result = mockPockets

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

const handleCreatePocket = (pocket: IPocketCreate) => {
  // In a real app, this would call an API
  console.log('Creating pocket:', pocket)
  
  const typePocket = getTypePocket(pocket.typePocketId)
  alert(`Pocket "${pocket.name}" (${typePocket?.name}) created successfully!`)
}

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-top transition-colors">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t.pockets.title }}</h1>
          <button
            @click="showCreatePocket = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            <span>{{ t.pockets.newPocket }}</span>
          </button>
        </div>

        <!-- Search -->
        <div class="px-4 mb-3">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t.pockets.searchPlaceholder"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        <!-- Type Filter -->
        <div class="flex gap-2 overflow-x-auto pb-3 px-4 scrollbar-hide">
          <button
            @click="selectedType = null"
            :class="[
              'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0',
              !selectedType
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
            ]"
          >
            {{ t.pockets.all }}
          </button>
          <button
            v-for="type in mockTypePockets"
            :key="type.id"
            @click="selectedType = type.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 shrink-0',
              selectedType === type.id
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
            ]"
          >
            <Icon :name="type.icon" class="w-4 h-4" />
            {{ type.name }}
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-6 space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 transition-colors">
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t.pockets.totalPockets }}</p>
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
            {{ formatCurrency(totalStats.totalValue) }}
          </p>
        </div>
      </div>

      <!-- Pockets Grid -->
      <div v-if="filteredPockets.length > 0" class="grid gap-4">
        <NuxtLink
          v-for="pocket in filteredPockets"
          :key="pocket.id"
          :to="`/pockets/${pocket.id}`"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-900/10 hover:shadow-md transition-all active:scale-98 group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-colors', getColorClass(getTypePocket(pocket.typePocketId)?.color || 'blue')]">
                <Icon :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ pocket.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ getTypePocket(pocket.typePocketId)?.name }}</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </div>

          <div class="space-y-3">
            <div class="flex items-end justify-between">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t.pockets.weight }}</p>
                <p class="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatWeight(pocket.aggregateTotalWeight) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t.pockets.value }}</p>
                <p class="text-lg font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{{ formatCurrency(pocket.aggregateTotalPrice) }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="pocket.targetWeight > 0">
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="text-gray-600 dark:text-gray-400">{{ t.pockets.progress }}</span>
                <span class="font-medium text-gray-900 dark:text-gray-100 tabular-nums">
                  {{ Math.round((pocket.aggregateTotalWeight / pocket.targetWeight) * 100) }}%
                </span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min((pocket.aggregateTotalWeight / pocket.targetWeight) * 100, 100)}%` }"
                />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-right">
                Target: {{ formatWeight(pocket.targetWeight) }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:wallet" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t.pockets.noPocketsFound }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ searchQuery || selectedType
            ? t.pockets.tryAdjusting
            : t.pockets.createFirst
          }}
        </p>
        <button
          v-if="!searchQuery && !selectedType"
          @click="showCreatePocket = true"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {{ t.pockets.createPocket }}
        </button>
      </div>
    </div>

    <!-- Add Pocket Sheet -->
    <PocketAddPocketSheet
      :open="showCreatePocket"
      @update:open="showCreatePocket = $event"
      @success="handleCreatePocket"
    />
  </div>
</template>
