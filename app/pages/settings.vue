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
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <!-- Header with gradient -->
    <header class="sticky top-0 z-40 safe-top">
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"></div>
      <div class="relative flex items-center gap-3 px-5 h-16">
        <button
          @click="router.back()"
          class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
        >
          <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {{ t.settings.title }}
        </h1>
      </div>
    </header>

    <!-- Content -->
    <div class="px-5 py-6 space-y-6 max-w-2xl mx-auto pb-24">
      <!-- Appearance Section -->
      <section class="animate-slide-up">
        <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {{ t.settings.appearance }}
        </h2>
        
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark border border-gray-100/50 dark:border-gray-700/50">
          <!-- Dark Mode Toggle -->
          <div class="p-5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-lg">
                <Icon
                  :name="isDark ? 'heroicons:moon' : 'heroicons:sun'"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-gray-100">{{ t.settings.darkMode }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ t.settings.darkModeDesc }}</p>
              </div>
            </div>
            
            <!-- Premium Toggle Switch -->
            <button
              @click="toggleDarkMode"
              :class="[
                'relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner',
                isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300',
                  isDark ? 'translate-x-7' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </section>

      <!-- Language Section -->
      <section class="animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {{ t.settings.language }}
        </h2>
        
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark divide-y divide-gray-200/50 dark:divide-gray-700/50 border border-gray-100/50 dark:border-gray-700/50">
          <button
            v-for="option in languageOptions"
            :key="option.value"
            @click="handleLanguageChange(option.value as 'en' | 'id')"
            class="w-full p-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all first:rounded-t-2xl last:rounded-b-2xl group"
          >
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ option.flag }}</span>
              <div class="text-left">
                <p class="font-bold text-gray-900 dark:text-gray-100">{{ option.label }}</p>
                <p v-if="locale === option.value" class="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                  Active
                </p>
              </div>
            </div>
            
            <Icon
              v-if="locale === option.value"
              name="heroicons:check-circle"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
            <Icon
              v-else
              name="heroicons:chevron-right"
              class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      <!-- About Section -->
      <section class="animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          {{ t.settings.about }}
        </h2>
        
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark p-6 text-center space-y-4 border border-gray-100/50 dark:border-gray-700/50">
          <!-- App Icon -->
          <div class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-premium relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 animate-pulse-soft"></div>
            <Icon name="heroicons:sparkles" class="w-12 h-12 text-white relative z-10" />
          </div>
          
          <div>
            <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">Gold Savings</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-semibold">{{ t.settings.version }} {{ appVersion }}</p>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {{ t.settings.madeWith }}
          </p>
          
          <!-- Links -->
          <div class="pt-4 space-y-2">
            <button class="w-full px-5 py-3 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
              Privacy Policy
            </button>
            <button class="w-full px-5 py-3 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
              Terms of Service
            </button>
          </div>
        </div>
      </section>

      <!-- Danger Zone -->
      <section class="animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
        <h2 class="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide mb-3">
          Danger Zone
        </h2>
        
        <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 backdrop-blur-sm rounded-2xl shadow-glass dark:shadow-glass-dark border border-red-200/50 dark:border-red-700/50">
          <button class="w-full p-5 flex items-center justify-between hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-all rounded-2xl group">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="heroicons:trash" class="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="text-left">
                <p class="font-bold text-red-600 dark:text-red-400">Clear All Data</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Delete all pockets and transactions</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
