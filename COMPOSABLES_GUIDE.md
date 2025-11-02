# Composables Usage Guide

## useSideMenu

A Vue 3 composable for managing side menu state with localStorage persistence.

### Features
- 🔄 Persistent state across page navigation
- 💾 Saves state to localStorage
- 🎯 Single source of truth for menu state
- ♻️ Reusable across all pages

### Usage

```vue
<template>
  <div>
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />
    
    <div :class="menuOpen ? 'lg:ml-64' : 'lg:ml-20'">
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup>
const { menuOpen, handleToggle } = useSideMenu()
</script>
```

### API

#### Returns

**menuOpen**: `Ref<boolean>`
- A reactive reference containing the menu's open/closed state
- `true` = menu is expanded
- `false` = menu is collapsed

**handleToggle**: `(state: boolean) => void`
- Function to update the menu state
- Receives the new state from the SideMenu component's toggle event

### How it Works

1. **Initialization**: On component mount, checks localStorage for saved state
2. **State Management**: Provides reactive `menuOpen` ref that can be used in templates
3. **Updates**: The `handleToggle` function syncs the state when the menu is toggled

### localStorage Key

The composable uses the key `'sideMenuOpen'` to store the state in localStorage.

### Benefits of Using This Composable

✅ **DRY (Don't Repeat Yourself)**: No need to duplicate the same logic across multiple pages
✅ **Consistent**: All pages use the same menu state logic
✅ **Maintainable**: Changes to menu logic only need to be made in one place
✅ **Vue 3 Convention**: Follows Nuxt 3 and Vue 3 Composition API best practices
✅ **Auto-imported**: Nuxt automatically imports composables from the `composables/` directory

### File Location

`composables/useSideMenu.ts`

### Pages Using This Composable

- `/pages/dashboard.vue`
- `/pages/tabungan.vue`
- `/pages/emas.vue`
- `/pages/settings.vue`

