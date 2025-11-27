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
  'success': [transaction: any]
  'update': [transaction: any]
}>()

// Use composables directly
const transactionApi = useTransactionApi()
const pocketApi = usePocketApi()
const typePocketStore = useTypePocketStore()
const { calculateTotalPrice } = useGoldCalculator()

// Local state for pockets
const pockets = ref<any[]>([])

// Pocket search and selection
const pocketSearchQuery = ref('')

// Fetch data on mount
onMounted(async () => {
  try {
    const [pocketsData] = await Promise.all([
      pocketApi.fetchPockets(),
      typePocketStore.fetchTypePockets()
    ])
    pockets.value = pocketsData
  } catch (err) {
    console.error('Failed to load data:', err)
  }
})

// Filtered pockets based on search
const filteredPockets = computed(() => {
  const query = pocketSearchQuery.value.toLowerCase()
  if (!query) return pockets.value
  
  return pockets.value.filter(p => {
    const typePocket = typePocketStore.getTypePocketById(p.typePocketId)
    return p.name.toLowerCase().includes(query) ||
           typePocket?.name.toLowerCase().includes(query)
  })
})

const getTypePocket = (id: string) => {
  return typePocketStore.getTypePocketById(id)
}

const getPocketColor = (typeId: string) => {
  const type = typePocketStore.getTypePocketById(typeId)
  return type?.color || 'blue'
}

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    gold: 'bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400 border-gold-200 dark:border-gold-800',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }
  return colors[color] || colors.blue
}

const selectedPocket = computed(() => {
  return pockets.value.find(p => p.id === formData.value.pocketId)
})

const selectPocket = (pocketId: string) => {
  formData.value.pocketId = pocketId
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
const apiError = ref<string>('')

// Initialize form with edit data or default pocket
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
    } else {
      resetForm()
    }
  }
})

// Auto-calculate total price when weight or price per gram changes
watch([() => formData.value.weight, () => formData.value.pricePerGram], ([weight, price]) => {
  if (weight && price) {
    formData.value.totalPrice = calculateTotalPrice(weight, price)
  }
})

// Currency formatting for price per gram input
const pricePerGramDisplay = ref('')
const isPricePerGramFocused = ref(false)

// Format price per gram for display
const formatPricePerGramDisplay = () => {
  if (formData.value.pricePerGram && !isPricePerGramFocused.value) {
    pricePerGramDisplay.value = formatCurrency(formData.value.pricePerGram)
  } else if (isPricePerGramFocused.value) {
    pricePerGramDisplay.value = formData.value.pricePerGram ? formData.value.pricePerGram.toString() : ''
  } else {
    pricePerGramDisplay.value = ''
  }
}

// Watch for changes to format display
watch(() => formData.value.pricePerGram, formatPricePerGramDisplay)
watch(() => isPricePerGramFocused.value, formatPricePerGramDisplay)

// Handle price per gram input
const handlePricePerGramFocus = () => {
  isPricePerGramFocused.value = true
  formatPricePerGramDisplay()
}

const handlePricePerGramBlur = () => {
  isPricePerGramFocused.value = false
  formatPricePerGramDisplay()
}

const handlePricePerGramInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/[^0-9]/g, '')
  formData.value.pricePerGram = value ? parseInt(value) : 0
}

// Initialize display when opening
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    formatPricePerGramDisplay()
  }
})

// Total price inline editing
const isTotalPriceEditing = ref(false)
const totalPriceInput = ref<HTMLInputElement | null>(null)

// Auto-focus when entering edit mode
watch(isTotalPriceEditing, (isEditing) => {
  if (isEditing) {
    nextTick(() => {
      totalPriceInput.value?.focus()
      totalPriceInput.value?.select()
    })
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

  if (!formData.value.transactionDate) {
    errors.value.transactionDate = 'Transaction date is required'
  }

  // Check if date is not in the future
  const selectedDate = new Date(formData.value.transactionDate)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  if (selectedDate > today) {
    errors.value.transactionDate = 'Transaction date cannot be in the future'
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

  if (formData.value.pricePerGram > BUSINESS_RULES.maxPricePerGram) {
    errors.value.pricePerGram = `Price cannot exceed ${formatCurrency(BUSINESS_RULES.maxPricePerGram)}`
  }

  if (formData.value.description && formData.value.description.length > 500) {
    errors.value.description = 'Description cannot exceed 500 characters'
  }

  return Object.keys(errors.value).length === 0
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  apiError.value = ''

  try {
    if (props.editMode && props.editData) {
      // Update existing transaction
      const updated = await transactionApi.updateTransaction(props.editData.id, formData.value)
      
      if (updated) {
        emit('update', updated)
        emit('update:open', false)
        resetForm()
      }
    } else {
      // Create new transaction
      const created = await transactionApi.createTransaction(formData.value)
      
      if (created) {
        emit('success', created)
        emit('update:open', false)
        resetForm()
      }
    }
  } catch (error: any) {
    console.error('Failed to save transaction:', error)
    
    // Parse error message for user-friendly display
    if (error.message?.includes('pocket_id')) {
      apiError.value = 'Invalid pocket selected. Please try again.'
    } else if (error.message?.includes('brand')) {
      apiError.value = 'Invalid brand selected. Please choose a valid brand.'
    } else if (error.message?.includes('weight')) {
      apiError.value = 'Invalid weight value. Please check your input.'
    } else if (error.message?.includes('price')) {
      apiError.value = 'Invalid price value. Please check your input.'
    } else if (error.message?.includes('total_price')) {
      apiError.value = 'Total price mismatch. Please verify weight and price per gram.'
    } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      apiError.value = 'Unable to connect to server. Please check your internet connection.'
    } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      apiError.value = 'Your session has expired. Please login again.'
      await navigateTo('/login')
    } else {
      apiError.value = error.message || 'Failed to save transaction. Please try again.'
    }
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
  apiError.value = ''
  pocketSearchQuery.value = ''
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
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-t-3xl"></div>
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
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- API Error Alert -->
          <div v-if="apiError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-red-800 dark:text-red-200">{{ apiError }}</p>
              </div>
              <button 
                @click="apiError = ''" 
                class="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>

          <!-- Empty pockets state -->
          <div v-if="pockets.length === 0" class="text-center py-8">
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">No pockets available. Create one first!</p>
          </div>

          <!-- Pocket Selection - Premium Banking UI -->
          <div v-else>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Select Pocket <span class="text-red-500">*</span>
            </label>
            
            <!-- Search -->
            <div class="relative mb-4">
              <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="pocketSearchQuery"
                type="text"
                placeholder="Search pockets..."
                class="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all"
              />
            </div>

            <!-- Pocket Grid - Premium Cards -->
            <div class="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
              <button
                v-for="pocket in filteredPockets"
                :key="pocket.id"
                type="button"
                @click="selectPocket(pocket.id)"
                :class="[
                  'p-4 rounded-2xl border-2 transition-all text-left shadow-glass dark:shadow-glass-dark',
                  formData.pocketId === pocket.id
                    ? getColorClass(getPocketColor(pocket.typePocketId)) + ' scale-105 shadow-premium'
                    : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
                ]"
              >
                <div class="flex items-center gap-3">
                  <!-- Pocket Icon -->
                  <div :class="[
                    'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg',
                    formData.pocketId === pocket.id 
                      ? 'bg-white/50 dark:bg-black/20' 
                      : getColorClass(getPocketColor(pocket.typePocketId)).split(' ')[0] + ' ' + getColorClass(getPocketColor(pocket.typePocketId)).split(' ')[1]
                  ]">
                    <Icon 
                      :name="getTypePocket(pocket.typePocketId)?.icon || 'heroicons:wallet'" 
                      class="w-7 h-7"
                    />
                  </div>

                  <!-- Pocket Info -->
                  <div class="flex-1 min-w-0">
                    <p :class="[
                      'text-base font-bold mb-0.5',
                      formData.pocketId === pocket.id ? '' : 'text-gray-900 dark:text-gray-100'
                    ]">{{ pocket.name }}</p>
                    
                    <p :class="[
                      'text-sm font-medium mb-1',
                      formData.pocketId === pocket.id ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'
                    ]">
                      {{ getTypePocket(pocket.typePocketId)?.name }}
                    </p>

                    <!-- Stats -->
                    <div :class="[
                      'text-xs font-bold',
                      formData.pocketId === pocket.id ? 'opacity-100' : 'text-gray-700 dark:text-gray-300'
                    ]">
                      <div class="flex items-center gap-3">
                        <span class="tabular-nums flex items-center gap-1">
                          <Icon name="heroicons:scale" class="w-3 h-3" />
                          {{ formatWeight(pocket.aggregateTotalWeight) }}
                        </span>
                        <span class="tabular-nums flex items-center gap-1">
                          <Icon name="heroicons:banknotes" class="w-3 h-3" />
                          {{ formatCompactCurrency(pocket.aggregateTotalPrice) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Checkmark -->
                  <Icon 
                    v-if="formData.pocketId === pocket.id"
                    name="heroicons:check-circle-solid" 
                    class="w-7 h-7 shrink-0" 
                  />
                </div>
              </button>
            </div>
            
            <p v-if="errors.pocketId" class="mt-3 text-sm text-red-500 font-semibold">{{ errors.pocketId }}</p>
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
              :class="[
                'w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 font-medium shadow-glass dark:shadow-glass-dark',
                errors.transactionDate ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
              ]"
            />
            <p v-if="errors.transactionDate" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.transactionDate }}</p>
          </div>

          <!-- Gold Brand - Apple Style Pills -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
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
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
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
              :value="pricePerGramDisplay"
              @input="handlePricePerGramInput"
              @focus="handlePricePerGramFocus"
              @blur="handlePricePerGramBlur"
              type="text"
              placeholder="Rp 0"
              :class="[
                'w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 font-medium shadow-glass dark:shadow-glass-dark',
                errors.pricePerGram ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
              ]"
            />
            <p v-if="errors.pricePerGram" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.pricePerGram }}</p>
          </div>

          <!-- Total Price (Editable with gradient card UI) -->
          <div 
            @click="isTotalPriceEditing = true"
            :class="[
              'p-5 rounded-2xl border-2 shadow-glass dark:shadow-glass-dark transition-all cursor-pointer',
              isTotalPriceEditing 
                ? 'bg-white dark:bg-slate-800 border-blue-500 dark:border-blue-600' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-200/50 dark:border-blue-700/50 hover:scale-105'
            ]"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">Total Price</span>
              <div v-if="!isTotalPriceEditing" class="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {{ formatCurrency(formData.totalPrice) }}
              </div>
              <input
                v-else
                ref="totalPriceInput"
                v-model.number="formData.totalPrice"
                @blur="isTotalPriceEditing = false"
                @keyup.enter="isTotalPriceEditing = false"
                type="number"
                step="1000"
                class="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums bg-transparent border-none outline-none focus:ring-0 text-right w-full"
                placeholder="0"
              />
            </div>
            <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {{ isTotalPriceEditing ? '✏️ Editing... Press Enter or click away to save' : '💡 Click to edit or auto-calculated from Weight × Price per Gram' }}
            </p>
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
              maxlength="500"
              class="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark"
            />
            <div class="flex items-center justify-between mt-2">
              <p v-if="errors.description" class="text-sm text-red-500 font-semibold">{{ errors.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 ml-auto font-medium">
                {{ formData.description?.length || 0 }} / 500
              </p>
            </div>
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
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95'
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
