<script setup lang="ts">

import type {IPocketCreate} from "@/types/pocket";

const props = defineProps<{
  open: boolean
  editMode?: boolean
  editData?: IPocketCreate & { id: string }
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': [pocket: any]
  'update': [pocket: any]
}>()

// Use composables
const pocketApi = usePocketApi()
const typePocketStore = useTypePocketStore()

// Form state
const formData = ref<IPocketCreate>({
  typePocketId: '',
  name: '',
  description: '',
  targetWeight: undefined,
})

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})
const apiError = ref<string>('')

// Fetch type pockets on mount
onMounted(async () => {
  try {
    await typePocketStore.fetchTypePockets()
  } catch (err) {
    console.error('Failed to load pocket types:', err)
  }
})

// Initialize form with edit data
watch(() => props.open, (isOpen) => {
  if (isOpen && props.editMode && props.editData) {
    // Handle both camelCase and snake_case from API
    const typePocketId = (props.editData as any).typePocketId || (props.editData as any).type_pocket_id
    
    formData.value = {
      typePocketId: typePocketId,
      name: props.editData.name,
      description: props.editData.description || '',
      targetWeight: props.editData.targetWeight,
    }
  } else if (isOpen) {
    // Reset form when opening in create mode
    resetForm()
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

  if (formData.value.name.length > 100) {
    errors.value.name = 'Name cannot exceed 100 characters'
  }

  if (formData.value.description && formData.value.description.length > 500) {
    errors.value.description = 'Description cannot exceed 500 characters'
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
  apiError.value = ''

  try {
    if (props.editMode && props.editData) {
      // Update existing pocket
      const updated = await pocketApi.updatePocket(props.editData.id, formData.value)
      
      if (updated) {
        emit('update', updated)
        emit('update:open', false)
        resetForm()
      }
    } else {
      // Create new pocket
      const created = await pocketApi.createPocket(formData.value)
      
      if (created) {
        emit('success', created)
        emit('update:open', false)
        resetForm()
      }
    }
  } catch (error: any) {
    console.error('Failed to save pocket:', error)
    
    // Parse error message for user-friendly display
    if (error.message?.includes('type_pocket_id')) {
      apiError.value = 'Invalid pocket type selected. Please try again.'
    } else if (error.message?.includes('name')) {
      apiError.value = 'Invalid pocket name. Please check your input.'
    } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      apiError.value = 'Unable to connect to server. Please check your internet connection.'
    } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      apiError.value = 'Your session has expired. Please login again.'
      // Optionally redirect to login
      await navigateTo('/login')
    } else {
      apiError.value = error.message || 'Failed to save pocket. Please try again.'
    }
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
  apiError.value = ''
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
              {{ editMode ? 'Edit Pocket' : 'Create New Pocket' }}
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

          <!-- Loading State for Type Pockets -->
          <div v-if="typePocketStore.isLoading" class="text-center py-8">
            <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading pocket types...</p>
          </div>

          <!-- Pocket Type Selection -->
          <div v-else>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Pocket Type <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 gap-3">
              <button
                v-for="type in typePocketStore.typePocketList"
                :key="type.id"
                type="button"
                @click="formData.typePocketId = type.id; errors.typePocketId = ''"
                :class="[
                  'p-4 rounded-2xl border-2 transition-all text-left shadow-glass dark:shadow-glass-dark',
                  formData.typePocketId === type.id
                    ? getColorClass(type.color) + ' scale-105 shadow-premium'
                    : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg',
                    formData.typePocketId === type.id 
                      ? 'bg-white/50 dark:bg-black/20' 
                      : getColorClass(type.color).split(' ')[0] + ' ' + getColorClass(type.color).split(' ')[1]
                  ]">
                    <Icon :name="type.icon" class="w-7 h-7" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p :class="[
                      'text-base font-bold',
                      formData.typePocketId === type.id ? '' : 'text-gray-900 dark:text-gray-100'
                    ]">
                      {{ type.name }}
                    </p>
                    <p :class="[
                      'text-sm mt-0.5 font-medium',
                      formData.typePocketId === type.id ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'
                    ]">
                      {{ type.description }}
                    </p>
                  </div>
                  <Icon 
                    v-if="formData.typePocketId === type.id"
                    name="heroicons:check-circle-solid" 
                    class="w-7 h-7 shrink-0" 
                  />
                </div>
              </button>
            </div>
            <p v-if="errors.typePocketId" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.typePocketId }}</p>
          </div>

          <!-- Pocket Name -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Pocket Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="e.g., Emergency Fund, Dream Wedding"
              maxlength="100"
              :class="[
                'w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark',
                errors.name ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
              ]"
            />
            <div class="flex items-center justify-between mt-2">
              <p v-if="errors.name" class="text-sm text-red-500 font-semibold">{{ errors.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 ml-auto font-medium">{{ formData.name.length }}/100</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Add notes about this pocket..."
              maxlength="500"
              class="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark"
            />
            <div class="flex items-center justify-between mt-2">
              <p v-if="errors.description" class="text-sm text-red-500 font-semibold">{{ errors.description }}</p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 ml-auto font-medium">
                {{ formData.description?.length || 0 }} / 500
              </p>
            </div>
          </div>

          <!-- Target Weight -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Target Weight (Optional)
            </label>
            <div class="relative">
              <input
                v-model.number="formData.targetWeight"
                type="number"
                step="0.1"
                placeholder="0.0"
                :class="[
                  'w-full px-4 py-3.5 pr-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark',
                  errors.targetWeight ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-bold">grams</span>
            </div>
            <p v-if="errors.targetWeight" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.targetWeight }}</p>
            <p v-else class="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              Set a goal for how much gold you want to save in this pocket
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
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95'
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
            class="w-full py-3.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
