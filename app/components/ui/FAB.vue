<script setup lang="ts">
import { cn } from '~/utils/cn'

defineProps<{
  onClick?: () => void
  icon?: string
  class?: string
  label?: string
}>()
</script>

<template>
  <Button
    @click="onClick"
    :class="cn(
      'fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg',
      'bg-primary hover:bg-primary/90 text-primary-foreground',
      'flex items-center justify-center',
      'transition-transform hover:scale-105 active:scale-95',
      $props.class
    )"
    :aria-label="label || 'Add new'"
  >
    <slot name="icon">
      <Icon :name="icon || 'lucide:plus'" class="h-6 w-6" />
    </slot>
  </Button>
</template>
