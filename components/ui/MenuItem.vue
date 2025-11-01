<template>
  <button
      @click="$emit('toggle')"
      :class="[
      'w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg',
      collapsed ? 'justify-center' : '',
      isActive ? 'bg-blue-50 text-blue-600 font-semibold' : ''
    ]"
      :title="collapsed ? label : ''"
  >
    <div class="flex items-center gap-3">
      <!-- Icon -->
      <component :is="iconComponent" class="w-5 h-5 flex-shrink-0" />

      <!-- Label -->
      <span v-if="!collapsed" class="text-sm font-medium">{{ label }}</span>
    </div>

    <!-- Badge and Chevron -->
    <div v-if="!collapsed" class="flex items-center gap-2">
      <span
          v-if="badge"
          class="px-2 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded"
      >
        {{ badge }}
      </span>

      <!-- Chevron -->
      <svg
          v-if="isExpanded"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
      <svg
          v-else-if="badge || isExpanded !== undefined"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📄'
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script>
