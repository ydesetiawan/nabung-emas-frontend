# EmasGo API Integration - Quick Reference

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Update .env with your backend URL if different from default
# NUXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. Install Dependencies (if needed)
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```

## 📡 API Usage

### Authenticated Requests
Use `$api` for requests that require authentication:

```typescript
const { $api } = useNuxtApp()

// GET request
const response = await $api<IAPIResponse<IPocket[]>>(
    API_ENDPOINTS.pockets.list
)
const pockets = response.data

// POST request
const newPocket = await $api<IAPIResponse<IPocket>>(
    API_ENDPOINTS.pockets.create,
    {
        method: 'POST',
        body: {
            typePocketId: '123',
            name: 'My Pocket',
            targetWeight: 50,
        },
    }
)

// PATCH request
const updated = await $api<IAPIResponse<IPocket>>(
    API_ENDPOINTS.pockets.update('pocket-id'),
    {
        method: 'PATCH',
        body: { name: 'Updated Name' },
    }
)

// DELETE request
await $api(API_ENDPOINTS.pockets.delete('pocket-id'), {
    method: 'DELETE',
})
```

### Public Requests
Use `$publicApi` for requests that don't require authentication:

```typescript
const { $publicApi } = useNuxtApp()

const typePockets = await $publicApi<IAPIResponse<ITypePocket[]>>(
    API_ENDPOINTS.typePockets.list
)
```

## 🔐 Authentication

### Login
```typescript
const { $api } = useNuxtApp()

const response = await $api<IAPIResponse<IAuthResponse>>(
    API_ENDPOINTS.auth.login,
    {
        method: 'POST',
        body: {
            email: 'user@example.com',
            password: 'password',
            rememberMe: false,
        },
    }
)

// Tokens are automatically stored in cookies
const { accessToken, refreshToken, user } = response.data
```

### Register
```typescript
const response = await $api<IAPIResponse<IAuthResponse>>(
    API_ENDPOINTS.auth.register,
    {
        method: 'POST',
        body: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+62 812 3456 7890',
            password: 'SecurePass123',
            confirmPassword: 'SecurePass123',
        },
    }
)
```

### Get Current User
```typescript
const response = await $api<IAPIResponse<IUser>>(
    API_ENDPOINTS.auth.me
)
const user = response.data
```

### Logout
```typescript
await $api(API_ENDPOINTS.auth.logout, { method: 'POST' })
// Tokens are automatically cleared
```

## 📦 Using Stores

### Pocket Store
```typescript
const pocketStore = usePocketStore()

// Fetch all pockets
await pocketStore.fetchPockets()

// Access pockets
const pockets = pocketStore.pockets

// Create pocket
const newPocket = await pocketStore.createPocket({
    typePocketId: 'type-id',
    name: 'My Pocket',
    description: 'Description',
    targetWeight: 50,
})

// Update pocket
await pocketStore.updatePocket('pocket-id', {
    name: 'Updated Name',
})

// Delete pocket
await pocketStore.deletePocket('pocket-id')
```

### Transaction Store
```typescript
const transactionStore = useTransactionStore()

// Fetch all transactions
await transactionStore.fetchTransactions()

// Fetch transactions for specific pocket
await transactionStore.fetchTransactions('pocket-id')

// Create transaction
const newTransaction = await transactionStore.createTransaction({
    pocketId: 'pocket-id',
    transactionDate: '2025-11-25',
    brand: 'Antam',
    weight: 2.5,
    pricePerGram: 1050000,
    totalPrice: 2625000,
    description: 'Monthly purchase',
})
```

## 🔄 Data Transformation

All data is automatically transformed between snake_case (API) and camelCase (frontend):

### Request (Frontend → API)
```typescript
// Frontend sends:
{
    typePocketId: '123',
    targetWeight: 50
}

// API receives:
{
    type_pocket_id: '123',
    target_weight: 50
}
```

### Response (API → Frontend)
```typescript
// API returns:
{
    type_pocket_id: '123',
    aggregate_total_weight: 100.5,
    created_at: '2025-11-25T10:00:00Z'
}

// Frontend receives:
{
    typePocketId: '123',
    aggregateTotalWeight: 100.5,
    createdAt: '2025-11-25T10:00:00Z'
}
```

## 🎯 API Endpoints Reference

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset

### Profile
- `GET /profile` - Get user profile
- `PATCH /profile` - Update profile
- `POST /profile/change-password` - Change password

### Type Pockets (Public)
- `GET /type-pockets` - List all pocket types
- `GET /type-pockets/:id` - Get pocket type by ID

### Pockets (Authenticated)
- `GET /pockets` - List user's pockets
- `POST /pockets` - Create new pocket
- `GET /pockets/:id` - Get pocket by ID
- `PATCH /pockets/:id` - Update pocket
- `DELETE /pockets/:id` - Delete pocket
- `GET /pockets/:id/stats` - Get pocket statistics

### Transactions (Authenticated)
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Get transaction by ID
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Analytics (Authenticated)
- `GET /analytics/dashboard` - Get dashboard data
- `GET /analytics/portfolio` - Get portfolio analytics
- `GET /analytics/monthly-purchases` - Get monthly purchase trends
- `GET /analytics/brand-distribution` - Get brand distribution
- `GET /analytics/trends` - Get trend analytics

### Settings (Authenticated)
- `GET /settings` - Get user settings
- `PATCH /settings` - Update settings

## 🛠️ Troubleshooting

### 401 Unauthorized Error
- Tokens are automatically cleared and user is redirected to login
- Check if backend is running on `http://localhost:8080`
- Verify API base URL in `.env`

### CORS Errors
- Ensure backend has CORS enabled for frontend origin
- Check backend CORS configuration

### Data Not Transforming
- Verify API response follows the standard format:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

## 📚 Type Definitions

All types are available in `app/types/`:
- `auth.ts` - Authentication and user types
- `api.ts` - API response wrappers
- `pocket.ts` - Pocket types
- `transaction.ts` - Transaction types
- `type-pocket.ts` - Type pocket (category) types
- `analytics.ts` - Analytics types
- `settings.ts` - Settings types

## 🔗 Related Files

- `app/plugins/api.ts` - API plugin with interceptors
- `app/utils/apiTransformers.ts` - Data transformation utilities
- `app/utils/constants.ts` - API endpoints and constants
- `app/stores/pocket.ts` - Pocket store
- `app/stores/transaction.ts` - Transaction store
- `app/stores/settings.ts` - Settings store

## 📝 Next Steps

1. ✅ Phase 1: Foundation (Completed)
2. 🔄 Phase 2: Authentication (In Progress)
   - Create auth store
   - Create auth pages (login, register, forgot password)
   - Create auth middleware
3. ⏳ Phase 3: Core Resources
   - Update pocket store with new endpoints
   - Update transaction store with pagination
   - Create type pocket store
4. ⏳ Phase 4: Analytics & Settings
   - Create analytics store
   - Update settings store with API
5. ⏳ Phase 5: Testing & Polish
   - Test all integrations
   - Add error handling
   - Add loading states
