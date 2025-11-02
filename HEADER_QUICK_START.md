# Quick Start: Using Header Component

## What You Get

A Gmail-style header with:
- 🔍 **Search bar** - Full-width search functionality
- 🔔 **Notifications** - Bell icon with badge (3 notifications)
- ⚙️ **Quick Settings** - Direct link to settings page
- ❓ **Help** - Help icon button
- 👤 **User Menu** - Profile dropdown with account options

## How to Use

### 1. Import the Component

```vue
<script setup>
import Header from '~/components/Header.vue'
const { menuOpen, handleToggle } = useSideMenu()
</script>
```

### 2. Add to Template

```vue
<template>
  <div>
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />
    <Header :menuOpen="menuOpen" />
    
    <div :class="['pt-16', menuOpen ? 'lg:ml-64' : 'lg:ml-20']">
      <!-- Your page content -->
    </div>
  </div>
</template>
```

### 3. Important: Add pt-16 Class

⚠️ **MUST ADD** `pt-16` to your main content div to prevent content from being hidden under the fixed header!

## Already Implemented On

✅ Dashboard page
✅ Tabungan page  
✅ Emas page
✅ Settings page

## Header Features

### Search Bar
- Click to focus
- Type to see search results dropdown
- Shows "Recent searches" section

### Notifications (Bell Icon)
- Red badge shows count: **3**
- Click to open notifications dropdown
- Sample notifications included:
  - Gold savings milestone reached
  - Gold price update
  - Monthly report ready

### User Menu
- Click avatar to open dropdown
- Shows user info:
  - User Name
  - user@email.com
- Menu options:
  - Profile
  - Settings
  - Privacy & Security
  - Sign out

### Quick Actions
- **Help icon** - Opens help
- **Settings icon** - Navigates to /settings

## Responsive Design

- **Desktop**: Full width, adjusts to side menu
- **Mobile**: Full width, overlays content
- **Smooth transitions**: 300ms duration

## Positioning

The header automatically adjusts its left margin based on side menu state:
- **Menu Open**: `left-64` (256px)
- **Menu Collapsed**: `left-20` (80px)

## Dropdown Behavior

- Only one dropdown open at a time
- Click outside to close
- Automatically managed via event listeners

## Visual Design

### Colors
- Background: White (`bg-white`)
- Border: Gray-200 (`border-gray-200`)
- Text: Gray-700/Gray-800
- Accent: Blue-500 (avatar)

### Effects
- Hover states on all buttons
- Smooth color transitions
- Shadow on dropdowns
- Badge counter on notifications

## Test It

1. Go to http://localhost:3001/dashboard
2. Try the search bar
3. Click the bell icon (3 notifications)
4. Click your avatar (user menu)
5. Toggle the side menu to see header adjust

## Need Help?

See full documentation: `HEADER_COMPONENT.md`

---

**Pro Tip**: The header works seamlessly with the side menu state management via the `useSideMenu()` composable!

