# Custom Instructions for Nuxt 4 TypeScript Code Review

## General Code Review Guidelines

- **Provide direct, actionable instructions with clear reasoning and justification**
- **Include relevant references, documentation links, or examples when available**

## Project Overview

This is a **Nuxt 4** Point of Sale (POS) retail frontend application built with TypeScript, Vue 3, and Pinia for state management. The application is designed for retail environments with features like order management, payment processing, member management, and promotional systems.

## Nuxt 4 Specific Guidelines

### Directory Structure and Auto-imports

- **File Organization Detection**: When reviewing manually created files in wrong locations, suggest proper Nuxt 4 `app/` directory structure:
  - Components must be in `app/components/` for auto-imports
  - Composables must be in `app/composables/` for global availability
  - Types must be in `app/types/` for TypeScript resolution
  - Utils must be in `app/utils/` for auto-imports
- **Auto-import Violations**: When reviewing explicit imports for Nuxt auto-imported functions, suggest removing unnecessary imports:

  ```typescript
  // ❌ Unnecessary import
  import { ref, computed } from "vue";
  import { defineStore } from "pinia";

  // ✅ Auto-imported in Nuxt 4
  const state = ref(value);
  const store = defineStore("name", () => {});
  ```

- **Component Auto-imports**: Ensure components in `app/components/` use PascalCase naming for proper auto-import recognition

### Server-Side Rendering (SSR) Configuration

- **SSR Disabled Notice**: This project uses `ssr: false` (SPA mode) for POS terminal compatibility
- When reviewing server-side code patterns, remind that client-side rendering is used
- Suggest `process.client` checks when necessary for browser-only APIs

### Performance and Bundle Optimization

- **Bundle Size Detection**: When reviewing imports or additions that increase bundle size:
  - Flag full library imports and suggest tree-shaking: `import { specific } from 'library'`
  - For Google Fonts usage, suggest optimizing from current "all weights" to specific weights needed
  - Recommend dynamic imports for large components: `const Component = defineAsyncComponent(() => import('./LargeComponent.vue'))`
- **Image Optimization**: When reviewing static image usage, suggest using Nuxt Image module for optimization
- **Lazy Loading**: For components below the fold, suggest using `<ClientOnly>` wrapper for client-side rendering

### Component Architecture Patterns

- **Component Organization**: When reviewing components in wrong locations, suggest proper structure:
  - `app/components/Base/` for reusable UI components (BaseModal, BaseButton, BaseDataTable)
  - `app/components/Page/[Feature]/` for feature-specific business logic components
  - Avoid generic `components/common/` - use descriptive domain names instead

#### Fat Component Prevention

- **Business Logic in Components**: When reviewing Vue components with complex business logic, suggest moving to:
  - **Composables** for reusable logic: `useOrderCalculation()`, `usePaymentValidation()`
  - **Stores** for state management: `useOrderStore()`, `useMemberStore()`
  - **Utils** for pure functions: calculation helpers, data transformers
- **Template Complexity**: When reviewing templates with complex expressions, suggest:
  - Moving logic to computed properties
  - Using methods for event handling
  - Breaking down large templates into smaller components

#### Component Prop Interface Patterns

- **Type Safety**: When reviewing component props without TypeScript interfaces, suggest:

  ```typescript
  // ❌ Weak typing
  defineProps<{
    data: any;
    callback: Function;
  }>();

  // ✅ Strong typing with business interfaces
  defineProps<{
    order: IOrder;
    onPaymentComplete: (payment: IOrderPayment) => void;
  }>();
  ```

- **Optional vs Required Props**: Ensure proper prop definitions with business context

### TypeScript and Type Safety

#### Magic Values Prevention

- **Hard-coded Values Detection**: When reviewing code with magic numbers, strings, or business values, suggest extracting to:
  - **Constants**: `app/utils/constant.ts` for business rules (ORDER_TYPE, DISCOUNT_TYPE, METHOD_OF_PAYMENT_CODE)
  - **Enums**: TypeScript enums for status-like values
  - **Configuration**: Runtime config for environment-specific values

  ```typescript
  // ❌ Magic values
  if (orderType === 0) {
  }
  if (payment.code === "ZP01") {
  }

  // ✅ Named constants
  if (orderType === ORDER_TYPE.cash_and_carry) {
  }
  if (payment.code === METHOD_OF_PAYMENT_CODE.cash) {
  }
  ```

- **Business Rules**: Extract business logic constants with descriptive names and documentation

#### Interface and Type Patterns

- **Naming Conventions**: When reviewing type definitions, ensure:
  - Interface names start with `I`: `IOrder`, `IMember`, `IPayment`
  - One file per domain: `app/types/order.ts`, `app/types/member.ts`
  - API response interfaces follow pattern: `IEntityResponse`, `IEntityAttributes`
- **Type Safety**: When reviewing `any` types or weak typing, suggest specific business interfaces:

  ```typescript
  // ❌ Weak typing
  const data: any = response.data;

  // ✅ Business-specific typing
  const order: IOrderResponse = response.data;
  ```

#### Nullable Type Handling

- **Three-State Pattern**: For business logic like member management, ensure proper nullable type handling:
  ```typescript
  // Member state: null (initial) | true (member chosen) | false (non-member)
  const isMember = ref<boolean | null>(null);
  ```
- **Computed Safety**: When reviewing computed properties, ensure null checks for business entities

### Pinia Store Architecture and State Management

#### Store Structure and Organization

- **Fat Store Prevention**: When reviewing stores exceeding 200 lines or handling multiple concerns, suggest:
  - **Domain Separation**: Split by business domain (`useOrderStore`, `useMemberStore`, `usePaymentStore`)
  - **Feature Isolation**: Use namespaced stores for special flows (`useSpecialTransactionMemberStore`, `useSolutioneStore`)
  - **Composable Extraction**: Move complex calculations to composables (`useCalculator`, `useBusinessRules`)

#### Store Setup Function Pattern

- **Standard Structure**: When reviewing Pinia stores, ensure this pattern:

  ```typescript
  export const useFeatureStore = defineStore("featureName", () => {
    // 1. Reactive state with proper typing
    const items = useLocalStorage<IItem[]>("feature.items", []);

    // 2. Computed properties for derived state
    const totalAmount = computed(() => {
      return items.value.reduce((sum, item) => sum + item.amount, 0);
    });

    // 3. Actions with business validation
    function addItem(item: IItem) {
      // Validation logic
      items.value.push(item);
    }

    // 4. Always include clear function
    function clear() {
      items.value = [];
    }

    return {
      // Explicit exports only
      items,
      totalAmount,
      addItem,
      clear,
    };
  });
  ```

#### State Persistence Best Practices

- **LocalStorage Namespacing**: When reviewing persistent state, ensure proper key naming:

  ```typescript
  // ❌ Generic keys
  useLocalStorage("data", []);

  // ✅ Namespaced business keys
  useLocalStorage("order.details", []);
  useLocalStorage("member.data", null);
  useLocalStorage("special-transaction.member.is_member", null);
  ```

- **Serialization**: For complex objects, ensure proper serializer usage:
  ```typescript
  useLocalStorage<IOrder | null>("order.latest", null, {
    serializer: StorageSerializers.object,
  });
  ```

#### Store Isolation Patterns

- **Cross-Store Dependencies**: When reviewing stores that depend on other stores, suggest:
  - Minimal coupling between stores
  - Clear separation between transaction types (regular, special-transaction, solutione)
  - Proper cleanup when switching contexts

### Form Handling and Validation

#### VeeValidate Integration

- **Schema Validation**: When reviewing forms without validation, suggest VeeValidate with Yup schemas:

  ```typescript
  // ❌ No validation
  const formData = ref({ amount: 0 });

  // ✅ Business validation with VeeValidate
  const { handleSubmit, isSubmitting } = useForm<IPaymentForm>({
    validationSchema: object({
      amount: number()
        .required()
        .min(0)
        .max(props.balanceToBePaid)
        .label("Payment Amount"),
    }),
  });
  ```

- **Business Rules in Validation**: Ensure validation schemas reflect actual business constraints (min/max amounts, required fields based on business logic)

#### Form State Management

- **Loading States**: When reviewing form submissions, ensure proper loading state handling with `isSubmitting`
- **Error Handling**: Suggest proper error handling with toast notifications for user feedback
- **Form Reset**: Ensure forms can be reset properly after successful submission

### API Integration and Error Handling

#### Service Layer and API Calls

- **API Plugin Usage**: When reviewing direct fetch calls, suggest using the configured `$api` plugin for consistency
- **Error Handling Pattern**: When reviewing API calls without proper error handling, suggest:

  ```typescript
  // ❌ No error handling
  const response = await $api.post("/endpoint", payload);

  // ✅ Proper error handling with user feedback
  try {
    const response = await $api.post("/endpoint", payload);
    toast.success({ message: "Operation completed successfully" });
    return response.data;
  } catch (error) {
    toast.error({
      message: "Operation failed",
      info: {
        title: "Error Details",
        description: error.message,
      },
    });
    throw error;
  }
  ```

- **Loading States**: Ensure API calls have corresponding loading states for better UX

#### Toast Notification Standards

- **User Feedback**: When reviewing operations without user feedback, suggest appropriate toast notifications:
  - Success messages for completed operations
  - Error messages with actionable information
  - Warning messages for business rule violations
- **Toast Context**: Include relevant business context in error messages (order numbers, member information, etc.)

### Security Best Practices

#### Content Security Policy (CSP) Compliance

- **CSP Violations**: When reviewing code that might violate CSP, ensure:
  - No inline styles or scripts (use Tailwind classes or external files)
  - Proper nonce usage for dynamic scripts if needed
  - All external resources are whitelisted in `nuxt.config.ts`
- **XSS Prevention**: When reviewing user input handling, ensure:
  - All user inputs are properly sanitized
  - Use Vue's automatic escaping for template interpolation
  - Validate data with Yup schemas before processing

#### Sensitive Data Protection

- **Runtime Config**: When reviewing hardcoded API endpoints, keys, or configuration, suggest using `runtimeConfig`:

  ```typescript
  // ❌ Hardcoded values
  const apiUrl = "http://localhost:3001";

  // ✅ Runtime configuration
  const { $config } = useNuxtApp();
  const apiUrl = $config.public.retailBaseAPI;
  ```

- **Environment Variables**: For sensitive configuration, suggest environment variables with proper validation

#### Input Validation and Business Rules

- **Form Security**: When reviewing form inputs, ensure:
  - Proper validation on both client and server side
  - Business rule enforcement (amount limits, quantity constraints)
  - Type safety with TypeScript interfaces

### Testing Standards and Quality Assurance

#### Test Coverage and Structure

- **Missing Tests**: When reviewing new features or components without tests, suggest:
  - Unit tests for business logic and composables
  - Component tests for user interactions
  - E2E tests for critical business flows (payment processing, order management)
- **Test Organization**: Ensure proper test structure:
  ```
  app/tests/
  ├── unit/           # Unit tests for composables, utilities
  ├── components/     # Component testing
  └── e2e/           # End-to-end Playwright tests
      ├── components/ # Reusable test components (Page Object Model)
      ├── model/      # Page object models
      └── specs/      # Test specifications
  ```

#### Vitest Configuration and Best Practices

- **Test Environment**: When reviewing tests, ensure they use Nuxt test utils:

  ```typescript
  // ✅ Nuxt-aware testing
  import { mountSuspended } from "@nuxt/test-utils/runtime";

  test("component renders correctly", async () => {
    const component = await mountSuspended(MyComponent);
    // Test logic
  });
  ```

- **Store Testing**: For Pinia store tests, suggest using `@pinia/testing` for proper isolation

#### E2E Testing with Playwright

- **Page Object Model**: When reviewing E2E tests without page objects, suggest creating reusable component classes:

  ```typescript
  // ✅ Reusable test components
  export class PaymentComponent extends BaseComponent {
    readonly amountInput: Locator;
    readonly submitButton: Locator;

    async fillPaymentAmount(amount: number) {
      await this.amountInput.fill(amount.toString());
    }
  }
  ```

- **Business Flow Tests**: Ensure E2E tests cover complete business workflows, not just UI interactions

### Styling and UI Consistency

#### Tailwind CSS Best Practices

- **Custom Classes**: When reviewing hardcoded styles, suggest using configured Tailwind classes:

  ```vue
  <!-- ❌ Hardcoded styles -->
  <div style="width: 1422px;"></div>
  ```

- **POS Device Optimization**: When reviewing responsive design, ensure proper screen size targeting:
  - `md` for 1024x768 (common POS resolution)
  - `hd` for 1422x720
  - `fhd` for 1920x1080
- **Component Consistency**: When reviewing UI components, ensure they follow the established design system patterns

#### Performance Considerations for POS Hardware

- **Animation Performance**: When reviewing animations or transitions, consider POS hardware limitations
- **Image Optimization**: For product images or UI assets, suggest proper optimization for retail environments
- **Font Loading**: Currently loading all Poppins weights - suggest optimizing to specific weights needed

## Business Domain Specific Guidelines

### Order Management System

- **State Integrity**: When reviewing order-related code, ensure:
  - Order details maintain consistency across stores
  - Transaction numbers are properly managed and unique
  - Order state transitions follow business rules (draft → payment → settlement)
- **Business Logic**: For order calculations, suggest using the `useCalculator` composable:
  ```typescript
  // ✅ Centralized business calculations
  const { calculatorOption } = useCalculator();
  const total = calculateOrderTotal(orderDetails, calculatorOption);
  ```
- **Order Types**: When reviewing order processing, ensure proper handling of:
  - Cash and carry vs. cash and delivery
  - Special transactions (isolated from regular orders)
  - Return orders and booking/indent orders

### Payment Processing Architecture

- **Multiple Payment Methods**: When reviewing payment components, ensure support for:
  - Cash payments (`METHOD_OF_PAYMENT_CODE.cash`)
  - Virtual accounts (bank transfers)
  - Vouchers (Axis, Sodexo)
  - Pay with Koin (loyalty system)
  - DanaKini (local payment method)
- **Payment Validation**: Ensure proper validation for:
  - Amount limits and business constraints
  - Payment method availability based on business rules
  - Balance calculations and change handling
- **Payment State Management**: Keep payment data isolated from order data for proper separation of concerns

### Member Management Three-State Pattern

- **State Detection**: When reviewing member-related code, ensure proper handling of the three-state pattern:
  ```typescript
  // null: initial state, user hasn't chosen
  // true: member chosen, but member data might be null (not found)
  // false: explicitly chosen non-member
  const isMember = ref<boolean | null>(null);
  ```
- **Business Rules**: Member status affects pricing, promotions, and available payment methods
- **Data Persistence**: Member data should persist across sessions but be clearable for new transactions

### Special Transaction Isolation

- **Namespace Separation**: When reviewing special transaction code, ensure:
  - Completely separate stores (`useSpecialTransactionMemberStore`, `useSpecialTransactionOrderPaymentStore`)
  - No cross-contamination with regular transaction stores
  - Proper cleanup when switching between transaction types
- **Business Context**: Special transactions have different business rules and workflows than regular retail operations

### Composables and Reusability Patterns

#### Business Logic Composables

- **Fat Component Detection**: When reviewing components with complex business calculations, suggest extracting to composables:
  - `useCalculator()` for pricing and order calculations
  - `useOrderValidation()` for business rule validation
  - `usePaymentProcessor()` for payment logic
- **Composable Structure**: When reviewing or creating composables, ensure:

  ```typescript
  export const useBusinessFeature = () => {
    // Private reactive state
    const internalState = ref(value);

    // Public computed properties with business logic
    const businessRules = computed(() => {
      return calculateBusinessRules(internalState.value);
    });

    // Public methods with proper error handling
    function processBusinessLogic(input: IBusinessInput) {
      try {
        // Business logic
        return result;
      } catch (error) {
        toast.error({ message: "Business operation failed" });
        throw error;
      }
    }

    return {
      businessRules,
      processBusinessLogic,
    };
  };
  ```

#### Utility Functions vs Composables

- **Pure Functions**: When reviewing data transformation or calculation logic, suggest:
  - **Utils** (`app/utils/helper.ts`) for pure functions without reactive state
  - **Composables** for functions that need reactive state or store access
- **Business Constants**: Extract business rules and constants to `app/utils/constant.ts` with proper documentation

#### Cross-Store Communication Patterns

- **Store Dependencies**: When reviewing stores that need data from other stores, suggest:
  - Minimal coupling with explicit dependencies
  - Using composables as intermediaries for complex cross-store logic
  - Clear separation between different business domains

### Nuxt Module Integration and Configuration

#### Module Analysis and Recommendations

- **Module Usage Review**: When reviewing new module additions or configurations, analyze:
  - Performance impact on POS hardware
  - Security implications for retail environment
  - Compatibility with existing modules (`@pinia/nuxt`, `@vee-validate/nuxt`, `nuxt-security`)
- **Alternative Suggestions**: When reviewing module choices, consider established patterns:
  - UI components: Use `nuxt-headlessui` (already configured) instead of heavy UI libraries
  - Icons: Use `@nuxt/icon` with custom collections (already configured for KLG icons)
  - State persistence: Use VueUse's `useLocalStorage` instead of external persistence libraries

#### Runtime Configuration Best Practices

- **Configuration Management**: When reviewing hardcoded values, suggest using `runtimeConfig`:

  ```typescript
  // ❌ Hardcoded configuration
  const timeout = 60000;

  // ✅ Runtime configuration
  const { $config } = useNuxtApp();
  const timeout = $config.public.coinAuthorizationWaitTime;
  ```

- **Environment-Specific Values**: Ensure proper separation of development and production configurations

#### Security Module Configuration

- **CSP Headers**: When reviewing security-related changes, ensure they comply with configured CSP in `nuxt.config.ts`
- **XSS Protection**: Maintain the configured security headers without bypassing them for convenience

## Critical Business Rules and POS-Specific Guidelines

### Data Integrity and State Management

1. **State Cleanup**: When reviewing navigation or transaction completion logic, ensure:
   - All stores have `clear()` functions that are called appropriately
   - No orphaned state between different transaction types
   - Proper cleanup when switching between regular and special transactions

2. **Transaction Isolation**: When reviewing transaction-related code, ensure:
   - Regular orders don't contaminate special transaction state
   - Solutione flows are completely isolated
   - Payment data is properly cleared between transactions

3. **Business Validation**: When reviewing business logic, ensure:
   - Order types are properly validated (cash_and_carry, cash_and_delivery, etc.)
   - Payment amounts respect business constraints
   - Member pricing rules are correctly applied

### POS Hardware and Performance Optimization

4. **Hardware Constraints**: When reviewing performance-sensitive code, consider:
   - POS terminals have limited processing power
   - Network connectivity may be unstable
   - Screen real estate is limited and specific

5. **User Experience**: When reviewing UI/UX changes, ensure:
   - Loading states for all async operations
   - Clear error messages with actionable information
   - Accessibility for retail environment usage

### Security and Compliance

6. **Data Security**: When reviewing data handling, ensure:
   - Sensitive customer data is properly protected
   - Payment information follows security standards
   - No hardcoded secrets or API keys

7. **Business Compliance**: When reviewing business logic, verify:
   - Tax calculations are accurate
   - Discount rules follow business policies
   - Audit trails are maintained for financial operations

## Development Workflow Requirements

### Code Quality Gates

- **TypeScript**: All code must be properly typed with business interfaces
- **Testing**: Critical business flows must have E2E test coverage
- **Documentation**: Business logic should be well-documented with clear reasoning

### Git and Deployment

- **Version Management**: Follow semantic versioning for releases
- **Environment Configuration**: Maintain separation between development and production settings
- **Docker Deployment**: Ensure changes are compatible with containerized deployment

## References

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [VeeValidate Documentation](https://vee-validate.logaretm.com/v4/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

**Remember:** This is a production POS system. Prioritize reliability, security, and user experience in all code changes. Always consider the business impact of technical decisions.
