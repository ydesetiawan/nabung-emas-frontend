<template>
  <div class="relative group">
    <NuxtLink
        :to="to"
        :class="[
        'flex items-center px-3 py-2 mx-1 rounded-full transition-all duration-200 relative',
        'hover:bg-gray-100',
        isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600',
        collapsed ? 'justify-center w-12 h-12' : 'gap-3 rounded-full'
      ]"
    >
      <div class="flex items-center justify-center w-5 h-5 flex-shrink-0">
        <component
          :is="icon"
          :class="[
            'w-5 h-5 transition-colors duration-200',
            isActive ? 'text-blue-600' : 'text-gray-600'
          ]"
        />
      </div>
      <span
        v-if="!collapsed"
        :class="[
          'font-medium text-sm',
          isActive ? 'text-blue-600' : 'text-gray-700'
        ]"
      >
        {{ label }}
      </span>
    </NuxtLink>

    <!-- Tooltip for collapsed state -->
    <div
        v-if="collapsed"
        class="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
        style="top: 50%; transform: translateY(-50%);"
    >
      {{ label }}
      <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>
