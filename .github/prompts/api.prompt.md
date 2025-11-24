## API Wrapper (Nuxt 3)

- The project uses `$fetch` to create API wrappers for different base URLs.
- The main API wrapper is `$api`, which includes default headers and supports request customization.
- Other wrappers include `$publicApi` for specific use cases.
- API wrappers are defined in the Nuxt plugin and injected into the app context for global usage.

### API Wrapper Example

```ts
export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.retailBaseAPI,
    async onRequest({ options }) {
      const defaultHeader = await useApiHeader();
      options.headers = {
        ...defaultHeader,
        ...options.headers,
      };
    },
  });

  const publicApi = $fetch.create({
    baseURL: config.public.retailBaseAPI,
  });

  return {
    provide: {
      api,
      publicApi,
    },
  };
});
```

### Usage Guidelines

- **Default API (`$api`)**:
  - Use `$api` for all the authenticated requests.
  - Automatically includes default headers via `useApiHeader`.

- **Public API (`$publicApi`)**:
  - Use `$publicApi` for unauthenticated requests or public endpoints.

- **$api Composable Wrapper (`useRetailAPI`)**
  - Use `useRetailAPI` is a composable meant to be called directly in a setup function, plugin, or route middleware

- Recommend to use `$api` / or all with prefix `$` for client-side interactions (event based) or combined with useAsyncData when fetching the initial component data.

### Example Usage

```ts
const { $api } = useNuxtApp();

async function fetchOrders() {
  const orders = await $api("/orders");
  return orders;
}

async function createOrder(orderData) {
  const response = await $api("/orders", {
    method: "POST",
    body: orderData,
  });
  return response;
}
```

### Example Usage with `useRetailAPI`

```ts
const { data: orders, pending, error } = useRetailAPI("/orders");
```

> Your job as an AI agent is to ensure **consistent usage of API wrappers**, promote separation of concerns, and enforce clean, reusable API logic across the project.
