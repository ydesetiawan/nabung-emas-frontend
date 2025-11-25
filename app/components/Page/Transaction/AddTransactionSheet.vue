<script setup lang="ts">

import type {ITransactionCreate} from "@/types/transaction";

const props = defineProps<{
  open: boolean
  defaultPocketId?: string
  editMode?: boolean
  editData?: ITransactionCreate & { id: string }
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': [transaction: ITransactionCreate]
  'update': [transaction: ITransactionCreate & { id: string }]
}>()

const transactionStore = useTransactionStore()
const { calculateTotalPrice } = useGoldCalculator()

// Pocket search and grouping
const pocketSearchQuery = ref('')
const showPocketSelector = ref(false)

const groupedPockets = computed(() => {
  const query = pocketSearchQuery.value.toLowerCase()
  const filtered = mockPockets.filter(p => 
    p.name.toLowerCase().includes(query) ||
    getTypePocket(p.typePocketId)?.name.toLowerCase().includes(query)
  )
  
  const groups: Record<string, typeof mockPockets> = {}
  filtered.forEach(pocket => {
    const typeId = pocket.typePocketId
    if (!groups[typeId]) groups[typeId] = []
    groups[typeId].push(pocket)
  })
  
  return groups
})

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

const selectedPocket = computed(() => {
  return mockPockets.find(p => p.id === formData.value.pocketId)
})

const selectPocket = (pocketId: string) => {
  formData.value.pocketId = pocketId
  showPocketSelector.value = false
  errors.value.pocketId = ''
}

// Form state
const formData = ref<ITransactionCreate>({
  pocketId: props.defaultPocketId || '',
  transactionDate: new Date().toISOString().split('T')[0],
  brand: '',
  weight: 0,
  pricePerGram: 0,
  totalPrice: 0,
  description: '',
})

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Initialize form with edit data
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.editMode && props.editData) {
      formData.value = {
        pocketId: props.editData.pocketId,
        transactionDate: new Date(props.editData.transactionDate).toISOString().split('T')[0],
        brand: props.editData.brand,
        weight: props.editData.weight,
        pricePerGram: props.editData.pricePerGram,
        totalPrice: props.editData.totalPrice,
        description: props.editData.description || '',
      }
    } else if (props.defaultPocketId) {
      formData.value.pocketId = props.defaultPocketId
    }
  }
})

// Auto-calculate total price
watch([() => formData.value.weight, () => formData.value.pricePerGram], ([weight, price]) => {
  if (weight && price) {
    formData.value.totalPrice = calculateTotalPrice(weight, price)
  }
})

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.pocketId) {
    errors.value.pocketId = 'Please select a pocket'
  }

  if (!formData.value.brand) {
    errors.value.brand = 'Please select a brand'
  }

  if (!formData.value.weight || formData.value.weight < BUSINESS_RULES.minTransactionWeight) {
    errors.value.weight = `Weight must be at least ${BUSINESS_RULES.minTransactionWeight}g`
  }

  if (formData.value.weight > BUSINESS_RULES.maxTransactionWeight) {
    errors.value.weight = `Weight cannot exceed ${BUSINESS_RULES.maxTransactionWeight}g`
  }

  if (!formData.value.pricePerGram || formData.value.pricePerGram < BUSINESS_RULES.minPricePerGram) {
    errors.value.pricePerGram = `Price must be at least ${formatCurrency(BUSINESS_RULES.minPricePerGram)}`
  }

  return Object.keys(errors.value).length === 0
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // In real app, this would call the API
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    
    if (props.editMode && props.editData) {
      emit('update', { ...formData.value, id: props.editData.id })
    } else {
      emit('success', formData.value)
    }
    emit('update:open', false)
    
    // Reset form
    resetForm()
  } catch (error) {
    console.error('Failed to save transaction:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    pocketId: props.defaultPocketId || '',
    transactionDate: new Date().toISOString().split('T')[0],
    brand: '',
    weight: 0,
    pricePerGram: 0,
    totalPrice: 0,
    description: '',
  }
  errors.value = {}
  pocketSearchQuery.value = ''
  showPocketSelector.value = false
}

const close = () => {
  emit('update:open', false)
  resetForm()
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50"
        @click="close"
      />
    </Transition>

    <!-- Sheet -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-t-3xl shadow-premium max-h-[90vh] flex flex-col max-w-md mx-auto"
      >
        <!-- Header with gradient -->
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-gold-500 to-amber-600 dark:from-gold-600 dark:to-amber-700 rounded-t-3xl"></div>
          <div class="relative flex items-center justify-between p-6 text-white">
            <h2 class="text-2xl font-bold drop-shadow-lg">
              {{ editMode ? 'Edit Transaction' : 'Add Transaction' }}
            </h2>
            <button
              @click="close"
              class="p-2.5 hover:bg-white/20 rounded-xl transition-all active:scale-95 backdrop-blur-sm"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Pocket Selection -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Pocket <span class="text-red-500">*</span>
            </label>
            
            <!-- Selected Pocket Display -->
            <button
              v-if="selectedPocket && !showPocketSelector"
              type="button"
              @click="showPocketSelector = true"
              :class="[
                'w-full p-4 rounded-2xl border-2 transition-all text-left shadow-glass dark:shadow-glass-dark',
                errors.pocketId 
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' 
                  : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:border-gold-500 dark:hover:border-gold-400 hover:scale-105'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg', getColorClass(getTypePocket(selectedPocket.typePocketId)?.color || 'blue')]">
                  <Icon :name="getTypePocket(selectedPocket.typePocketId)?.icon || 'heroicons:wallet'" class="w-6 h-6" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ selectedPocket.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ getTypePocket(selectedPocket.typePocketId)?.name }}</p>
                </div>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </button>

            <!-- Apple-Style Pocket Selector -->
            <div v-else class="space-y-3">
              <!-- Search -->
              <div class="relative">
                <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  v-model="pocketSearchQuery"
                  type="text"
                  placeholder="Search pockets..."
                  class="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark"
                />
              </div>

              <!-- Grouped Pockets - Apple Style -->
              <div class="max-h-80 overflow-y-auto space-y-4">
                <div v-for="(pockets, typeId) in groupedPockets" :key="typeId">
                  <!-- Type Header -->
                  <div class="flex items-center gap-2 mb-2 px-2">
                    <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shadow-lg', getColorClass(getTypePocket(typeId)?.color || 'blue')]">
                      <Icon :name="getTypePocket(typeId)?.icon || 'heroicons:wallet'" class="w-4 h-4" />
                    </div>
                    <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ getTypePocket(typeId)?.name }}
                    </h4>
                  </div>
                  
                  <!-- Pocket Cards - Apple List Style -->
                  <div class="space-y-2">
                    <button
                      v-for="pocket in pockets"
                      :key="pocket.id"
                      type="button"
                      @click="selectPocket(pocket.id)"
                      :class="[
                        'w-full p-4 rounded-2xl transition-all text-left group',
                        formData.pocketId === pocket.id
                          ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white shadow-premium scale-105'
                          : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 shadow-glass dark:shadow-glass-dark'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                          formData.pocketId === pocket.id 
                            ? 'bg-white/20' 
                            : getColorClass(getTypePocket(pocket.typePocketId)?.color || 'blue')
                        ]">
                          <Icon 
                            :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" 
                            :class="[
                              'w-5 h-5',
                              formData.pocketId === pocket.id ? 'text-white' : ''
                            ]"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p :class="[
                            'font-bold text-sm',
                            formData.pocketId === pocket.id ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                          ]">{{ pocket.name }}</p>
                          <p :class="[
                            'text-xs font-medium mt-0.5',
                            formData.pocketId === pocket.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                          ]">
                            {{ formatWeight(pocket.aggregateTotalWeight) }} • {{ formatCompactCurrency(pocket.aggregateTotalPrice) }}
                          </p>
                        </div>
                        <Icon 
                          v-if="formData.pocketId === pocket.id"
                          name="heroicons:check-circle-solid" 
                          class="w-6 h-6 text-white" 
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p v-if="errors.pocketId" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.pocketId }}</p>
          </div>

          <!-- Transaction Date -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Transaction Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.transactionDate"
              type="date"
              :max="new Date().toISOString().split('T')[0]"
              class="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 font-medium shadow-glass dark:shadow-glass-dark"
            />
          </div>

          <!-- Gold Brand - Apple Style Pills -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Gold Brand <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="brand in GOLD_BRAND_LIST"
                :key="brand"
                type="button"
                @click="formData.brand = brand; errors.brand = ''"
                :class="[
                  'px-4 py-2.5 rounded-full font-bold text-sm transition-all',
                  formData.brand === brand
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white shadow-lg scale-110'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 shadow-glass dark:shadow-glass-dark'
                ]"
              >
                {{ brand }}
              </button>
            </div>
            <p v-if="errors.brand" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.brand }}</p>
          </div>

          <!-- Weight -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Weight (grams) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.weight"
              type="number"
              step="0.01"
              placeholder="0.00"
              :class="[
                'w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 font-medium shadow-glass dark:shadow-glass-dark',
                errors.weight ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
              ]"
            />
            <p v-if="errors.weight" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.weight }}</p>
            <p v-else class="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              Min: {{ BUSINESS_RULES.minTransactionWeight }}g, Max: {{ BUSINESS_RULES.maxTransactionWeight }}g
            </p>
          </div>

          <!-- Price per Gram -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Price per Gram (IDR) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.pricePerGram"
              type="number"
              step="1000"
              placeholder="0"
              :class="[
                'w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 font-medium shadow-glass dark:shadow-glass-dark',
                errors.pricePerGram ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
              ]"
            />
            <p v-if="errors.pricePerGram" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.pricePerGram }}</p>
          </div>

          <!-- Total Price (Auto-calculated) -->
          <div class="p-5 bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-500/10 dark:to-amber-500/10 rounded-2xl border-2 border-gold-200/50 dark:border-gold-700/50 shadow-glass dark:shadow-glass-dark">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gold-900 dark:text-gold-300 uppercase tracking-wide">Total Price</span>
              <span class="text-3xl font-bold text-gold-600 dark:text-gold-400 tabular-nums">
                {{ formatCompactCurrency(formData.totalPrice) }}
              </span>
            </div>
            <p class="text-xs text-gold-600 dark:text-gold-400 mt-2 font-medium">Auto-calculated from weight × price per gram</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Add notes about this transaction..."
              :maxlength="BUSINESS_RULES.maxDescriptionLength"
              class="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark"
            />
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right font-medium">
              {{ formData.description?.length || 0 }} / {{ BUSINESS_RULES.maxDescriptionLength }}
            </p>
          </div>
        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-3">
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="isSubmitting"
            :class="[
              'w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg',
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 hover:scale-105 active:scale-95'
            ]"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
              Saving...
            </span>
            <span v-else>Save Transaction</span>
          </button>
          
          <button
            type="button"
            @click="close"
            class="w-full py-3.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
