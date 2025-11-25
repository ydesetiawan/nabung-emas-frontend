<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const navItems = computed(() => [
  { href: '/', icon: 'heroicons:home', iconSolid: 'heroicons:home-solid', label: t.value.nav.home },
  { href: '/pockets', icon: 'heroicons:wallet', iconSolid: 'heroicons:wallet-solid', label: t.value.nav.pockets },
  { href: '/transactions', icon: 'heroicons:arrow-path', iconSolid: 'heroicons:arrow-path-solid', label: t.value.nav.history },
  { href: '/analytics', icon: 'heroicons:chart-bar', iconSolid: 'heroicons:chart-bar-solid', label: t.value.nav.analytics },
  { href: '/profile', icon: 'heroicons:user', iconSolid: 'heroicons:user-solid', label: t.value.nav.profile },
])

const isActive = (href: string) => {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
    <!-- Glassmorphic background -->
    <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50"></div>
    
    <!-- Navigation items -->
    <div class="relative max-w-md mx-auto flex items-center justify-around h-18 px-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :class="[
          'relative flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 min-w-[68px] group',
          isActive(item.href) 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        <!-- Active indicator background -->
        <div 
          v-if="isActive(item.href)"
          class="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl scale-100 animate-scale-in"
        ></div>
        
        <!-- Icon with animation -->
        <div class="relative">
          <Icon
            :name="isActive(item.href) ? (item.iconSolid || item.icon) : item.icon"
            :class="[
              'w-6 h-6 transition-all duration-300',
              isActive(item.href) 
                ? 'scale-110' 
                : 'group-hover:scale-105 group-active:scale-95'
            ]"
          />
          
          <!-- Active dot indicator -->
          <div 
            v-if="isActive(item.href)"
            class="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-scale-in"
          ></div>
        </div>
        
        <!-- Label -->
        <span 
          :class="[
            'text-[10px] font-medium transition-all duration-300 relative z-10',
            isActive(item.href) 
              ? 'font-semibold scale-105' 
              : 'group-hover:scale-105'
          ]"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
