# Nabung Emas Frontend - Migration Notes

## Migration from Next.js to Nuxt 4 + Vue 3

This document outlines the key changes made during the migration from the Next.js/React implementation to Nuxt 4/Vue 3.

### Key Changes

#### 1. **Framework Migration**
- **From**: Next.js 15 + React 19
- **To**: Nuxt 4 + Vue 3
- **Reason**: Better TypeScript integration, auto-imports, and SSR flexibility

#### 2. **Component Syntax**
- **From**: JSX/TSX with React components
- **To**: Vue SFC (Single File Components) with `<script setup>`
- **Example**:
  ```tsx
  // React (Before)
  export function PortfolioCard() {
    const stats = calculatePortfolioStats()
    return <div>...</div>
  }
  ```
  ```vue
  <!-- Vue (After) -->
  <script setup lang="ts">
  const stats = computed(() => calculatePortfolioStats())
  </script>
  <template>
    <div>...</div>
  </template>
  ```

#### 3. **State Management**
- **From**: React hooks (useState, useEffect)
- **To**: Vue Composition API (ref, computed, watch)
- **Global State**: Pinia (similar to Zustand/Redux)

#### 4. **Routing**
- **From**: Next.js App Router (file-based)
- **To**: Nuxt Pages (file-based, similar concept)
- **Auto-routing**: Both support file-based routing

#### 5. **Styling**
- **From**: Tailwind CSS v4 with `@import "tailwindcss"`
- **To**: Tailwind CSS v3 with `@tailwind` directives
- **Theme**: Maintained the same color scheme and design tokens

#### 6. **Type Safety**
- **Interface Naming**: All interfaces now use `I` prefix (IPocket, ITransaction)
- **Auto-imports**: Nuxt auto-imports composables, components, and utils
- **No explicit imports needed** for Vue APIs (ref, computed, etc.)

#### 7. **API Layer**
- **Maintained**: Same API wrapper pattern ($api, $publicApi)
- **Implementation**: Moved from Next.js middleware to Nuxt plugins
- **Location**: `app/plugins/api.ts`

#### 8. **i18n**
- **From**: React Context API
- **To**: Vue composable with VueUse's `useLocalStorage`
- **Maintained**: Same translation structure and language support

### Component Mapping

| React Component | Vue Component | Notes |
|----------------|---------------|-------|
| `layout.tsx` | `layouts/default.vue` | Layout wrapper |
| `page.tsx` | `pages/index.vue` | Dashboard page |
| `*.tsx` components | `*.vue` components | All UI components |
| `use*` hooks | `use*` composables | Composables auto-imported |

### File Structure Changes

```
Before (Next.js):
app/
├── layout.tsx
├── page.tsx
├── globals.css
components/
lib/

After (Nuxt):
app/
├── assets/css/main.css
├── components/
├── composables/
├── layouts/
├── pages/
├── plugins/
├── types/
└── utils/
```

### Breaking Changes

1. **No Client Components**: Removed `"use client"` directives
2. **No Server Components**: SSR disabled (SPA mode)
3. **Event Handling**: `onClick` → `@click`, `onChange` → `@input`
4. **Conditional Rendering**: `{condition && <Component />}` → `<Component v-if="condition" />`
5. **List Rendering**: `.map()` → `v-for`

### Improvements

1. **Auto-imports**: No need to import Vue APIs or components
2. **Better TypeScript**: Nuxt 4 has improved TypeScript support
3. **Composables**: More reusable logic patterns
4. **Plugin System**: Cleaner dependency injection
5. **File-based Routing**: Simpler page organization

### Migration Checklist

- [x] Setup Nuxt 4 project
- [x] Install dependencies (Pinia, Tailwind, VeeValidate, etc.)
- [x] Configure Tailwind with theme variables
- [x] Create layout and navigation components
- [x] Migrate UI components (Button, Card, Input, etc.)
- [x] Convert dashboard components to Vue
- [x] Setup i18n with composables
- [x] Create API plugin
- [x] Update TypeScript interfaces with I prefix
- [x] Create mock data utilities
- [x] Test dashboard page
- [ ] Migrate remaining pages (Pockets, Transactions, Analytics, Profile)
- [ ] Add form validation with VeeValidate
- [ ] Implement Pinia stores for state management
- [ ] Add E2E tests
- [ ] Deploy to production

### Next Steps

1. **Complete Page Migration**: Migrate remaining pages from Next.js
2. **Add Real API Integration**: Connect to backend API
3. **Implement Authentication**: Add user authentication flow
4. **Add Tests**: Unit tests with Vitest, E2E with Playwright
5. **Performance Optimization**: Code splitting, lazy loading
6. **PWA Support**: Add offline capabilities

### Resources

- [Nuxt 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Project Guidelines](.github/copilot-instructions.md)
