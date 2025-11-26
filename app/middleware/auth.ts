/**
 * Auth Middleware
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        // Redirect to login page
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath, // Save the intended destination
            },
        })
    }
})
