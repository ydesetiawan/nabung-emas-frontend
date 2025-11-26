# EmasGo API Integration - Implementation Summary

## ✅ Completed (Phase 1: Foundation)

### 1. API Transformers Utility (`app/utils/apiTransformers.ts`)
- ✅ Created utility functions to convert between snake_case (API) and camelCase (frontend)
- ✅ `toSnakeCase()` - Converts object keys to snake_case
- ✅ `toCamelCase()` - Converts object keys to camelCase
- ✅ `transformRequest()` - Transforms request data before sending to API
- ✅ `transformResponse()` - Transforms response data after receiving from API
- ✅ `transformError()` - Transforms API error responses
- ✅ Handles nested objects and arrays recursively

### 2. Updated API Endpoints (`app/utils/constants.ts`)
- ✅ Updated `API_ENDPOINTS` to match EmasGo backend structure
- ✅ Organized endpoints by resource:
  - Authentication: register, login, logout, me, refresh, forgotPassword
  - Profile: get, update, changePassword
  - Type Pockets: list, getById
  - Pockets: list, create, getById, update, delete, stats
  - Transactions: list, create, getById, update, delete
  - Analytics: dashboard, portfolio, monthlyPurchases, brandDistribution, trends
  - Settings: get, update

### 3. Type Definitions

#### Authentication Types (`app/types/auth.ts`)
- ✅ `IUser` - User profile data
- ✅ `IAuthResponse` - Login/Register response with tokens
- ✅ `ILoginRequest` - Login credentials
- ✅ `IRegisterRequest` - Registration data
- ✅ `IForgotPasswordRequest` - Password reset request
- ✅ `IChangePasswordRequest` - Change password data
- ✅ `IRefreshTokenRequest` - Token refresh request
- ✅ `IProfileUpdateRequest` - Profile update data

#### Analytics Types (`app/types/analytics.ts`)
- ✅ `IDashboardData` - Dashboard statistics
- ✅ `IPortfolioData` - Portfolio analytics
- ✅ `IMonthlyPurchases` - Monthly purchase trends
- ✅ `IBrandDistribution` - Brand distribution data
- ✅ `ITrends` - Trend analytics
- ✅ `IAnalyticsParams` - Query parameters for analytics

#### Settings Types (`app/types/settings.ts`)
- ✅ `ISettings` - User settings (language, theme, notifications)
- ✅ `INotificationSettings` - Notification preferences
- ✅ `ISettingsUpdateRequest` - Settings update data

### 4. Updated API Plugin (`app/plugins/api.ts`)
- ✅ Token management with httpOnly cookies
  - `access_token` - 7 days expiry
  - `refresh_token` - 30 days expiry
- ✅ Request interceptor:
  - Transforms request body to snake_case
  - Adds Authorization header with access token
- ✅ Response interceptor:
  - Transforms response data to camelCase
- ✅ Error interceptor:
  - Transforms error responses
  - Handles 401 Unauthorized (redirects to login)
- ✅ Exposed `refreshAccessToken()` for manual token refresh
- ✅ Separate `$api` (authenticated) and `$publicApi` (public) wrappers

### 5. Documentation
- ✅ Created comprehensive API integration plan
- ✅ Documented field name mappings
- ✅ Documented API response format
- ✅ Documented authentication flow

## 📋 Next Steps (Phase 2: Authentication)

### 1. Create Auth Store (`app/stores/auth.ts`)
```typescript
export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<IUser | null>(null)
    const isAuthenticated = computed(() => !!user.value)
    
    // Actions
    async function login(credentials: ILoginRequest)
    async function register(data: IRegisterRequest)
    async function logout()
    async function getCurrentUser()
    async function forgotPassword(email: string)
    
    return { user, isAuthenticated, login, register, logout, getCurrentUser, forgotPassword }
})
```

### 2. Create Auth Composable (`app/composables/useAuth.ts`)
- Wrapper for auth store with reactive state
- Computed properties: `isAuthenticated`, `currentUser`
- Methods: `login`, `logout`, `register`

### 3. Create Authentication Pages
- `/login` - Login page with form validation
- `/register` - Registration page
- `/forgot-password` - Password reset page

### 4. Create Auth Middleware (`app/middleware/auth.ts`)
- Check if user is authenticated
- Redirect to login if not authenticated
- Apply to protected routes

## 📋 Phase 3: Core Resources

### 1. Update Pocket Store
- ✅ Already created, needs updates:
  - Update endpoint calls to use new `API_ENDPOINTS.pockets.*`
  - Add `fetchPocketStats()` method
  - Ensure proper error handling

### 2. Update Transaction Store
- ✅ Already created, needs updates:
  - Update endpoint calls to use new `API_ENDPOINTS.transactions.*`
  - Add pagination support
  - Add filtering support (by pocket, brand, date range)

### 3. Create Type Pocket Store (`app/stores/typePocket.ts`)
```typescript
export const useTypePocketStore = defineStore('typePocket', () => {
    const typePockets = ref<ITypePocket[]>([])
    
    async function fetchTypePockets()
    async function fetchTypePocketById(id: string)
    
    return { typePockets, fetchTypePockets, fetchTypePocketById }
})
```

## 📋 Phase 4: Analytics & Settings

### 1. Create Analytics Store (`app/stores/analytics.ts`)
```typescript
export const useAnalyticsStore = defineStore('analytics', () => {
    const dashboard = ref<IDashboardData | null>(null)
    const portfolio = ref<IPortfolioData | null>(null)
    
    async function fetchDashboard(currentGoldPrice?: number)
    async function fetchPortfolio(currentGoldPrice?: number)
    async function fetchMonthlyPurchases(params: IAnalyticsParams)
    async function fetchBrandDistribution()
    async function fetchTrends(params: IAnalyticsParams)
    
    return { dashboard, portfolio, ... }
})
```

### 2. Update Settings Store
- Add API integration for settings persistence
- Methods: `fetchSettings()`, `updateSettings()`
- Sync with backend instead of localStorage only

## 📋 Phase 5: Testing & Polish

1. Test all API integrations
2. Add error handling with toast notifications
3. Add loading states to all async operations
4. Add success/error notifications
5. Test authentication flow
6. Test CRUD operations
7. Test analytics data fetching

## 🔧 Environment Configuration

Create `.env` file:
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Update `nuxt.config.ts`:
```typescript
runtimeConfig: {
    public: {
        apiBaseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
    },
},
```

## 📝 Field Name Mappings

The API transformers automatically handle these conversions:

**API (snake_case) → Frontend (camelCase):**
- `type_pocket_id` → `typePocketId`
- `aggregate_total_price` → `aggregateTotalPrice`
- `aggregate_total_weight` → `aggregateTotalWeight`
- `target_weight` → `targetWeight`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`
- `transaction_date` → `transactionDate`
- `price_per_gram` → `pricePerGram`
- `total_price` → `totalPrice`
- `receipt_image` → `receiptImage`
- `full_name` → `fullName`
- `access_token` → `accessToken`
- `refresh_token` → `refreshToken`

## 🔐 Authentication Flow

1. User logs in → Receive `access_token` and `refresh_token`
2. Store tokens in httpOnly cookies
3. Include `access_token` in Authorization header for all authenticated requests
4. On 401 response → Clear tokens and redirect to login
5. User can manually refresh token using `$refreshAccessToken()`

## 📊 API Response Format

All API responses follow this structure:

```typescript
{
  "success": true,
  "data": T,
  "message": "Success message"
}
```

Error responses:
```typescript
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["validation error"]
  }
}
```

## 🎯 Usage Examples

### Using $api for authenticated requests:
```typescript
const { $api } = useNuxtApp()

// GET request
const response = await $api<IAPIResponse<IPocket[]>>(API_ENDPOINTS.pockets.list)
const pockets = response.data // Already transformed to camelCase

// POST request
const newPocket = await $api<IAPIResponse<IPocket>>(
    API_ENDPOINTS.pockets.create,
    {
        method: 'POST',
        body: {
            typePocketId: '123',
            name: 'My Pocket',
            description: 'Description',
            targetWeight: 50,
        }, // Will be transformed to snake_case
    }
)
```

### Using $publicApi for public requests:
```typescript
const { $publicApi } = useNuxtApp()

const typePockets = await $publicApi<IAPIResponse<ITypePocket[]>>(
    API_ENDPOINTS.typePockets.list
)
```

## 🚀 Ready to Proceed

Phase 1 (Foundation) is complete! We can now proceed with:
1. Phase 2: Authentication (auth store, pages, middleware)
2. Phase 3: Update existing stores with new API endpoints
3. Phase 4: Analytics and settings integration
4. Phase 5: Testing and polish

Would you like me to proceed with Phase 2 (Authentication) next?
