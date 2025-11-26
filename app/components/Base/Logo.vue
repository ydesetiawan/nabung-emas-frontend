<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBackground?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showBackground: true,
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }
  return sizes[props.size]
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }
  return sizes[props.size]
})

const roundedClasses = computed(() => {
  const rounded = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  }
  return rounded[props.size]
})
</script>

<template>
  <div
    v-if="showBackground"
    :class="[
      sizeClasses,
      roundedClasses,
      'bg-gradient-to-br from-gold-500 via-amber-500 to-amber-600 dark:from-gold-600 dark:via-amber-600 dark:to-amber-700 flex items-center justify-center shadow-lg shadow-gold-500/20 dark:shadow-gold-600/30 ring-1 ring-white/20'
    ]"
  >
    <svg :class="[iconSizeClasses, 'text-white drop-shadow-sm']" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Combined E and G monogram - Premium version -->
      <path d="M7 8 L15 8 C15.5 8 16 8.5 16 9 C16 9.5 15.5 10 15 10 L9 10 L9 14 L14 14 C14.5 14 15 14.5 15 15 C15 15.5 14.5 16 14 16 L9 16 L9 20 L15 20 C15.5 20 16 20.5 16 21 C16 21.5 15.5 22 15 22 L7 22 C6.5 22 6 21.5 6 21 L6 9 C6 8.5 6.5 8 7 8 Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" stroke-linejoin="round"/>
      <path d="M24 8 C20 8 17 11 17 15 C17 19 20 22 24 22 L26 22 L26 19 L24 19 C21.8 19 20 17.2 20 15 C20 12.8 21.8 11 24 11 L26 11 L26 16 L23.5 16 L23.5 13.5 L24.5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  </div>
  <svg
    v-else
    :class="[iconSizeClasses, 'text-current']"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Combined E and G monogram - Premium version -->
    <path d="M7 8 L15 8 C15.5 8 16 8.5 16 9 C16 9.5 15.5 10 15 10 L9 10 L9 14 L14 14 C14.5 14 15 14.5 15 15 C15 15.5 14.5 16 14 16 L9 16 L9 20 L15 20 C15.5 20 16 20.5 16 21 C16 21.5 15.5 22 15 22 L7 22 C6.5 22 6 21.5 6 21 L6 9 C6 8.5 6.5 8 7 8 Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" stroke-linejoin="round"/>
    <path d="M24 8 C20 8 17 11 17 15 C17 19 20 22 24 22 L26 22 L26 19 L24 19 C21.8 19 20 17.2 20 15 C20 12.8 21.8 11 24 11 L26 11 L26 16 L23.5 16 L23.5 13.5 L24.5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>
</template>
