<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDeleting?: boolean
  deletingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Delete',
  cancelText: 'Cancel',
  isDeleting: false,
  deletingText: 'Deleting...'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const handleClose = () => {
  if (!props.isDeleting) {
    emit('update:open', false)
  }
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
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
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="handleClose"
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
            v-if="open"
            class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <!-- Gradient Header -->
            <div class="relative bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 p-6 text-center">
              <div class="absolute inset-0 bg-black/10"></div>
              <div class="relative">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30">
                  <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1">{{ title }}</h3>
                <p class="text-white/80 text-sm font-medium">This action cannot be undone</p>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700/50 rounded-xl p-4">
                <p class="text-sm text-red-800 dark:text-red-300 font-medium text-center" v-html="message"></p>
              </div>

              <div class="flex gap-3">
                <button
                  @click="handleClose"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ cancelText }}
                </button>
                <button
                  @click="handleConfirm"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  <Icon v-if="isDeleting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                  <Icon v-else name="heroicons:trash" class="w-5 h-5" />
                  <span>{{ isDeleting ? deletingText : confirmText }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
