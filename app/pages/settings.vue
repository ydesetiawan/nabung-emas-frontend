<script setup lang="ts">
definePageMeta({
  layout: 'default',
  showNav: false, // Hide bottom nav on settings page
})

const { t, locale, setLocale } = useI18n()
const { isDark, toggleDarkMode } = useDarkMode()

useHead({
  title: computed(() => `${t.value.settings.title} - Gold Savings`),
})

const router = useRouter()

const languageOptions = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
]

const handleLanguageChange = (newLocale: 'en' | 'id') => {
  setLocale(newLocale)
}

const appVersion = '1.0.0'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 safe-top">
      <div class="flex items-center gap-3 px-4 h-16">
        <button
          @click="router.back()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ t.settings.title }}</h1>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <!-- Appearance Section -->
      <section>
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {{ t.settings.appearance }}
        </h2>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Dark Mode Toggle -->
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gray-900 dark:bg-gray-700 flex items-center justify-center">
                <Icon
                  :name="isDark ? 'heroicons:moon' : 'heroicons:sun'"
                  class="w-5 h-5 text-white"
                />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ t.settings.darkMode }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t.settings.darkModeDesc }}</p>
              </div>
            </div>
            
            <!-- Toggle Switch -->
            <button
              @click="toggleDarkMode"
              :class="[
                'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                isDark ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                  isDark ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </section>

      <!-- Language Section -->
      <section>
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {{ t.settings.language }}
        </h2>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <button
            v-for="option in languageOptions"
            :key="option.value"
            @click="handleLanguageChange(option.value as 'en' | 'id')"
            class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ option.flag }}</span>
              <div class="text-left">
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ option.label }}</p>
                <p v-if="locale === option.value" class="text-sm text-blue-600 dark:text-blue-400">
                  {{ t.common.success }}
                </p>
              </div>
            </div>
            
            <Icon
              v-if="locale === option.value"
              name="heroicons:check-circle"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </button>
        </div>
      </section>

      <!-- About Section -->
      <section>
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {{ t.settings.about }}
        </h2>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center space-y-4">
          <!-- App Icon -->
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon name="heroicons:sparkles" class="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Gold Savings</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t.settings.version }} {{ appVersion }}</p>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t.settings.madeWith }}
          </p>
          
          <!-- Links -->
          <div class="pt-4 space-y-2">
            <button class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors">
              Privacy Policy
            </button>
            <button class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </section>

      <!-- Danger Zone -->
      <section>
        <h2 class="text-sm font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide mb-3">
          Danger Zone
        </h2>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <button class="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-xl">
            <div class="flex items-center gap-3">
              <Icon name="heroicons:trash" class="w-5 h-5 text-red-600 dark:text-red-400" />
              <div class="text-left">
                <p class="font-medium text-red-600 dark:text-red-400">Clear All Data</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Delete all pockets and transactions</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
