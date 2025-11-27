# AddTransactionSheet Updates Summary

## Overview
Updated the AddTransactionSheet component to make the total price editable and format the price per gram as currency.

## Changes Made

### 1. **Editable Total Price**
Previously, total price was auto-calculated and displayed in a read-only card. Now it's a fully editable input field.

**Before:**
- Read-only display in a gradient card
- Only calculated from weight × price per gram

**After:**
- Editable input field
- Bidirectional calculation support
- Same styling as other input fields

### 2. **Bidirectional Calculation Logic**

Added smart calculation that works both ways:

**Forward Calculation (Original):**
- When **weight** or **price per gram** changes
- Automatically calculates: `totalPrice = weight × pricePerGram`

**Reverse Calculation (New):**
- When **total price** is manually edited
- Automatically calculates: `pricePerGram = totalPrice ÷ weight`

**Implementation:**
```typescript
// Track which field was last edited
const lastEditedField = ref<'totalPrice' | 'pricePerGram' | null>(null)

// Forward calculation
watch([() => formData.value.weight, () => formData.value.pricePerGram], ([weight, price]) => {
  if (lastEditedField.value !== 'totalPrice' && weight && price) {
    formData.value.totalPrice = calculateTotalPrice(weight, price)
  }
})

// Reverse calculation
watch(() => formData.value.totalPrice, (totalPrice) => {
  if (lastEditedField.value === 'totalPrice' && formData.value.weight && totalPrice) {
    formData.value.pricePerGram = Math.round(totalPrice / formData.value.weight)
  }
})
```

### 3. **Currency Formatting for Price Per Gram**

**Added:**
- Formatted currency display below the input field
- Shows formatted value (e.g., "Rp 1,050,000") in blue text
- Only displays when a value is entered

**Implementation:**
```typescript
const formattedPricePerGram = computed(() => {
  return formData.value.pricePerGram ? formatCurrency(formData.value.pricePerGram) : ''
})
```

**UI:**
```vue
<p v-else-if="formData.pricePerGram" class="mt-2 text-sm text-blue-600 dark:text-blue-400 font-bold">
  {{ formattedPricePerGram }}
</p>
```

### 4. **Total Price Field Updates**

**New Features:**
- ✅ Editable input field (type="number")
- ✅ Step of 1000 for easier input
- ✅ Focus tracking to determine calculation direction
- ✅ Formatted currency display below input
- ✅ Helpful hint text with emoji
- ✅ Same styling as other input fields

**UI Elements:**
```vue
<input
  v-model.number="formData.totalPrice"
  type="number"
  step="1000"
  placeholder="0"
  @focus="lastEditedField = 'totalPrice'"
  class="..."
/>
<p v-else-if="formData.totalPrice" class="mt-2 text-sm text-blue-600 dark:text-blue-400 font-bold">
  {{ formatCurrency(formData.totalPrice) }}
</p>
<p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
  💡 Edit total price to auto-calculate price per gram, or vice versa
</p>
```

## User Experience

### Scenario 1: Normal Flow (Forward Calculation)
1. User enters **weight**: 2.5g
2. User enters **price per gram**: 1,050,000
3. **Total price** auto-calculates: 2,625,000
4. Price per gram shows formatted: "Rp 1,050,000"
5. Total price shows formatted: "Rp 2,625,000"

### Scenario 2: Reverse Calculation
1. User enters **weight**: 2.5g
2. User enters **total price**: 2,625,000
3. **Price per gram** auto-calculates: 1,050,000
4. Price per gram shows formatted: "Rp 1,050,000"
5. Total price shows formatted: "Rp 2,625,000"

### Scenario 3: Editing Total Price
1. User has weight: 2.5g, price: 1,050,000, total: 2,625,000
2. User clicks on **total price** field (focus tracked)
3. User changes total to: 3,000,000
4. **Price per gram** recalculates: 1,200,000
5. New formatted displays update automatically

## Benefits

1. **Flexibility**: Users can enter data in whichever way is most convenient
2. **Smart Calculation**: System automatically determines which field to calculate
3. **Visual Feedback**: Currency formatting makes values easier to read
4. **User-Friendly**: Helpful hint explains the bidirectional calculation
5. **Consistent UX**: All fields now have the same input style

## Technical Details

### Focus Tracking
- `@focus="lastEditedField = 'totalPrice'"` on total price input
- `@focus="lastEditedField = 'pricePerGram'"` on price per gram input
- Determines which calculation direction to use

### Rounding
- Price per gram is rounded to nearest integer: `Math.round(totalPrice / weight)`
- Prevents decimal precision issues with currency

### Validation
- Existing validation rules still apply
- Min/max constraints for price per gram
- Required field validation

## Styling

Both fields now show:
- **Input field**: Standard white/slate background with border
- **Formatted value**: Blue text below input showing currency format
- **Hint text**: Gray text explaining functionality (total price only)

## Notes

- The calculation is smart enough to avoid infinite loops
- Only recalculates when the "other" field is focused
- Maintains all existing validation and error handling
- Dark mode fully supported
- Responsive design maintained
