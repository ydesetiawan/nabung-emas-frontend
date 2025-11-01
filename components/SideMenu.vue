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
        'bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-all duration-300',
        isOpen ? 'w-64' : 'w-0 lg:w-20'
      ]"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1
            :class="[
            'text-2xl font-bold text-gray-800 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'
          ]"
        >
          Nabung Emas
        </h1>
      </div>

      <!-- Menu Items -->
      <nav class="p-4">
        <MenuItem
            label="Dashboard"
            to="/dashboard"
            icon="📊"
            :collapsed="!isOpen"
        />
        <MenuItem
            label="Tabungan"
            to="/tabungan"
            icon="💰"
            :collapsed="!isOpen"
        />
      </nav>
    </div>

    <!-- Toggle Button -->
    <button
        @click="toggleMenu"
        class="fixed top-4 left-4 z-50 lg:left-[280px] lg:top-6 bg-blue-600 text-white p-2 rounded-md shadow-lg hover:bg-blue-700 transition-all duration-300"
        :class="{ 'lg:left-24': !isOpen }"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path
            v-if="!isOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
        />
        <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import MenuItem from '~/components/ui/MenuItem.vue'
import { ref, watch } from 'vue'

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