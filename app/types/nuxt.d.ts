/**
 * Nuxt App Type Augmentation
 * Adds type definitions for custom plugins
 */

declare module '#app' {
    interface NuxtApp {
        $api: typeof $fetch
        $publicApi: typeof $fetch
        $refreshAccessToken: () => Promise<string | null>
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: typeof $fetch
        $publicApi: typeof $fetch
        $refreshAccessToken: () => Promise<string | null>
    }
}

export { }
