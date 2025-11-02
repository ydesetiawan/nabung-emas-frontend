<template>
  <header class="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-40 transition-all duration-300"
          :class="menuOpen ? 'lg:left-64' : 'lg:left-20'">
    <div class="h-full px-4 flex items-center justify-between">
      <!-- Left Section: Hamburger (Mobile) + Search Bar -->
      <div class="flex items-center gap-3 flex-1 max-w-3xl">
        <!-- Hamburger Menu Button (Mobile only) -->
        <button
            @click="toggleMenu"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 lg:hidden"
            title="Menu"
        >
          <Bars3Icon class="h-6 w-6 text-gray-700" />
        </button>

        <!-- Search Bar -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
              type="text"
              placeholder="Search in Nabung Emas"
              class="w-full pl-10 pr-4 py-2 bg-gray-100 hover:bg-gray-200 focus:bg-white border border-transparent focus:border-blue-500 rounded-lg outline-none transition-colors duration-200"
              v-model="searchQuery"
              @focus="showSearchResults = true"
              @blur="hideSearchResults"
          />
          <!-- Search Results Dropdown -->
          <div v-if="showSearchResults && searchQuery"
               class="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
            <div class="px-4 py-2 text-sm text-gray-500">Recent searches</div>
            <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
              Example search result
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section: Actions & User -->
      <div class="flex items-center gap-2 ml-4">
        <!-- Help Icon -->
        <button
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Help"
        >
          <QuestionMarkCircleIcon class="h-6 w-6 text-gray-600" />
        </button>

        <!-- Settings Icon -->
        <button
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Settings"
            @click="$router.push('/settings')"
        >
          <Cog6ToothIcon class="h-6 w-6 text-gray-600" />
        </button>

        <!-- Notifications Icon -->
        <button
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
            title="Notifications"
            @click="toggleNotifications"
        >
          <BellIcon class="h-6 w-6 text-gray-600" />
          <span v-if="notificationCount > 0"
                class="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <div v-if="showNotifications"
             class="absolute top-14 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-96 overflow-y-auto">
          <div class="px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
            No new notifications
          </div>
          <div v-else>
            <div v-for="(notification, index) in notifications"
                 :key="index"
                 class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
              <p class="text-sm text-gray-800">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserIcon class="h-5 w-5 text-white" />
            </div>
          </button>

          <!-- User Menu Dropdown -->
          <div v-if="showUserMenu"
               class="absolute top-12 right-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <div class="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon class="h-7 w-7 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 truncate">User Name</p>
                  <p class="text-sm text-gray-500 truncate">user@email.com</p>
                </div>
              </div>
              <button class="mt-3 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Manage your Account
              </button>
            </div>

            <!-- Menu Items -->
            <div class="py-2">
              <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                <UserCircleIcon class="h-5 w-5 text-gray-500" />
                Profile
              </a>
              <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                <Cog6ToothIcon class="h-5 w-5 text-gray-500" />
                Settings
              </a>
              <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                <ShieldCheckIcon class="h-5 w-5 text-gray-500" />
                Privacy & Security
              </a>
            </div>

            <!-- Sign Out -->
            <div class="border-t border-gray-200 pt-2">
              <button class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                <ArrowRightOnRectangleIcon class="h-5 w-5 text-gray-500" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  menuOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

const searchQuery = ref('')
const showSearchResults = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notificationCount = ref(3)
const notifications = ref([
  { message: 'Your gold savings reached 10 grams!', time: '2 hours ago' },
  { message: 'Gold price update: Rp 1,050,000/gram', time: '5 hours ago' },
  { message: 'Monthly report is ready', time: '1 day ago' }
])

const toggleMenu = () => {
  emit('toggle')
}

const hideSearchResults = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

