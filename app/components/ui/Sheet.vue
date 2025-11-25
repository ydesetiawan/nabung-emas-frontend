<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = defineProps<{
  open: boolean
  class?: string
}>()

const emit = defineEmits(['update:open'])

const close = () => {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-black/80" @click="close" />
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        :class="cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 h-[90vh] rounded-t-3xl bg-background p-6 shadow-lg ring-1 ring-gray-900/5',
          props.class
        )"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </Teleport>
</template>
