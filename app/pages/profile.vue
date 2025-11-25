<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t.value.profile.title} - Gold Savings`),
})

// Mock user data
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+62 812 3456 7890',
  joinDate: '2024-01-15',
  avatar: '', // Empty for now, will use initials
})

const stats = computed(() => ({
  totalPockets: mockPockets.length,
  totalTransactions: mockTransactions.length,
  totalWeight: mockPockets.reduce((sum, p) => sum + p.aggregateTotalWeight, 0),
  totalValue: mockPockets.reduce((sum, p) => sum + p.aggregateTotalPrice, 0),
}))

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatJoinDate = (date: string) => {
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

const handleLogout = () => {
  // In real app, this would call logout API and clear token
  // For now, just redirect to login page
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-24">
    <!-- Header with gradient -->
    <header class="sticky top-0 z-40 safe-top">
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"></div>
      <div class="relative px-5 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink 
            to="/"
            class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
          >
            <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </NuxtLink>
          <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Profile
          </h1>
          <NuxtLink 
            to="/settings"
            class="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-5 py-6 space-y-6">
      <!-- Profile Card -->
      <div class="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-6 shadow-premium animate-slide-up">
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        
        <div class="relative">
          <!-- Avatar -->
          <div class="flex justify-center mb-4">
            <div class="relative">
              <div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white/30">
                {{ getInitials(user.name) }}
              </div>
              <button class="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Icon name="heroicons:camera" class="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          <!-- User Info -->
          <div class="text-center text-white">
            <h2 class="text-2xl font-bold mb-1">{{ user.name }}</h2>
            <p class="text-white/80 text-sm font-medium mb-1">{{ user.email }}</p>
            <p class="text-white/70 text-xs font-medium">{{ t.profile.memberSince }} {{ formatJoinDate(user.joinDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-3 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Icon name="heroicons:wallet" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.pockets }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ stats.totalPockets }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.transactions }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ stats.totalTransactions }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
              <Icon name="heroicons:scale" class="w-5 h-5 text-gold-600 dark:text-gold-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.totalGold }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatWeight(stats.totalWeight) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Icon name="heroicons:currency-dollar" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.totalValue }}</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ formatCompactCurrency(stats.totalValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Information -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{{ t.profile.accountInfo }}</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Icon name="heroicons:user" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.fullName }}</p>
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user.name }}</p>
              </div>
            </div>
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Icon name="heroicons:pencil" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Icon name="heroicons:envelope" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.email }}</p>
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user.email }}</p>
              </div>
            </div>
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Icon name="heroicons:pencil" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Icon name="heroicons:phone" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.phone }}</p>
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user.phone }}</p>
              </div>
            </div>
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Icon name="heroicons:pencil" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
        <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{{ t.profile.quickActions }}</h3>
        
        <div class="space-y-2">
          <NuxtLink 
            to="/settings"
            class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span class="font-bold text-gray-900 dark:text-gray-100">{{ t.profile.settings }}</span>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>

          <button 
            @click="handleLogout"
            class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span class="font-bold text-red-600 dark:text-red-400">{{ t.profile.logout }}</span>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
