<script setup lang="ts">

definePageMeta({
  layout: 'default',
  showNav: false, // Hide bottom navigation on signup page
})

const { t } = useI18n()

useHead({
  title: computed(() => `Sign Up - Gold Savings`),
})

// Form state
const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

const errors = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: '',
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation
const validateForm = () => {
  let isValid = true
  errors.value = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', agreeToTerms: '' }

  // Full name validation
  if (!formData.value.fullName) {
    errors.value.fullName = 'Full name is required'
    isValid = false
  } else if (formData.value.fullName.length < 3) {
    errors.value.fullName = 'Name must be at least 3 characters'
    isValid = false
  }

  // Email validation
  if (!formData.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  // Phone validation
  if (!formData.value.phone) {
    errors.value.phone = 'Phone number is required'
    isValid = false
  } else if (!/^[+]?[\d\s-()]+$/.test(formData.value.phone)) {
    errors.value.phone = 'Invalid phone number'
    isValid = false
  }

  // Password validation
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.password)) {
    errors.value.password = 'Password must contain uppercase, lowercase, and number'
    isValid = false
  }

  // Confirm password validation
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Terms validation
  if (!formData.value.agreeToTerms) {
    errors.value.agreeToTerms = 'You must agree to the terms and conditions'
    isValid = false
  }

  return isValid
}

// Handle signup
const handleSignup = async () => {
  if (!validateForm()) return

  isLoading.value = true

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    // In real app, this would call signup API and store token
    // For now, just redirect to dashboard
    navigateTo('/')
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-5 py-10">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 2s;"></div>
    </div>

    <!-- Signup Card -->
    <div class="relative w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8 animate-slide-up">
        <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-gold-500 to-amber-600 dark:from-gold-600 dark:to-amber-700 flex items-center justify-center shadow-premium">
          <Icon name="heroicons:sparkles" class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p class="text-gray-600 dark:text-gray-400 font-medium">
          Start your gold savings journey today
        </p>
      </div>

      <!-- Signup Form Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-premium border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <div class="relative">
              <Icon name="heroicons:user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="formData.fullName"
                type="text"
                placeholder="John Doe"
                :class="[
                  'w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  errors.fullName ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
            </div>
            <p v-if="errors.fullName" class="mt-1.5 text-xs text-red-500 font-semibold">{{ errors.fullName }}</p>
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
            <p v-if="errors.email" class="mt-1.5 text-xs text-red-500 font-semibold">{{ errors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Phone Number
            </label>
            <div class="relative">
              <Icon name="heroicons:phone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                :class="[
                  'w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  errors.phone ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
            </div>
            <p v-if="errors.phone" class="mt-1.5 text-xs text-red-500 font-semibold">{{ errors.phone }}</p>
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
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :class="[
                  'w-full pl-12 pr-12 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  errors.password ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1.5 text-xs text-red-500 font-semibold">{{ errors.password }}</p>
            <p v-else class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Min 8 chars, uppercase, lowercase, number</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <div class="relative">
              <Icon name="heroicons:lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :class="[
                  'w-full pl-12 pr-12 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark transition-all',
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                ]"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Icon :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1.5 text-xs text-red-500 font-semibold">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms & Conditions -->
          <div>
            <label class="flex items-start gap-3 cursor-pointer group">
              <input
                v-model="formData.agreeToTerms"
                type="checkbox"
                class="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                I agree to the
                <button type="button" class="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Terms and Conditions
                </button>
                and
                <button type="button" class="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Privacy Policy
                </button>
              </span>
            </label>
            <p v-if="errors.agreeToTerms" class="mt-1.5 text-xs text-red-500 font-semibold">{{ errors.agreeToTerms }}</p>
          </div>

          <!-- Signup Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-6"
          >
            <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
            <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
          </button>
        </form>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-6 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <p class="text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-1">
            Login
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
