# AddPocketSheet API Integration

## Summary
Successfully integrated the AddPocketSheet component with the EmasGo backend API for creating and updating pockets.

## Changes Made

### 1. **API Integration** ✅

#### Stores Integration
- **Pocket Store**: Integrated `createPocket()` and `updatePocket()` methods
- **Type Pocket Store**: Integrated `fetchTypePockets()` to load real pocket categories

#### Request/Response Handling
- **Endpoint**: `POST /api/v1/pockets`
- **Request Body** (snake_case via API transformer):
  ```json
  {
    "type_pocket_id": "uuid",
    "name": "Wedding Fund",
    "description": "Saving for my wedding",
    "target_weight": 50.0
  }
  ```
- **Response** (camelCase via API transformer):
  ```json
  {
    "success": true,
    "message": "Pocket created successfully",
    "data": {
      "id": "uuid",
      "typePocketId": "uuid",
      "name": "Wedding Fund",
      "description": "Saving for my wedding",
      "aggregateTotalPrice": 0,
      "aggregateTotalWeight": 0,
      "targetWeight": 50.0,
      "createdAt": "2025-11-26T08:00:00Z"
    }
  }
  ```

### 2. **Replaced Mock Data** ✅

**Before:**
```vue
v-for="type in mockTypePockets"
```

**After:**
```vue
v-for="type in typePocketStore.typePocketList"
```

- Fetches real type pockets from API on component mount
- Uses cached data when available (1-hour cache)
- Shows loading state while fetching

### 3. **Enhanced Validation** ✅

Updated validation rules to match API specification:

| Field | Validation Rules |
|-------|-----------------|
| `typePocketId` | Required, must be valid UUID |
| `name` | Required, 3-100 characters (was 3-50) |
| `description` | Optional, max 500 characters (was 200) |
| `targetWeight` | Optional, must be > 0 if provided, max 10,000g |

### 4. **Error Handling** ✅

Implemented comprehensive error handling with user-friendly messages:

```typescript
// Context-specific error messages
if (error.message?.includes('type_pocket_id')) {
  apiError.value = 'Invalid pocket type selected. Please try again.'
} else if (error.message?.includes('name')) {
  apiError.value = 'Invalid pocket name. Please check your input.'
} else if (error.message?.includes('Network')) {
  apiError.value = 'Unable to connect to server. Please check your internet connection.'
} else if (error.message?.includes('401')) {
  apiError.value = 'Your session has expired. Please login again.'
  await navigateTo('/login')
}
```

**Error Display:**
- Red alert banner at top of form
- Dismissible with X button
- Clear, actionable messages
- Auto-redirect to login on auth errors

### 5. **Loading States** ✅

Added loading indicators for better UX:

1. **Type Pockets Loading**:
   ```vue
   <div v-if="typePocketStore.isLoading">
     <Icon name="heroicons:arrow-path" class="animate-spin" />
     <p>Loading pocket types...</p>
   </div>
   ```

2. **Submit Loading**:
   ```vue
   <button :disabled="isSubmitting">
     <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin" />
     <span>{{ isSubmitting ? 'Saving...' : 'Create Pocket' }}</span>
   </button>
   ```

### 6. **Form Reset Behavior** ✅

Improved form reset logic:
- Resets form when opening in create mode
- Preserves data when opening in edit mode
- Clears errors and API errors on reset
- Resets after successful submission

## Files Modified

### `/app/components/Page/Pocket/AddPocketSheet.vue`

**Script Changes:**
- Added `pocketStore` and `typePocketStore` imports
- Added `onMounted` hook to fetch type pockets
- Replaced simulated API call with real `createPocket()` / `updatePocket()`
- Added `apiError` state for API error display
- Enhanced error handling with context-specific messages
- Updated validation to match API spec (100 char name, 500 char description)

**Template Changes:**
- Replaced `mockTypePockets` with `typePocketStore.typePocketList`
- Added API error alert banner
- Added loading state for type pockets
- Updated character limits (name: 50→100, description: 200→500)
- Added description error display

## API Specification Compliance

### Request Format ✅
- ✅ `type_pocket_id`: UUID (required)
- ✅ `name`: 3-100 characters (required)
- ✅ `description`: max 500 characters (optional)
- ✅ `target_weight`: > 0 (optional)

### Response Handling ✅
- ✅ Handles 201 Created for new pockets
- ✅ Handles 200 OK for updates
- ✅ Parses error responses
- ✅ Updates local state with response data

### Authentication ✅
- ✅ Uses `$api` for authenticated requests
- ✅ Automatically includes Bearer token
- ✅ Redirects to login on 401 errors

### Data Transformation ✅
- ✅ Request body transformed to snake_case
- ✅ Response data transformed to camelCase
- ✅ Handled by API plugin automatically

## Testing Checklist

- [ ] Create new pocket with valid data → Should save successfully
- [ ] Create pocket without selecting type → Should show validation error
- [ ] Create pocket with name < 3 chars → Should show validation error
- [ ] Create pocket with name > 100 chars → Should show validation error
- [ ] Create pocket with description > 500 chars → Should show validation error
- [ ] Create pocket with negative target weight → Should show validation error
- [ ] Edit existing pocket → Should update successfully
- [ ] Submit while offline → Should show network error
- [ ] Submit with expired token → Should redirect to login
- [ ] Type pockets loading → Should show loading state
- [ ] API error → Should display error banner with dismiss button

## Integration Points

### Stores Used
1. **`usePocketStore()`**
   - `createPocket(data)` - Creates new pocket
   - `updatePocket(id, data)` - Updates existing pocket

2. **`useTypePocketStore()`**
   - `fetchTypePockets()` - Loads pocket categories
   - `typePocketList` - Computed list of categories
   - `isLoading` - Loading state

### Events Emitted
- `success` - Emitted after successful creation with created pocket data
- `update` - Emitted after successful update with updated pocket data
- `update:open` - Emitted to close the sheet

## Next Steps (Optional)

- [ ] Add success toast notification after creation/update
- [ ] Add optimistic UI updates
- [ ] Add form dirty state tracking
- [ ] Add confirmation dialog for unsaved changes
- [ ] Add image upload for pocket icon/cover
- [ ] Add pocket templates/presets
- [ ] Add bulk pocket creation

## Notes

- The component automatically fetches type pockets on mount
- Type pockets are cached for 1 hour to reduce API calls
- All API errors are caught and displayed with user-friendly messages
- Form validation happens client-side before API call
- Server-side validation errors are also handled and displayed
- The component works for both create and edit modes
