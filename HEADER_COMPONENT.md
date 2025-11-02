# Gmail-Style Header Component

## Overview

A modern, Gmail-inspired header component with search functionality, notifications, and user menu.

## Features

✅ **Search Bar** - Prominent search with dropdown results
✅ **Notifications** - Bell icon with badge counter and dropdown
✅ **User Menu** - Profile dropdown with account management
✅ **Responsive** - Adapts to side menu collapse state
✅ **Icons** - Help and Settings quick access buttons
✅ **Fixed Position** - Stays at the top while scrolling

## Component Structure

### Layout Sections

```
┌──────────────────────────────────────────────────────────┐
│ [Search Bar............] [Help] [Settings] [Bell] [User] │
└──────────────────────────────────────────────────────────┘
```

### Key Elements

1. **Search Bar (Left)**
   - Full-width search input with icon
   - Focus states with transitions
   - Dropdown for search results
   - Placeholder: "Search in Nabung Emas"

2. **Action Icons (Right)**
   - Help icon with tooltip
   - Settings icon (navigates to /settings)
   - Notifications bell with badge counter
   - User profile avatar

3. **Dropdowns**
   - **Notifications Dropdown**: Shows recent notifications
   - **User Menu Dropdown**: Profile info, settings, sign out

## Usage

### Basic Implementation

```vue
<template>
  <div>
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />
    <Header :menuOpen="menuOpen" />
    
    <div :class="[
      'pt-16', // Add padding-top for fixed header
      menuOpen ? 'lg:ml-64' : 'lg:ml-20'
    ]">
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
const { menuOpen, handleToggle } = useSideMenu()
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuOpen` | `Boolean` | `true` | Controls header positioning based on side menu state |

## Features Breakdown

### 1. Search Functionality

- **Search Input**: Real-time search with visual feedback
- **Focus States**: Background changes on hover/focus
- **Search Results**: Dropdown appears when typing
- **Recent Searches**: Shows recent search history

```vue
<!-- Search input code -->
<input
  v-model="searchQuery"
  @focus="showSearchResults = true"
  @blur="hideSearchResults"
/>
```

### 2. Notifications System

- **Badge Counter**: Red dot with number of unread notifications
- **Dropdown Menu**: Shows list of recent notifications
- **Sample Notifications**:
  - Gold savings milestones
  - Price updates
  - Monthly reports

```vue
<!-- Notification badge -->
<span v-if="notificationCount > 0" class="...">
  {{ notificationCount }}
</span>
```

### 3. User Menu

**User Info Section:**
- User avatar
- User name
- Email address
- "Manage your Account" button

**Menu Items:**
- Profile
- Settings
- Privacy & Security
- Sign out

## Responsive Behavior

### Desktop (lg+)
- Full width with left margin based on side menu state
- `left-64` when menu is open
- `left-20` when menu is collapsed

### Mobile
- Full width, no left margin
- All features remain accessible

## Dynamic Positioning

The header automatically adjusts its left position based on the side menu state:

```vue
:class="menuOpen ? 'lg:left-64' : 'lg:left-20'"
```

This ensures the header always aligns perfectly with the content area.

## Icons Used

All icons from `@heroicons/vue/24/outline`:

- `MagnifyingGlassIcon` - Search
- `BellIcon` - Notifications
- `Cog6ToothIcon` - Settings
- `QuestionMarkCircleIcon` - Help
- `UserIcon` - User avatar
- `UserCircleIcon` - Profile menu item
- `ShieldCheckIcon` - Privacy menu item
- `ArrowRightOnRectangleIcon` - Sign out

## Styling Classes

### Main Container
- `bg-white` - White background
- `border-b border-gray-200` - Bottom border
- `h-16` - Fixed height (64px)
- `fixed top-0 right-0 left-0` - Fixed positioning
- `z-40` - Above content, below side menu
- `transition-all duration-300` - Smooth transitions

### Search Input
- Hover state: `hover:bg-gray-200`
- Focus state: `focus:bg-white focus:border-blue-500`
- Transitions: `transition-colors duration-200`

### Action Buttons
- Circular: `rounded-full`
- Hover effect: `hover:bg-gray-100`
- Padding: `p-2`

## Interaction Features

### Click Outside to Close
Dropdowns automatically close when clicking outside:

```javascript
const handleClickOutside = (event) => {
  if (!target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}
```

### Toggle Functions
- `toggleNotifications()` - Opens notifications, closes user menu
- `toggleUserMenu()` - Opens user menu, closes notifications

## Pages Using This Header

- ✅ `/pages/dashboard.vue`
- ✅ `/pages/tabungan.vue`
- ✅ `/pages/emas.vue`
- ✅ `/pages/settings.vue`

## Important Layout Notes

### Required Padding
All pages using the Header must include `pt-16` class on the main content container to prevent content from being hidden under the fixed header:

```vue
<div class="pt-16">
  <!-- Content -->
</div>
```

### Z-Index Hierarchy
- Side Menu: `z-50`
- Header: `z-40`
- Overlay: `z-40`
- Dropdowns: Natural stacking within fixed parent

## Customization

### Change Notification Count
```javascript
const notificationCount = ref(3) // Change this value
```

### Add/Remove Notifications
```javascript
const notifications = ref([
  { message: 'Your notification', time: '1 hour ago' }
])
```

### Customize User Info
Edit the user info section in the template:
```vue
<p class="font-semibold">User Name</p>
<p class="text-sm text-gray-500">user@email.com</p>
```

## Future Enhancements

Potential improvements:
- [ ] Real search functionality with API integration
- [ ] Live notification updates via WebSocket
- [ ] User avatar upload
- [ ] Theme switcher in user menu
- [ ] Keyboard shortcuts for search (Cmd/Ctrl + K)
- [ ] Notification preferences
- [ ] Mark notifications as read

## Gmail Design Inspirations

This header component is inspired by Gmail's design principles:
- **Clean and minimal** - Focus on content
- **Prominent search** - Easy access to search functionality
- **Quick actions** - Common actions readily available
- **User context** - Always show who's logged in
- **Notifications** - Clear indication of new items
- **Responsive** - Works on all screen sizes

---

**Component Location**: `components/Header.vue`
**Created**: November 2, 2025
**Dependencies**: `@heroicons/vue`, Vue 3, Nuxt 3

