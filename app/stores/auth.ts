/**
 * Auth Store - Following Pinia setup store pattern
 * Manages authentication state and operations
 */

import type { IUser, ILoginRequest, IRegisterRequest, IAuthResponse, IProfileUpdateRequest, IChangePasswordRequest } from '~/types/auth'
import type { IAPIResponse } from '~/types/api'
import { API_ENDPOINTS, STORAGE_KEYS } from '~/utils/constants'

export const useAuthStore = defineStore('auth', () => {
    const { $api, $publicApi } = useNuxtApp()

    // State
    const user = useLocalStorage<IUser | null>(STORAGE_KEYS.user, null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const isAuthenticated = computed(() => !!user.value)
    const userFullName = computed(() => user.value?.fullName || '')
    const userEmail = computed(() => user.value?.email || '')

    // Actions

    /**
     * Login user
     */
    async function login(credentials: ILoginRequest): Promise<boolean> {
        isLoading.value = true
        error.value = null

        try {
            const response = await $publicApi<IAPIResponse<IAuthResponse>>(
                API_ENDPOINTS.auth.login,
                {
                    method: 'POST',
                    body: credentials,
                }
            )

            // User data and tokens are automatically handled by the API plugin
            user.value = response.data.user

            return true
        } catch (err: any) {
            error.value = err.message || 'Login failed'
            console.error('Login failed:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Register new user
     */
    async function register(data: IRegisterRequest): Promise<boolean> {
        isLoading.value = true
        error.value = null

        try {
            const response = await $publicApi<IAPIResponse<IAuthResponse>>(
                API_ENDPOINTS.auth.register,
                {
                    method: 'POST',
                    body: data,
                }
            )

            // User data and tokens are automatically handled by the API plugin
            user.value = response.data.user

            return true
        } catch (err: any) {
            error.value = err.message || 'Registration failed'
            console.error('Registration failed:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Logout user
     */
    async function logout(): Promise<void> {
        try {
            await $api(API_ENDPOINTS.auth.logout, {
                method: 'POST',
            })
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            // Clear user data and tokens
            user.value = null

            // Clear all stores
            const pocketStore = usePocketStore()
            const transactionStore = useTransactionStore()
            pocketStore.clear()
            transactionStore.clear()

            // Redirect to login
            await navigateTo('/login')
        }
    }

    /**
     * Get current user from API
     */
    async function getCurrentUser(): Promise<IUser | null> {
        try {
            const response = await $api<IAPIResponse<IUser>>(
                API_ENDPOINTS.auth.me
            )

            user.value = response.data
            return response.data
        } catch (err: any) {
            console.error('Failed to get current user:', err)
            // If unauthorized, clear user data
            if (err.status === 401) {
                user.value = null
            }
            return null
        }
    }

    /**
     * Request password reset
     */
    async function forgotPassword(email: string): Promise<boolean> {
        isLoading.value = true
        error.value = null

        try {
            await $publicApi(API_ENDPOINTS.auth.forgotPassword, {
                method: 'POST',
                body: { email },
            })

            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to send password reset email'
            console.error('Forgot password failed:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Update user profile
     */
    async function updateProfile(data: IProfileUpdateRequest): Promise<boolean> {
        isLoading.value = true
        error.value = null

        try {
            const response = await $api<IAPIResponse<IUser>>(
                API_ENDPOINTS.profile.update,
                {
                    method: 'PATCH',
                    body: data,
                }
            )

            user.value = response.data
            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to update profile'
            console.error('Update profile failed:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Change password
     */
    async function changePassword(data: IChangePasswordRequest): Promise<boolean> {
        isLoading.value = true
        error.value = null

        try {
            await $api(API_ENDPOINTS.profile.changePassword, {
                method: 'POST',
                body: data,
            })

            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to change password'
            console.error('Change password failed:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Initialize auth state (check if user is logged in)
     */
    async function initialize(): Promise<void> {
        if (user.value) {
            // Verify token is still valid by fetching current user
            await getCurrentUser()
        }
    }

    /**
     * Clear auth state
     */
    function clear() {
        user.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        // State (readonly for external access)
        user: readonly(user),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        isAuthenticated,
        userFullName,
        userEmail,

        // Actions
        login,
        register,
        logout,
        getCurrentUser,
        forgotPassword,
        updateProfile,
        changePassword,
        initialize,
        clear,
    }
})
