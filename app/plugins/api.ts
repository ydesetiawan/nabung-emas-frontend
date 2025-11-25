/**
 * API Plugin - Following .github/prompts/api.prompt.md guidelines
 * Provides $api and $publicApi for authenticated and public requests
 */

export default defineNuxtPlugin((_nuxtApp) => {
    const config = useRuntimeConfig()

    // Authenticated API wrapper
    const api = $fetch.create({
        baseURL: config.public.apiBaseURL,
        async onRequest({ options }) {
            // Add authentication token if available
            const token = useCookie('auth_token')
            if (token.value) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token.value}`,
                }
            }
        },
        async onResponseError({ response }) {
            // Global error handling
            if (response.status === 401) {
                // Handle unauthorized - redirect to login
                await navigateTo('/login')
            }
        },
    })

    // Public API wrapper (no authentication)
    const publicApi = $fetch.create({
        baseURL: config.public.apiBaseURL,
    })

    return {
        provide: {
            api,
            publicApi,
        },
    }
})
