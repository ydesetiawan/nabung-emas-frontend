/**
 * API Plugin - Following .github/prompts/api.prompt.md guidelines
 * Provides $api and $publicApi for authenticated and public requests
 */

import { transformRequest, transformResponse, transformError } from '~/utils/apiTransformers'
import type { IAuthResponse, IRefreshTokenRequest } from '~/types/auth'
import type { IAPIResponse } from '~/types/api'
import { API_ENDPOINTS } from '~/utils/constants'

export default defineNuxtPlugin((_nuxtApp) => {
    const config = useRuntimeConfig()

    // Token management
    const accessToken = useCookie('access_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })

    const refreshToken = useCookie('refresh_token', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })

    // Flag to prevent multiple refresh attempts
    let isRefreshing = false
    let refreshPromise: Promise<string | null> | null = null

    /**
     * Refresh the access token
     */
    async function refreshAccessToken(): Promise<string | null> {
        if (!refreshToken.value) {
            return null
        }

        // If already refreshing, return the existing promise
        if (isRefreshing && refreshPromise) {
            return refreshPromise
        }

        isRefreshing = true
        refreshPromise = (async () => {
            try {
                const response = await $fetch<IAPIResponse<IAuthResponse>>(
                    API_ENDPOINTS.auth.refresh,
                    {
                        baseURL: config.public.apiBaseURL,
                        method: 'POST',
                        body: transformRequest<IRefreshTokenRequest>({
                            refreshToken: refreshToken.value,
                        }),
                    }
                )

                const data = transformResponse<IAuthResponse>(response.data)

                // Update tokens
                accessToken.value = data.accessToken
                refreshToken.value = data.refreshToken

                return data.accessToken
            } catch (error) {
                // Refresh failed, clear tokens and redirect to login
                accessToken.value = null
                refreshToken.value = null
                await navigateTo('/login')
                return null
            } finally {
                isRefreshing = false
                refreshPromise = null
            }
        })()

        return refreshPromise
    }

    // Authenticated API wrapper
    const api = $fetch.create({
        baseURL: config.public.apiBaseURL,
        async onRequest({ options }) {
            // Transform request body to snake_case
            if (options.body) {
                options.body = transformRequest(options.body)
            }

            // Add authentication token if available
            if (accessToken.value) {
                const headers = new Headers(options.headers as HeadersInit)
                headers.set('Authorization', `Bearer ${accessToken.value}`)
                options.headers = headers
            }
        },
        async onResponse({ response }) {
            // Transform response data to camelCase
            if (response._data?.data) {
                response._data.data = transformResponse(response._data.data)
            }
        },
        async onResponseError({ response }) {
            // Handle 401 Unauthorized
            if (response.status === 401) {
                // Clear tokens and redirect to login
                accessToken.value = null
                refreshToken.value = null
                await navigateTo('/login')
            }

            // Transform error response
            const error = transformError(response._data)
            throw error
        },
    })

    // Public API wrapper (no authentication)
    const publicApi = $fetch.create({
        baseURL: config.public.apiBaseURL,
        async onRequest({ options }) {
            // Transform request body to snake_case
            if (options.body) {
                options.body = transformRequest(options.body)
            }
        },
        async onResponse({ response }) {
            // Transform response data to camelCase
            if (response._data?.data) {
                response._data.data = transformResponse(response._data.data)
            }
        },
        async onResponseError({ response }) {
            // Transform error response
            const error = transformError(response._data)
            throw error
        },
    })

    return {
        provide: {
            api,
            publicApi,
            refreshAccessToken, // Expose for manual token refresh
        },
    }
})
