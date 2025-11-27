<script setup lang="ts">
import type { IProfileUpdateRequest } from '~/types/auth'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const { user, updateProfile } = useAuth()

useHead({
  title: computed(() => `${t.value.profile.title} - Gold Savings`),
})

// Edit profile state
const showEditProfile = ref(false)
const isUpdating = ref(false)
const editForm = ref<IProfileUpdateRequest>({
  fullName: '',
  phone: '',
})

// Open edit modal with current user data
const openEditProfile = () => {
  if (user.value) {
    editForm.value = {
      fullName: user.value.fullName,
      phone: user.value.phone,
    }
  }
  showEditProfile.value = true
}

// Handle profile update
const handleUpdateProfile = async () => {
  isUpdating.value = true
  try {
    const success = await updateProfile(editForm.value)
    if (success) {
      showEditProfile.value = false
      // Show success message (you can add a toast notification here)
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    isUpdating.value = false
  }
}

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
                {{ getInitials(user?.fullName || 'User') }}
              </div>
              <button class="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Icon name="heroicons:camera" class="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          <!-- User Info -->
          <div class="text-center text-white">
            <h2 class="text-2xl font-bold mb-1">{{ user?.fullName || 'User' }}</h2>
            <p class="text-white/80 text-sm font-medium mb-1">{{ user?.email || '' }}</p>
            <p class="text-white/70 text-xs font-medium">{{ t.profile.memberSince }} {{ user?.createdAt ? formatJoinDate(new Date(user.createdAt).toISOString().split('T')[0] || '') : '' }}</p>
          </div>
        </div>
      </div>

      <!-- Account Information -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-glass dark:shadow-glass-dark border border-gray-200/50 dark:border-gray-700/50 animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t.profile.accountInfo }}</h3>
          <button 
            @click="openEditProfile"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="heroicons:pencil" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Icon name="heroicons:user" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.fullName }}</p>
              <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user?.fullName || 'User' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Icon name="heroicons:envelope" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.email }}</p>
              <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user?.email || '' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Icon name="heroicons:phone" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t.profile.phone }}</p>
              <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ user?.phone || '' }}</p>
            </div>
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
        </div>
      </div>
    </div>

    <!-- Edit Profile Sheet -->
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
          v-if="showEditProfile"
          class="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50"
          @click="showEditProfile = false"
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
          v-if="showEditProfile"
          class="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-t-3xl shadow-premium max-h-[90vh] flex flex-col max-w-md mx-auto"
        >
          <!-- Header with gradient -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-t-3xl"></div>
            <div class="relative flex items-center justify-between p-6 text-white">
              <h2 class="text-2xl font-bold drop-shadow-lg">
                Edit Profile
              </h2>
              <button
                @click="showEditProfile = false"
                class="p-2.5 hover:bg-white/20 rounded-xl transition-all active:scale-95 backdrop-blur-sm"
              >
                <Icon name="heroicons:x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleUpdateProfile" class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                {{ t.profile.fullName }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.fullName"
                type="text"
                required
                placeholder="Enter your full name"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                {{ t.profile.phone }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.phone"
                type="tel"
                required
                placeholder="+62 812 3456 7890"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-glass dark:shadow-glass-dark"
              />
            </div>

            <!-- Email (Read-only) -->
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                {{ t.profile.email }}
              </label>
              <input
                :value="user?.email"
                type="email"
                disabled
                class="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">Email cannot be changed</p>
            </div>
          </form>

          <!-- Footer -->
          <div class="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-3">
            <button
              type="submit"
              @click="handleUpdateProfile"
              :disabled="isUpdating"
              :class="[
                'w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg',
                isUpdating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95'
              ]"
            >
              <span v-if="isUpdating" class="flex items-center justify-center gap-2">
                <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
            
            <button
              type="button"
              @click="showEditProfile = false"
              class="w-full py-3.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
