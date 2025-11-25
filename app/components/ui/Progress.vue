<script setup lang="ts">
import { cn } from '~/utils/cn'

defineProps<{
  value?: number
  class?: string
}>()
</script>

<template>
  <div
    :class="cn(
      'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
      $props.class
    )"
  >
    <div
      class="bg-primary h-full w-full flex-1 transition-all"
      :style="{ transform: `translateX(-${100 - (value || 0)}%)` }"
    />
  </div>
</template>
