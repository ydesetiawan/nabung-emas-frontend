<script setup lang="ts">
interface Props {
  open: boolean
  isLoggingOut?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoggingOut: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const handleClose = () => {
  if (!props.isLoggingOut) {
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
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
        @click.self="handleClose"
      >
        <div
          class="bg-white dark:bg-slate-800 rounded-3xl shadow-premium max-w-sm w-full p-6 space-y-4 animate-scale-in"
          @click.stop
        >
          <!-- Icon -->
          <div class="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-8 h-8 text-white" />
          </div>

          <!-- Title & Message -->
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Logout Confirmation
            </h3>
            <p class="text-gray-600 dark:text-gray-400 font-medium">
              Are you sure you want to logout? You'll need to login again to access your account.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              @click="handleClose"
              :disabled="isLoggingOut"
              class="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Cancel
            </button>
            <button
              @click="handleConfirm"
              :disabled="isLoggingOut"
              class="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Icon v-if="isLoggingOut" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
              <span>{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
