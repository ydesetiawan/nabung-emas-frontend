# Google-Style Side Menu Usage Guide

Your side menu has been updated to match Google's modern design! 🎉

## ✨ Features

- **Clean Google-inspired design** with rounded menu items
- **Smooth animations** on hover and toggle
- **Collapsible sidebar** - expands to 64 (w-64) and collapses to 80px (w-20)
- **Hover tooltips** when collapsed - shows menu item labels
- **Responsive design** - works on mobile and desktop
- **Active state indicators** - highlights current page
- **User profile section** at the bottom
- **Heroicons integration** for beautiful icons

## 📱 How to Use in Your Pages

### Basic Usage

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Side Menu -->
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />

    <!-- Main Content -->
    <div 
      :class="[
        'transition-all duration-300 min-h-screen',
        menuOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Your Page Title</h1>
        <!-- Your page content here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(true)

const handleToggle = (state) => {
  menuOpen.value = state
}
</script>
```

## 🎨 Customizing Menu Items

To add or modify menu items, edit `components/SideMenu.vue`:

```vue
<MenuItem
    label="Your Page Name"
    to="/your-route"
    :icon="YourIcon"
    :collapsed="!isOpen"
/>
```

### Available Icons (Heroicons)

Import icons from `@heroicons/vue/24/outline`:

```javascript
import {
  HomeIcon,
  BanknotesIcon,
  SparklesIcon,
  Cog6ToothIcon,
  UserIcon,
  // Add more as needed
} from '@heroicons/vue/24/outline'
```

Browse all available icons at: https://heroicons.com

## 🎯 Key Components

### 1. SideMenu.vue
- Main sidebar component
- Handles open/closed state
- Contains menu items and user section
- Props: `isOpen` (Boolean)
- Emits: `@toggle` (with new state)

### 2. MenuItem.vue
- Individual menu item component
- Shows icon and label
- Active state highlighting
- Tooltip when collapsed
- Props: `label`, `to`, `icon`, `collapsed`

## 💡 Tips

1. **Persistent State**: Add localStorage to remember menu state:
```javascript
const menuOpen = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('menuOpen')
  if (saved !== null) {
    menuOpen.value = saved === 'true'
  }
})

const handleToggle = (state) => {
  menuOpen.value = state
  localStorage.setItem('menuOpen', state.toString())
}
```

2. **Mobile Responsive**: The menu automatically:
   - Overlays on mobile (< lg breakpoint)
   - Shows backdrop when open
   - Hides completely when closed on mobile
   - Collapses to icon-only view on desktop

3. **Styling**: All Tailwind classes can be customized in:
   - `components/SideMenu.vue` - Main layout
   - `components/ui/MenuItem.vue` - Individual items

## 🚀 Current Menu Structure

- 📊 Dashboard (`/dashboard`)
- 💰 Tabungan (`/tabungan`)
- ✨ Emas (`/emas`)
- ⚙️ Settings (`/settings`)

## 📝 Notes

- The menu uses **Nuxt Link** for routing
- Active state is detected automatically using `useRoute()`
- Icons are from **Heroicons** (already installed)
- Design inspired by Google's Material Design principles

