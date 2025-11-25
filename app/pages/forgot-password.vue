<script setup lang="ts">

definePageMeta({
  layout: 'default',
  showNav: false, // Hide bottom navigation on forgot password page
})

const { t } = useI18n()

useHead({
  title: computed(() => `Forgot Password - Gold Savings`),
})

// Form state
const email = ref('')
const error = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

// Validation
const validateEmail = () => {
  error.value = ''

  if (!email.value) {
    error.value = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Invalid email format'
    return false
  }

  return true
}

// Handle reset password
const handleResetPassword = async () => {
  if (!validateEmail()) return

  isLoading.value = true

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    isSuccess.value = true
    // In real app, this would call forgot password API
  }, 1500)
}

// Resend email
const resendEmail = () => {
  isSuccess.value = false
  handleResetPassword()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-5">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 2s;"></div>
    </div>

    <!-- Forgot Password Card -->
    <div class="relative w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8 animate-slide-up">
        <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-gold-500 to-amber-600 dark:from-gold-600 dark:to-amber-700 flex items-center justify-center shadow-premium">
          <Icon name="heroicons:key" class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          Forgot Password?
        </h1>
        <p class="text-gray-600 dark:text-gray-400 font-medium px-4">
          {{ isSuccess ? 'Check your email for reset instructions' : 'No worries, we\'ll send you reset instructions' }}
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-premium border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        
        <!-- Success State -->
        <div v-if="isSuccess" class="text-center space-y-6">
          <!-- Success Icon -->
          <div class="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Icon name="heroicons:check-circle" class="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <!-- Success Message -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Email Sent!</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              We've sent a password reset link to
              <span class="font-semibold text-gray-900 dark:text-gray-100">{{ email }}</span>
            </p>
          </div>

          <!-- Instructions -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <Icon name="heroicons:information-circle" class="w-4 h-4 inline mr-1 text-blue-600 dark:text-blue-400" />
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <NuxtLink
              to="/login"
              class="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-center"
            >
              Back to Login
            </NuxtLink>

            <button
              @click="resendEmail"
              class="w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
            >
              Didn't receive the email? Resend
            </button>
          </div>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleResetPassword" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div class="relative">
              <Icon name="heroicons:envelope" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="email"
                type="email"
                placeholder="your@email.com"
                :class="[
                  'w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  error ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
            </div>
            <p v-if="error" class="mt-2 text-sm text-red-500 font-semibold">{{ error }}</p>
          </div>

          <!-- Reset Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
            <span>{{ isLoading ? 'Sending...' : 'Send Reset Link' }}</span>
          </button>

          <!-- Back to Login -->
          <div class="text-center">
            <NuxtLink
              to="/login"
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4" />
              Back to Login
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Help Text -->
      <div class="text-center mt-6 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Need help?
          <button class="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-1">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
