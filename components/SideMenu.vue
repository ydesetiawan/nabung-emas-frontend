<template>
  <div>
    <!-- Overlay for mobile -->
    <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="toggleMenu"
    ></div>

    <!-- Side Menu -->
    <div
        :class="[
        'bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-hidden z-50 transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-0 lg:w-20'
      ]"
    >
      <!-- Header -->
      <div class="flex items-center h-16 px-4 border-b border-gray-100">
        <!-- Hamburger button - hidden on mobile, visible on desktop -->
        <button
            @click="toggleMenu"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 hidden lg:flex"
        >
          <Bars3Icon class="h-6 w-6 text-gray-700" />
        </button>
        <!-- Logo/Title -->
        <div
            :class="[
              'flex items-center gap-2 transition-all duration-300',
              isOpen ? 'ml-4 opacity-100' : 'ml-0 opacity-0 lg:opacity-0'
            ]"
        >
          <h1 class="text-xl font-semibold text-gray-800 whitespace-nowrap">
            Nabung Emas
          </h1>
        </div>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 overflow-y-auto py-2 px-2">
        <MenuItem
            label="Dashboard"
            to="/dashboard"
            :icon="HomeIcon"
            :collapsed="isCollapsed"
        />
        <MenuItem
            label="Tabungan"
            to="/tabungan"
            :icon="BanknotesIcon"
            :collapsed="isCollapsed"
        />
        <MenuItem
            label="Emas"
            to="/emas"
            :icon="SparklesIcon"
            :collapsed="isCollapsed"
        />

        <div class="my-2 border-t border-gray-200"></div>

        <MenuItem
            label="Settings"
            to="/settings"
            :icon="Cog6ToothIcon"
            :collapsed="isCollapsed"
        />
      </nav>

      <!-- Footer / User Section -->
      <div class="border-t border-gray-100 p-3">
        <div
            :class="[
            'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200',
            isCollapsed && 'justify-center'
          ]"
        >
          <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon class="h-5 w-5 text-white" />
          </div>
          <div v-show="!isCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-700 truncate">User Name</p>
            <p class="text-xs text-gray-500 truncate">user@email.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MenuItem from '~/components/ui/MenuItem.vue'
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import {
  Bars3Icon,
  HomeIcon,
  BanknotesIcon,
  SparklesIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

// Initialize from localStorage or use prop default
const isOpen = ref(props.isOpen)
const isDesktop = ref(true)

// Computed property for collapsed state
// On mobile: never collapsed (menu is completely hidden when closed)
// On desktop: collapsed when closed (shows icons only)
const isCollapsed = computed(() => {
  return isDesktop.value && !isOpen.value
})

// Check if desktop
const checkDesktop = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 1024
  }
}

// Load saved state from localStorage on mount
onMounted(() => {
  checkDesktop()

  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('sideMenuOpen')
    if (savedState !== null) {
      isOpen.value = savedState === 'true'
      emit('toggle', isOpen.value)
    }

    // Listen to window resize
    window.addEventListener('resize', checkDesktop)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkDesktop)
  }
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  emit('toggle', isOpen.value)

  // Save state to localStorage (only for desktop)
  if (typeof window !== 'undefined') {
    const isDesktop = window.innerWidth >= 1024
    if (isDesktop) {
      localStorage.setItem('sideMenuOpen', isOpen.value.toString())
    }
  }
}

watch(() => props.isOpen, (newVal) => {
  isOpen.value = newVal
})
</script>