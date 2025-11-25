<script setup lang="ts">
import { mockTypePockets } from '../../utils/mockData'
import { BUSINESS_RULES } from '../../utils/constants'
import type { IPocketCreate } from '../../types/pocket'

const props = defineProps<{
  open: boolean
  editMode?: boolean
  editData?: IPocketCreate & { id: string }
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': [pocket: IPocketCreate]
  'update': [pocket: IPocketCreate & { id: string }]
}>()

// Form state
const formData = ref<IPocketCreate>({
  typePocketId: '',
  name: '',
  description: '',
  targetWeight: undefined,
})

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Initialize form with edit data
watch(() => props.open, (isOpen) => {
  if (isOpen && props.editMode && props.editData) {
    formData.value = {
      typePocketId: props.editData.typePocketId,
      name: props.editData.name,
      description: props.editData.description || '',
      targetWeight: props.editData.targetWeight,
    }
  }
})

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

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.typePocketId) {
    errors.value.typePocketId = 'Please select a pocket type'
  }

  if (!formData.value.name || formData.value.name.trim().length < 3) {
    errors.value.name = 'Name must be at least 3 characters'
  }

  if (formData.value.name.length > 50) {
    errors.value.name = 'Name cannot exceed 50 characters'
  }

  if (formData.value.targetWeight && formData.value.targetWeight < 0) {
    errors.value.targetWeight = 'Target weight must be positive'
  }

  if (formData.value.targetWeight && formData.value.targetWeight > 10000) {
    errors.value.targetWeight = 'Target weight cannot exceed 10,000g'
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
    console.error('Failed to save pocket:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    typePocketId: '',
    name: '',
    description: '',
    targetWeight: undefined,
  }
  errors.value = {}
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
            {{ editMode ? 'Edit Pocket' : 'Create New Pocket' }}
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
          <!-- Pocket Type Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Pocket Type <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 gap-3">
              <button
                v-for="type in mockTypePockets"
                :key="type.id"
                type="button"
                @click="formData.typePocketId = type.id; errors.typePocketId = ''"
                :class="[
                  'p-4 rounded-xl border-2 transition-all text-left',
                  formData.typePocketId === type.id
                    ? getColorClass(type.color)
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
                    formData.typePocketId === type.id 
                      ? 'bg-white/50 dark:bg-black/20' 
                      : getColorClass(type.color).split(' ')[0] + ' ' + getColorClass(type.color).split(' ')[1]
                  ]">
                    <Icon :name="type.icon" class="w-6 h-6" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p :class="[
                      'text-base font-semibold',
                      formData.typePocketId === type.id ? '' : 'text-gray-900 dark:text-gray-100'
                    ]">
                      {{ type.name }}
                    </p>
                    <p :class="[
                      'text-sm mt-0.5',
                      formData.typePocketId === type.id ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'
                    ]">
                      {{ type.description }}
                    </p>
                  </div>
                  <Icon 
                    v-if="formData.typePocketId === type.id"
                    name="heroicons:check-circle-solid" 
                    class="w-6 h-6 shrink-0" 
                  />
                </div>
              </button>
            </div>
            <p v-if="errors.typePocketId" class="mt-2 text-sm text-red-500">{{ errors.typePocketId }}</p>
          </div>

          <!-- Pocket Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pocket Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="e.g., Emergency Fund, Dream Wedding"
              maxlength="50"
              :class="[
                'w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              ]"
            />
            <div class="flex items-center justify-between mt-1">
              <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 ml-auto">{{ formData.name.length }}/50</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Add notes about this pocket..."
              :maxlength="BUSINESS_RULES.maxDescriptionLength"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
              {{ formData.description?.length || 0 }} / {{ BUSINESS_RULES.maxDescriptionLength }}
            </p>
          </div>

          <!-- Target Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Weight (Optional)
            </label>
            <div class="relative">
              <input
                v-model.number="formData.targetWeight"
                type="number"
                step="0.1"
                placeholder="0.0"
                :class="[
                  'w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                  errors.targetWeight ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                ]"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">grams</span>
            </div>
            <p v-if="errors.targetWeight" class="mt-1 text-sm text-red-500">{{ errors.targetWeight }}</p>
            <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Set a goal for how much gold you want to save in this pocket
            </p>
          </div>
        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
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
            <span v-else>{{ editMode ? 'Update Pocket' : 'Create Pocket' }}</span>
          </button>
          
          <button
            type="button"
            @click="close"
            class="w-full py-3 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
