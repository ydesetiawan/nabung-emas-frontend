# Refactoring Summary: API Calls to Composables

## Overview
Refactored all pages to move API calls into composables and removed localStorage persistence from stores (except for auth, settings, and typePocket stores as requested).

## Changes Made

### 1. Created New Composables

#### `/app/composables/usePocketApi.ts`
- Handles all pocket-related API calls
- Functions:
  - `fetchPockets()` - Get all pockets
  - `fetchPocketById(id)` - Get single pocket
  - `createPocket(data)` - Create new pocket
  - `updatePocket(id, data)` - Update pocket
  - `deletePocket(id)` - Delete pocket

#### `/app/composables/useTransactionApi.ts`
- Handles all transaction-related API calls
- Functions:
  - `fetchTransactions(pocketId?)` - Get all transactions (optionally filtered)
  - `fetchTransactionById(id)` - Get single transaction
  - `createTransaction(data)` - Create new transaction
  - `updateTransaction(id, data)` - Update transaction
  - `deleteTransaction(id)` - Delete transaction

#### `/app/composables/useAnalyticsApi.ts`
- Handles all analytics-related API calls
- Functions:
  - `fetchDashboard(currentGoldPrice?)` - Get dashboard data
  - `fetchPortfolio(currentGoldPrice?)` - Get portfolio analytics
  - `fetchMonthlyPurchases(params)` - Get monthly purchase trends
  - `fetchBrandDistribution()` - Get brand distribution
  - `fetchTrends(params)` - Get trend analytics

### 2. Refactored Stores

#### `/app/stores/pocket.ts`
**Before:**
- Used `useLocalStorage` for state persistence
- Direct API calls using `$api`

**After:**
- Uses regular `ref()` for state (no localStorage)
- Uses `usePocketApi()` composable for all API calls
- Cleaner separation of concerns

#### `/app/stores/transaction.ts`
**Before:**
- Used `useLocalStorage` for state persistence
- Direct API calls using `$api`

**After:**
- Uses regular `ref()` for state (no localStorage)
- Uses `useTransactionApi()` composable for all API calls
- Cleaner separation of concerns

#### `/app/stores/analytics.ts`
**Before:**
- Used `useLocalStorage` for state persistence
- Had caching logic with timestamps
- Direct API calls using `$api`

**After:**
- Uses regular `ref()` for state (no localStorage)
- Removed caching logic (data is fresh from API)
- Uses `useAnalyticsApi()` composable for all API calls
- Removed `clearCache()` and cache-related computed properties

### 3. Stores NOT Modified (As Requested)
- `/app/stores/auth.ts` - Still uses localStorage
- `/app/stores/settings.ts` - Still uses localStorage
- `/app/stores/typePocket.ts` - Still uses localStorage

## Benefits

1. **Separation of Concerns**: API logic is now separate from state management
2. **Reusability**: Composables can be used directly in pages/components without stores
3. **No localStorage Pollution**: Data is fetched fresh from API, not persisted locally
4. **Cleaner Code**: Stores are now focused on state management only
5. **Better Testing**: API calls can be mocked at the composable level
6. **Type Safety**: All composables maintain full TypeScript type safety

## Migration Notes

### For Pages
Pages don't need any changes - they continue to use stores as before:
```typescript
const pocketStore = usePocketStore()
await pocketStore.fetchPockets()
```

### For Direct API Access
If you need to call API directly without store:
```typescript
const pocketApi = usePocketApi()
const pockets = await pocketApi.fetchPockets()
```

## Data Flow

**Before:**
```
Page → Store (with localStorage) → API
```

**After:**
```
Page → Store (no localStorage) → Composable → API
```

## Breaking Changes
None - All public APIs of stores remain the same. Pages continue to work without modification.

## TypeScript Notes
The `$api` type warnings in composables are expected and can be ignored - they're properly typed at runtime through the Nuxt plugin system.
