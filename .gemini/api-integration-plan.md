# EmasGo API Integration Plan

## Overview
This document outlines the integration of the EmasGo frontend with the backend API based on the Postman collection specification.

## API Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: To be configured via environment variable `NUXT_PUBLIC_API_BASE_URL`

## Key Changes Required

### 1. Update API Endpoints Constants
The current endpoints use `/api/` prefix, but the backend uses `/api/v1/`. Need to update:
- Authentication endpoints
- All resource endpoints

### 2. Add Missing Type Definitions

#### Authentication Types
- `IUser` - User profile data
- `IAuthResponse` - Login/Register response with tokens
- `ILoginRequest` - Login credentials
- `IRegisterRequest` - Registration data
- `IForgotPasswordRequest` - Password reset request

#### Analytics Types
- `IDashboardData` - Dashboard statistics
- `IPortfolioData` - Portfolio analytics
- `IMonthlyPurchases` - Monthly purchase trends
- `IBrandDistribution` - Brand distribution data
- `ITrends` - Trend analytics

#### Settings Types
- `ISettings` - User settings (language, theme, notifications)

### 3. Create New Stores

#### Auth Store (`app/stores/auth.ts`)
- State: user, tokens (access_token, refresh_token)
- Actions: login, register, logout, refreshToken, getCurrentUser, forgotPassword
- Token management with cookies
- Auto-refresh token logic

#### Type Pocket Store (`app/stores/typePocket.ts`)
- State: typePockets (categories for pockets)
- Actions: fetchTypePockets, fetchTypePocketById
- Public endpoints (no auth required)

#### Analytics Store (`app/stores/analytics.ts`)
- State: dashboard data, portfolio, trends
- Actions: fetchDashboard, fetchPortfolio, fetchMonthlyPurchases, fetchBrandDistribution, fetchTrends
- Cache management for analytics data

### 4. Update Existing Stores

#### Pocket Store
- Update API endpoints to match backend
- Add `fetchPocketStats` method
- Update field names to match API (snake_case to camelCase conversion)

#### Transaction Store
- Update API endpoints
- Add query parameter support (pagination, filtering)
- Update field names mapping

#### Settings Store
- Add API integration for settings persistence
- Add methods: fetchSettings, updateSettings

### 5. Update API Plugin

#### Token Management
- Store tokens in httpOnly cookies for security
- Add token refresh interceptor
- Handle 401 responses with automatic token refresh
- Redirect to login on authentication failure

#### Request/Response Interceptors
- Add request interceptor to include Authorization header
- Add response interceptor for error handling
- Transform snake_case API responses to camelCase for frontend

### 6. Field Name Mapping

The API uses snake_case while the frontend uses camelCase. Need to add transformers:

**API → Frontend:**
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

### 7. Create Utility Functions

#### API Transformers (`app/utils/apiTransformers.ts`)
- `toSnakeCase(obj)` - Convert object keys to snake_case
- `toCamelCase(obj)` - Convert object keys to camelCase
- `transformRequest(data)` - Transform request data before sending
- `transformResponse(data)` - Transform response data after receiving

### 8. Update Environment Configuration

Add to `.env`:
```
NUXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 9. Create Composables

#### useAuth (`app/composables/useAuth.ts`)
- Wrapper for auth store with reactive state
- Computed properties: isAuthenticated, currentUser
- Methods: login, logout, register

#### useApi (`app/composables/useApi.ts`)
- Wrapper for API calls with loading states
- Error handling with toast notifications
- Automatic retry logic for failed requests

### 10. Update Pages

#### Authentication Pages
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset page

#### Protected Pages
- Add authentication middleware
- Redirect to login if not authenticated

## Implementation Order

1. **Phase 1: Foundation**
   - Update constants with correct API endpoints
   - Create API transformers utility
   - Update API plugin with interceptors
   - Add authentication types

2. **Phase 2: Authentication**
   - Create auth store
   - Create auth composable
   - Implement login/register pages
   - Add auth middleware

3. **Phase 3: Core Resources**
   - Update pocket store with API integration
   - Update transaction store with API integration
   - Create type pocket store
   - Test CRUD operations

4. **Phase 4: Analytics & Settings**
   - Create analytics store
   - Update settings store with API
   - Implement analytics pages
   - Implement settings page

5. **Phase 5: Testing & Polish**
   - Test all API integrations
   - Add error handling
   - Add loading states
   - Add success/error notifications

## API Response Format

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

## Authentication Flow

1. User logs in → Receive access_token and refresh_token
2. Store tokens in httpOnly cookies
3. Include access_token in Authorization header for all authenticated requests
4. On 401 response → Try to refresh token
5. If refresh fails → Redirect to login

## Pagination

API supports pagination with query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort_by` - Sort field
- `sort_order` - Sort direction (asc/desc)

Response includes pagination metadata:
```typescript
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Next Steps

1. Review and approve this plan
2. Start implementation with Phase 1
3. Test each phase before moving to the next
4. Update documentation as we progress
