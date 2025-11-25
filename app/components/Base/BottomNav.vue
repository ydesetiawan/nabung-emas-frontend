<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const navItems = computed(() => [
  { href: '/', icon: 'heroicons:home', label: t.value.nav.home },
  { href: '/pockets', icon: 'heroicons:wallet', label: t.value.nav.pockets },
  { href: '/transactions', icon: 'heroicons:arrow-path', label: t.value.nav.history },
  { href: '/analytics', icon: 'heroicons:chart-bar', label: t.value.nav.analytics },
])

const isActive = (href: string) => {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
    <div class="max-w-md mx-auto flex items-center justify-around h-16 px-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :class="[
          'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]',
          isActive(item.href) ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <Icon
          :name="item.icon"
          :class="[
            'w-6 h-6 transition-all',
            isActive(item.href) && 'scale-110'
          ]"
        />
        <span :class="[
          'text-[10px] font-medium',
          isActive(item.href) && 'font-semibold'
        ]">
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
