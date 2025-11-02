# 🧪 Visual Test Guide - Icon Visibility

## Quick Test Steps

### Test 1: Desktop - Icons Always Visible ✅

#### Step 1: Open Desktop View
1. Go to http://localhost:3001/dashboard
2. Make sure window width > 1024px
3. You should see: Full menu with icons + labels

**Expected View:**
```
┌────────────────┐
│ [☰] Nabung Emas│
├────────────────┤
│ 🏠 Dashboard   │ ← Icon + Label
│ 💰 Tabungan    │ ← Icon + Label
│ ✨ Emas        │ ← Icon + Label
│ ⚙️  Settings    │ ← Icon + Label
└────────────────┘
```

#### Step 2: Collapse Menu (Desktop)
1. Click the hamburger button [☰] inside the side menu
2. Menu should collapse to 80px width

**Expected View:**
```
┌──┐
│☰ │
├──┤
│🏠│ ← Icon visible
│💰│ ← Icon visible
│✨│ ← Icon visible
│⚙️ │ ← Icon visible
└──┘
```

✅ **Verify**: Icons are STILL visible (no labels)

#### Step 3: Expand Menu Again
1. Click hamburger again
2. Menu expands back to full width

**Expected View:**
```
┌────────────────┐
│ 🏠 Dashboard   │ ← Icon + Label back
│ 💰 Tabungan    │
│ ✨ Emas        │
│ ⚙️  Settings    │
└────────────────┘
```

✅ **Verify**: Icons AND labels visible

---

### Test 2: Mobile - Icons Visible When Open ✅

#### Step 1: Switch to Mobile View
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl/Cmd + Shift + M)
3. Select "iPhone 12 Pro" or resize to < 1024px

**Expected View:**
```
┌────────────────────┐
│ [☰] Search  [🔔][👤]│ ← Hamburger in HEADER
├────────────────────┤
│                    │
│   Full Content     │
│                    │
└────────────────────┘
```

✅ **Verify**: Menu is completely hidden (correct!)

#### Step 2: Open Mobile Menu
1. Click hamburger button [☰] in the header (top-left)
2. Menu should slide in from left
3. Dark overlay should appear

**Expected View:**
```
┌──────────────┬─────┐
│ Nabung Emas  │Head │
├──────────────┼─────┤
│              │░░░░░│
│ 🏠 Dashboard │░░░░░│ ← Icon + Label visible
│ 💰 Tabungan  │░░░░░│ ← Icon + Label visible
│ ✨ Emas      │░░░░░│ ← Icon + Label visible
│ ⚙️  Settings  │░░░░░│ ← Icon + Label visible
└──────────────┴─────┘
```

✅ **Verify**: Icons AND labels are visible (full menu)

#### Step 3: Close Mobile Menu
1. Click the dark overlay
2. Menu slides out and disappears

**Expected View:**
```
┌────────────────────┐
│ [☰] Search  [🔔][👤]│
├────────────────────┤
│   Content Back     │
└────────────────────┘
```

✅ **Verify**: Menu completely hidden again

---

## What to Look For

### ✅ Correct Behavior

**Desktop Collapsed (80px):**
- Icons: ✅ Visible
- Labels: ❌ Hidden
- Tooltips: ✅ Show on hover
- Width: 80px

**Desktop Open (256px):**
- Icons: ✅ Visible
- Labels: ✅ Visible
- Width: 256px

**Mobile Closed:**
- Icons: ❌ Not visible (menu hidden)
- Labels: ❌ Not visible (menu hidden)
- Width: 0px

**Mobile Open (256px):**
- Icons: ✅ Visible
- Labels: ✅ Visible
- Width: 256px
- Overlay: ✅ Dark background

### ❌ Issues to Check

If icons are NOT visible when they should be:

1. **Check icon import**
   ```javascript
   // Should be imported in SideMenu.vue
   import { HomeIcon, BanknotesIcon, ... } from '@heroicons/vue/24/outline'
   ```

2. **Check icon prop**
   ```vue
   <!-- Should pass icon component, not string -->
   <MenuItem :icon="HomeIcon" />
   ```

3. **Check Tailwind classes**
   ```vue
   <!-- Icon div should have these classes -->
   <div class="flex items-center justify-center w-5 h-5">
   ```

4. **Check component rendering**
   ```vue
   <!-- Icon should be rendered with component :is -->
   <component :is="icon" class="w-5 h-5" />
   ```

5. **Check menu width**
   - Open DevTools
   - Inspect the side menu div
   - Check computed width:
     - Mobile closed: 0px ✓
     - Mobile open: 256px ✓
     - Desktop collapsed: 80px ✓
     - Desktop open: 256px ✓

---

## Browser Console Check

Open console (F12 → Console) and check for errors:

❌ **If you see these errors:**
```
Cannot resolve component: HomeIcon
Module not found: @heroicons/vue
```

✅ **Run this command:**
```bash
npm install @heroicons/vue
```

---

## Visual Checklist

Use this to verify each state:

### Desktop Open (> 1024px, menu expanded)
- [ ] Icons visible (🏠 💰 ✨ ⚙️)
- [ ] Labels visible (Dashboard, Tabungan, etc.)
- [ ] Width approximately 256px
- [ ] No dark overlay

### Desktop Collapsed (> 1024px, menu collapsed)
- [ ] Icons visible (🏠 💰 ✨ ⚙️)
- [ ] Labels NOT visible
- [ ] Width approximately 80px
- [ ] Tooltips show on icon hover
- [ ] No dark overlay

### Mobile Open (< 1024px, menu open)
- [ ] Icons visible (🏠 💰 ✨ ⚙️)
- [ ] Labels visible (Dashboard, Tabungan, etc.)
- [ ] Width approximately 256px
- [ ] Dark overlay visible
- [ ] Hamburger in header (not in menu)

### Mobile Closed (< 1024px, menu closed)
- [ ] Icons NOT visible
- [ ] Labels NOT visible
- [ ] Width 0px
- [ ] No overlay
- [ ] Hamburger in header

---

## DevTools Inspection

### Check Element Styles

1. Open DevTools (F12)
2. Click Elements tab
3. Select the side menu div
4. Check Computed styles:

**Desktop Collapsed:**
```
width: 80px ✓
overflow: hidden ✓
```

**Desktop Open:**
```
width: 256px ✓
overflow: hidden ✓
```

**Mobile Open:**
```
width: 256px ✓
overflow: hidden ✓
```

**Mobile Closed:**
```
width: 0px ✓
overflow: hidden ✓
```

### Check MenuItem

1. Select a MenuItem (e.g., Dashboard link)
2. Check the icon div:
```
display: flex ✓
width: 20px (w-5) ✓
height: 20px (h-5) ✓
```

3. Check the icon SVG:
```
width: 20px ✓
height: 20px ✓
(should see the actual SVG path)
```

---

## Screenshot Comparison

### Expected Screenshots

**Desktop Collapsed:**
```
┌──┐
│☰ │ ← Hamburger
├──┤
│🏠│ ← Home icon
│💰│ ← Money icon
│✨│ ← Star icon
│⚙️ │ ← Settings icon
│  │
│😊│ ← User avatar
└──┘
```

**Desktop Open:**
```
┌─────────────────┐
│ [☰] Nabung Emas │ ← Hamburger + Title
├─────────────────┤
│ 🏠 Dashboard    │ ← Icon + Label
│ 💰 Tabungan     │
│ ✨ Emas         │
│ ⚙️  Settings     │
│                 │
│ 😊 User Name    │ ← Avatar + Name
│   user@email    │
└─────────────────┘
```

**Mobile Open:**
```
┌─────────────────┬────┐
│  Nabung Emas    │Hdr │
├─────────────────┼────┤
│                 │████│ ← Overlay
│ 🏠 Dashboard    │████│
│ 💰 Tabungan     │████│
│ ✨ Emas         │████│
│ ⚙️  Settings     │████│
│                 │████│
│ 😊 User Name    │████│
└─────────────────┴────┘
```

---

## Summary

Icons should be visible in these states:
1. ✅ Desktop open
2. ✅ Desktop collapsed
3. ✅ Mobile open
4. ❌ Mobile closed (correct - menu is hidden)

If you see icons in all three "should be visible" states, the implementation is correct and matches Gmail exactly! 🎉

---

**Test Now**: http://localhost:3001/dashboard

