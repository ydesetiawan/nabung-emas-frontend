/**
 * Auth Composable
 * Provides convenient access to auth store with reactive state
 */

import type { ILoginRequest, IRegisterRequest } from '~/types/auth'

export const useAuth = () => {
    const authStore = useAuthStore()

    return {
        // State
        user: computed(() => authStore.user),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        isLoading: computed(() => authStore.isLoading),
        error: computed(() => authStore.error),
        userFullName: computed(() => authStore.userFullName),
        userEmail: computed(() => authStore.userEmail),

        // Actions
        login: (credentials: ILoginRequest) => authStore.login(credentials),
        register: (data: IRegisterRequest) => authStore.register(data),
        logout: () => authStore.logout(),
        getCurrentUser: () => authStore.getCurrentUser(),
        forgotPassword: (email: string) => authStore.forgotPassword(email),
        updateProfile: authStore.updateProfile,
        changePassword: authStore.changePassword,
    }
}
