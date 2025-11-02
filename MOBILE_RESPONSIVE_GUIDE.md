# Mobile & Responsive Behavior Guide

## Overview

The application now has Gmail-style responsive behavior with proper mobile support.

## Behavior Summary

### 📱 Mobile (< 1024px)
- **Side menu starts CLOSED** by default
- **Hamburger menu in HEADER** (top-left)
- Click hamburger → Side menu slides in from left
- **Dark overlay** appears behind menu
- Click overlay or navigate → Menu closes automatically
- **No left margin** on content (full width)

### 💻 Desktop (≥ 1024px)
- **Side menu starts OPEN** by default (or uses saved state)
- **Hamburger menu in SIDE MENU** (top-left of side menu)
- Click hamburger → Menu collapses to icon-only view (80px)
- **No overlay** on desktop
- **Content adjusts** with smooth transition
  - Menu open: 256px left margin
  - Menu collapsed: 80px left margin
- **State persists** across page navigation

## Component Breakdown

### 1. Header Component (`components/Header.vue`)

**Mobile Features:**
- Hamburger button (☰) visible only on mobile (`lg:hidden`)
- Positioned at top-left before search bar
- Clicking toggles side menu open/closed
- Emits `@toggle` event to parent

**Desktop Features:**
- Hamburger button hidden on desktop
- Header width adjusts based on side menu state
  - Menu open: `lg:left-64` (256px)
  - Menu collapsed: `lg:left-20` (80px)

### 2. Side Menu Component (`components/SideMenu.vue`)

**Mobile Features:**
- Width: `w-0` when closed (invisible)
- Width: `w-64` when open (256px slide-in)
- Dark overlay appears when open (`bg-black bg-opacity-50`)
- Click overlay to close menu
- Hamburger button hidden on mobile

**Desktop Features:**
- Hamburger button visible (inside menu)
- Width: `lg:w-20` when collapsed (80px)
- Width: `w-64` when open (256px)
- No overlay
- Icons remain visible when collapsed
- Saves state to localStorage

### 3. Composable (`composables/useSideMenu.ts`)

**Smart Initialization:**
```typescript
onMounted(() => {
  const isMobile = window.innerWidth < 1024
  
  if (savedState) {
    // Mobile: always start closed
    // Desktop: use saved state
    menuOpen.value = isMobile ? false : savedState === 'true'
  } else {
    // Default: closed on mobile, open on desktop
    menuOpen.value = !isMobile
  }
})
```

**Toggle Function:**
- Accepts optional boolean parameter
- Can be called without params to toggle
- Only saves state on desktop (not mobile)

## Visual Behavior

### Mobile View
```
┌─────────────────────────────────────┐
│ [☰] [Search............] [🔔] [👤] │ ← Header with hamburger
├─────────────────────────────────────┤
│                                     │
│         Content Full Width          │
│                                     │
└─────────────────────────────────────┘

When hamburger clicked:
┌────────────┬────────────────────────┐
│            │ [☰] [Search...] [🔔]  │
│  Side Menu │────────────────────────│
│            │░░░░░░░░░░░░░░░░░░░░░░░░│ ← Dark overlay
│ • Dashboard│░░░ Content ░░░░░░░░░░░░│
│ • Tabungan │░░░░░░░░░░░░░░░░░░░░░░░░│
│ • Emas     │░░░░░░░░░░░░░░░░░░░░░░░░│
│            │                        │
└────────────┴────────────────────────┘
```

### Desktop View
```
Expanded (default):
┌──────┬──────────────────────────────────┐
│      │ [Search............] [🔔] [👤]  │ ← Header
│ [☰]  ├──────────────────────────────────┤
│      │                                  │
│ Dash │        Content (ml-64)           │
│ Tabu │                                  │
│ Emas │                                  │
│      │                                  │
└──────┴──────────────────────────────────┘

Collapsed:
┌─┬─────────────────────────────────────┐
│ │  [Search............] [🔔] [👤]    │ ← Header
│☰│─────────────────────────────────────┤
│ │                                     │
│🏠│       Content (ml-20)              │
│💰│                                     │
│✨│                                     │
│ │                                     │
└─┴─────────────────────────────────────┘
```

## Breakpoint: 1024px (Tailwind `lg`)

All responsive behavior switches at the `lg` breakpoint:
- `lg:hidden` - Hidden on desktop
- `lg:flex` - Shown on desktop
- `lg:ml-64` - Left margin on desktop only
- `lg:left-64` - Left position on desktop only

## Z-Index Hierarchy

```
Side Menu:        z-50  (highest - always on top)
Header:           z-40
Mobile Overlay:   z-40  (same level as header)
Dropdowns:        natural stacking
Content:          z-0   (default)
```

## Event Flow

### Mobile Toggle Flow
1. User clicks hamburger in **Header**
2. Header emits `@toggle` event
3. Parent page calls `handleToggle()`
4. Composable toggles `menuOpen` ref
5. SideMenu receives new `isOpen` prop
6. Menu slides in with overlay
7. State NOT saved (mobile only)

### Desktop Toggle Flow
1. User clicks hamburger in **SideMenu**
2. SideMenu calls internal `toggleMenu()`
3. SideMenu emits `@toggle` event
4. Parent page calls `handleToggle()`
5. Composable updates `menuOpen` ref
6. Menu collapses/expands smoothly
7. **State SAVED to localStorage**

## CSS Classes Used

### Mobile-Specific
- `lg:hidden` - Hide on desktop
- `w-0` - Hidden when closed
- `w-64` - Full width when open

### Desktop-Specific
- `hidden lg:flex` - Show only on desktop
- `lg:w-20` - Collapsed width
- `lg:ml-64` - Content margin when expanded
- `lg:ml-20` - Content margin when collapsed

### Transitions
- `transition-all duration-300` - Smooth animations
- Applied to: side menu, header, content

## Usage in Pages

All pages follow this pattern:

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />
    <Header :menuOpen="menuOpen" @toggle="handleToggle" />
    
    <div :class="[
      'pt-16',                          // Header height
      menuOpen ? 'lg:ml-64' : 'lg:ml-20' // Desktop only margin
    ]">
      <!-- Content -->
    </div>
  </div>
</template>

<script setup>
const { menuOpen, handleToggle } = useSideMenu()
</script>
```

## Key Features

✅ **Gmail-like behavior** - Mobile overlay, desktop persistence
✅ **Smart defaults** - Closed on mobile, open on desktop
✅ **Persistent state** - Desktop state saved to localStorage
✅ **Smooth animations** - 300ms transitions
✅ **Click outside to close** - Mobile overlay dismisses menu
✅ **Route changes** - State maintained across navigation
✅ **Icon visibility** - Icons always visible on desktop collapsed view

## Testing Checklist

### Mobile (< 1024px)
- [ ] Menu starts closed
- [ ] Hamburger visible in header (top-left)
- [ ] Click hamburger → menu slides in
- [ ] Dark overlay appears
- [ ] Click overlay → menu closes
- [ ] Navigate to page → menu closes
- [ ] Content is full width
- [ ] No hamburger in side menu

### Desktop (≥ 1024px)
- [ ] Menu starts open (or saved state)
- [ ] Hamburger visible in side menu
- [ ] No hamburger in header
- [ ] Click hamburger → menu collapses
- [ ] Icons remain visible when collapsed
- [ ] Content margin adjusts smoothly
- [ ] State saves to localStorage
- [ ] Refresh → state persists
- [ ] Navigate → state persists

## Browser DevTools Testing

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl/Cmd + Shift + M)
3. Test at different widths:
   - 375px (Mobile)
   - 768px (Tablet)
   - 1024px (Desktop breakpoint)
   - 1440px (Desktop)

## Common Issues & Solutions

### Issue: Menu won't close on mobile
**Solution**: Check that overlay has `@click="toggleMenu"` and `z-40`

### Issue: Content hidden under side menu
**Solution**: Ensure content has proper margin classes with `lg:` prefix

### Issue: State not persisting
**Solution**: Check localStorage in DevTools > Application > Local Storage

### Issue: Transitions jerky
**Solution**: Ensure all elements have `transition-all duration-300`

---

**Last Updated**: November 2, 2025
**Tailwind Breakpoint**: `lg` = 1024px
**Tested**: Chrome, Safari, Firefox, Mobile Safari

