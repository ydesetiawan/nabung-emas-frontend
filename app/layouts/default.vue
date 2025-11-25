<script setup lang="ts">
import { cn } from '~/utils/cn'

const route = useRoute()
const showNav = computed(() => {
  return route.meta.showNav !== false
})
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
    <main :class="cn('flex-1 overflow-y-auto', showNav && 'pb-20')">
      <slot />
    </main>
    <BottomNav v-if="showNav" />
  </div>
</template>
