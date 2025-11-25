<script setup lang="ts">
import { mockPockets } from '../../utils/mockData'
import { GOLD_BRAND_LIST, BUSINESS_RULES } from '../../utils/constants'
import type { ITransactionCreate } from '../../types/transaction'

const props = defineProps<{
  open: boolean
  defaultPocketId?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': [transaction: ITransactionCreate]
}>()

const transactionStore = useTransactionStore()
const { calculateTotalPrice } = useGoldCalculator()

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
    
    emit('success', formData.value)
    emit('update:open', false)
    
    // Reset form
    resetForm()
  } catch (error) {
    console.error('Failed to create transaction:', error)
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
}

const close = () => {
  emit('update:open', false)
  resetForm()
}

// Watch for open state changes
watch(() => props.open, (isOpen) => {
  if (isOpen && props.defaultPocketId) {
    formData.value.pocketId = props.defaultPocketId
  }
})
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
        class="fixed inset-0 bg-black/50 z-50"
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
        class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col max-w-md mx-auto"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Add Transaction</h2>
          <button
            @click="close"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Pocket Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pocket <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.pocketId"
              :class="[
                'w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                errors.pocketId ? 'border-red-500' : 'border-gray-200'
              ]"
            >
              <option value="" disabled>Select a pocket</option>
              <option v-for="pocket in mockPockets" :key="pocket.id" :value="pocket.id">
                {{ pocket.name }}
              </option>
            </select>
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
