<script setup lang="ts">
import { cn } from '~/utils/cn'

const route = useRoute()
const { t } = useI18n()

const navItems = computed(() => [
  { href: "/", icon: 'lucide:home', label: t.value.nav.home },
  { href: "/pockets", icon: 'lucide:wallet', label: t.value.nav.pockets },
  { href: "/transactions", icon: 'lucide:arrow-left-right', label: t.value.nav.history },
  { href: "/analytics", icon: 'lucide:bar-chart-3', label: t.value.nav.analytics },
  { href: "/profile", icon: 'lucide:user', label: t.value.nav.profile },
])

const isActive = (href: string) => {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom max-w-md mx-auto">
    <div class="flex items-center justify-around h-16">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :class="cn(
          'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]',
          isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )"
      >
        <Icon
          :name="item.icon"
          :class="cn('w-5 h-5 transition-all', isActive(item.href) && 'scale-110')"
        />
        <span :class="cn('text-[10px] font-medium', isActive(item.href) && 'font-semibold')">
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
