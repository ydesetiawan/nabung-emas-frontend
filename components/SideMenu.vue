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
        <button
            @click="toggleMenu"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <Bars3Icon class="h-6 w-6 text-gray-700" />
        </button>
        <div
            v-show="isOpen"
            class="ml-4 flex items-center gap-2"
        >
          <div class="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">NE</span>
          </div>
          <h1 class="text-xl font-semibold text-gray-800">
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
            :collapsed="!isOpen"
        />
        <MenuItem
            label="Tabungan"
            to="/tabungan"
            :icon="BanknotesIcon"
            :collapsed="!isOpen"
        />
        <MenuItem
            label="Emas"
            to="/emas"
            :icon="SparklesIcon"
            :collapsed="!isOpen"
        />

        <div class="my-2 border-t border-gray-200"></div>

        <MenuItem
            label="Settings"
            to="/settings"
            :icon="Cog6ToothIcon"
            :collapsed="!isOpen"
        />
      </nav>

      <!-- Footer / User Section -->
      <div class="border-t border-gray-100 p-3">
        <div
            :class="[
            'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200',
            !isOpen && 'justify-center'
          ]"
        >
          <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon class="h-5 w-5 text-white" />
          </div>
          <div v-show="isOpen" class="flex-1 min-w-0">
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
import { ref, watch } from 'vue'
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

const isOpen = ref(props.isOpen)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  emit('toggle', isOpen.value)
}

watch(() => props.isOpen, (newVal) => {
  isOpen.value = newVal
})
</script>