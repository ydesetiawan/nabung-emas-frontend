# 📱 Mobile & Desktop Quick Reference

## At a Glance

### Mobile (< 1024px)
```
┌────────────────────────┐
│ [☰] Search    [🔔][👤] │ ← Hamburger in HEADER
├────────────────────────┤
│                        │
│    Full Width Content  │
│    (No side menu)      │
│                        │
└────────────────────────┘

Click [☰] → Side menu slides in with overlay
```

### Desktop (≥ 1024px)
```
┌────┬───────────────────┐
│[☰] │ Search   [🔔][👤] │ ← Hamburger in SIDE MENU
│────┼───────────────────┤
│🏠  │                   │
│💰  │   Content         │
│✨  │   (Margin left)   │
│    │                   │
└────┴───────────────────┘

Click [☰] → Collapses to icons only
```

## Key Differences

| Feature | Mobile | Desktop |
|---------|--------|---------|
| **Hamburger Location** | Header (top-left) | Side Menu |
| **Menu Default State** | Closed | Open |
| **When Menu Opens** | Overlays content | Pushes content |
| **Overlay** | Yes (dark) | No |
| **Click Outside** | Closes menu | Does nothing |
| **State Saved** | No | Yes (localStorage) |
| **Content Width** | Full width | Reduced by menu |

## CSS Classes to Remember

### Show/Hide Based on Screen Size
- `lg:hidden` - Hide on desktop, show on mobile
- `hidden lg:flex` - Hide on mobile, show on desktop

### Responsive Margins
- `lg:ml-64` - Left margin on desktop (menu open)
- `lg:ml-20` - Left margin on desktop (menu collapsed)
- No prefix = applies to all sizes

### Width Classes
- `w-0` - Hidden (mobile menu closed)
- `w-64` - Visible (menu open) = 256px
- `lg:w-20` - Desktop collapsed = 80px

## Component Integration Pattern

Every page should follow this:

```vue
<template>
  <div>
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />
    <Header :menuOpen="menuOpen" @toggle="handleToggle" />
    
    <div :class="['pt-16', menuOpen ? 'lg:ml-64' : 'lg:ml-20']">
      <!-- Content -->
    </div>
  </div>
</template>

<script setup>
const { menuOpen, handleToggle } = useSideMenu()
</script>
```

## Important Notes

1. **Always add `pt-16`** to main content (header height)
2. **Always use `lg:` prefix** for desktop-only styles
3. **Both components need `@toggle`** handler
4. **Use the composable** - don't reinvent the wheel

## Testing Checklist

Quick test in browser DevTools (F12):

```
✓ 375px  → Menu closed, hamburger in header
✓ 768px  → Menu closed, hamburger in header
✓ 1024px → Menu open, hamburger in side menu
✓ 1440px → Menu open, hamburger in side menu
```

## Common Issues

**Menu not closing on mobile?**
→ Check overlay has `@click` handler

**Content under side menu?**
→ Add `lg:ml-64` or `lg:ml-20` class

**Hamburger showing in both places?**
→ Check `lg:hidden` / `hidden lg:flex` classes

**State not persisting?**
→ Check localStorage in DevTools

---

🎉 **You're all set!** Test at http://localhost:3001/

