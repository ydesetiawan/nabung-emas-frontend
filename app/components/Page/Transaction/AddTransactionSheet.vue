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
        class="fixed inset-0 bg-black/50 dark:bg-black/70 z-50"
        @click="close"
      />
    </Transition>

    <!-- Sheet -->
    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col max-w-md mx-auto transition-colors"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ editMode ? 'Edit Transaction' : 'Add Transaction' }}
          </h2>
          <button
            @click="close"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Pocket Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pocket <span class="text-red-500">*</span>
            </label>
            
            <!-- Selected Pocket Display -->
            <button
              v-if="selectedPocket && !showPocketSelector"
              type="button"
              @click="showPocketSelector = true"
              :class="[
                'w-full p-4 rounded-lg border-2 transition-all text-left',
                errors.pocketId 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', getColorClass(getTypePocket(selectedPocket.typePocketId)?.color || 'blue')]">
                  <Icon :name="getTypePocket(selectedPocket.typePocketId)?.icon || 'heroicons:wallet'" class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedPocket.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ getTypePocket(selectedPocket.typePocketId)?.name }}</p>
                </div>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </button>

            <!-- Pocket Selector -->
            <div v-else class="space-y-3">
              <!-- Search -->
              <div class="relative">
                <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  v-model="pocketSearchQuery"
                  type="text"
                  placeholder="Search pockets..."
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <!-- Grouped Pockets -->
              <div class="max-h-64 overflow-y-auto space-y-4">
                <div v-for="(pockets, typeId) in groupedPockets" :key="typeId">
                  <div class="flex items-center gap-2 mb-2">
                    <div :class="['w-6 h-6 rounded flex items-center justify-center', getColorClass(getTypePocket(typeId)?.color || 'blue')]">
                      <Icon :name="getTypePocket(typeId)?.icon || 'heroicons:wallet'" class="w-3.5 h-3.5" />
                    </div>
                    <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {{ getTypePocket(typeId)?.name }}
                    </h4>
                  </div>
                  <div class="space-y-2 pl-2">
                    <button
                      v-for="pocket in pockets"
                      :key="pocket.id"
                      type="button"
                      @click="selectPocket(pocket.id)"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                    >
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ pocket.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ formatWeight(pocket.aggregateTotalWeight) }} • {{ formatCurrency(pocket.aggregateTotalPrice) }}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p v-if="errors.pocketId" class="mt-1 text-sm text-red-500">{{ errors.pocketId }}</p>
          </div>

          <!-- Transaction Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Transaction Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.transactionDate"
              type="date"
              :max="new Date().toISOString().split('T')[0]"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <!-- Gold Brand -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Gold Brand <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.brand"
              :class="[
                'w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                errors.brand ? 'border-red-500' : 'border-gray-200'
              ]"
            >
              <option value="" disabled>Select brand</option>
              <option v-for="brand in GOLD_BRAND_LIST" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
            <p v-if="errors.brand" class="mt-1 text-sm text-red-500">{{ errors.brand }}</p>
          </div>

          <!-- Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Weight (grams) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.weight"
              type="number"
              step="0.01"
              placeholder="0.00"
              :class="[
                'w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                errors.weight ? 'border-red-500' : 'border-gray-200'
              ]"
            />
            <p v-if="errors.weight" class="mt-1 text-sm text-red-500">{{ errors.weight }}</p>
            <p v-else class="mt-1 text-xs text-gray-500">
              Min: {{ BUSINESS_RULES.minTransactionWeight }}g, Max: {{ BUSINESS_RULES.maxTransactionWeight }}g
            </p>
          </div>

          <!-- Price per Gram -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Price per Gram (IDR) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.pricePerGram"
              type="number"
              step="1000"
              placeholder="0"
              :class="[
                'w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                errors.pricePerGram ? 'border-red-500' : 'border-gray-200'
              ]"
            />
            <p v-if="errors.pricePerGram" class="mt-1 text-sm text-red-500">{{ errors.pricePerGram }}</p>
          </div>

          <!-- Total Price (Auto-calculated) -->
          <div class="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-blue-900">Total Price</span>
              <span class="text-2xl font-bold text-blue-600 tabular-nums">
                {{ formatCurrency(formData.totalPrice) }}
              </span>
            </div>
            <p class="text-xs text-blue-600 mt-1">Auto-calculated from weight × price per gram</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Add notes about this transaction..."
              :maxlength="BUSINESS_RULES.maxDescriptionLength"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
            />
            <p class="mt-1 text-xs text-gray-500 text-right">
              {{ formData.description?.length || 0 }} / {{ BUSINESS_RULES.maxDescriptionLength }}
            </p>
          </div>

          <!-- Receipt Upload (Placeholder) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Receipt Photo (Optional)
            </label>
            <button
              type="button"
              class="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Icon name="heroicons:camera" class="w-8 h-8" />
              <span class="text-sm">Upload receipt image</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="isSubmitting"
            :class="[
              'w-full py-3.5 rounded-lg font-semibold text-white transition-all',
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
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
            class="w-full py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
