<script setup lang="ts">
import type { ILoginRequest } from '~/types/auth'

definePageMeta({
  layout: 'default',
  showNav: false, // Hide bottom navigation on login page
  middleware: 'guest', // Redirect if already logged in
})

const { t } = useI18n()
const route = useRoute()
const { login, isLoading, error } = useAuth()

useHead({
  title: computed(() => `Login - EmasGo`),
})

// Form state
const formData = ref<ILoginRequest>({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = ref({
  email: '',
  password: '',
})

const showError = ref(false)
const errorMessage = ref('')

// Validation
const validateForm = () => {
  let isValid = true
  errors.value = { email: '', password: '' }

  // Email validation
  if (!formData.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  // Password validation
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return

  // Clear previous errors
  showError.value = false
  errorMessage.value = ''

  const success = await login(formData.value)

  if (success) {
    // Clear form for security
    formData.value.password = ''
    
    // Get redirect path from query or default to home
    const redirectPath = (route.query.redirect as string) || '/'
    
    // Small delay to ensure state is updated
    await nextTick()
    
    // Navigate to destination
    await navigateTo(redirectPath, { replace: true })
  } else {
    // Show error message with more context
    showError.value = true
    const apiError = error.value
    
    if (apiError?.includes('401') || apiError?.includes('Unauthorized')) {
      errorMessage.value = 'Invalid email or password. Please try again.'
    } else if (apiError?.includes('Network') || apiError?.includes('fetch')) {
      errorMessage.value = 'Unable to connect to server. Please check your internet connection.'
    } else {
      errorMessage.value = apiError || 'Login failed. Please check your credentials and try again.'
    }
  }
}

// Demo credentials hint
const useDemoCredentials = () => {
  formData.value.email = 'john.doe@example.com'
  formData.value.password = 'SecurePass123'
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

    <!-- Login Card -->
    <div class="relative w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8 animate-slide-up">
        <div class="flex justify-center mb-4">
          <BaseLogo size="xl" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gold-600 via-amber-600 to-gold-700 dark:from-gold-400 dark:via-amber-400 dark:to-gold-500 bg-clip-text text-transparent mb-2">
          EmasGo
        </h1>
        <p class="text-gray-600 dark:text-gray-400 font-medium">
          Welcome back! Please login to continue
        </p>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-premium border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error Alert -->
          <div v-if="showError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-red-800 dark:text-red-200">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div class="relative">
              <Icon name="heroicons:envelope" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="formData.email"
                type="email"
                placeholder="your@email.com"
                :class="[
                  'w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  errors.email ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div class="relative">
              <Icon name="heroicons:lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                :class="[
                  'w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  errors.password ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-500 font-semibold">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Remember me
              </span>
            </label>
            <NuxtLink
              to="/forgot-password"
              class="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
            <span>{{ isLoading ? 'Logging in...' : 'Login' }}</span>
          </button>

          <!-- Demo Credentials -->
          <div class="text-center">
            <button
              type="button"
              @click="useDemoCredentials"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Use demo credentials
            </button>
          </div>
        </form>
      </div>

      <!-- Sign Up Link -->
      <div class="text-center mt-6 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <p class="text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink to="/signup" class="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-1">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
