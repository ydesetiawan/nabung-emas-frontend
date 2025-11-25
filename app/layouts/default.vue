<script setup lang="ts">
const route = useRoute()
const showNav = computed(() => route.meta.showNav !== false)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto relative transition-colors">
    <main :class="['flex-1 overflow-y-auto', showNav && 'pb-20']">
      <slot />
    </main>
    <BaseBottomNav v-if="showNav" />
  </div>
</template>
