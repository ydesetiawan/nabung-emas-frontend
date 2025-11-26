/**
 * Analytics Store - Following Pinia setup store pattern
 * Manages analytics data and operations
 */

import type {
    IDashboardData,
    IPortfolioData,
    IMonthlyPurchases,
    IBrandDistribution,
    ITrends,
    IAnalyticsParams
} from '~/types/analytics'
import type { IAPIResponse } from '~/types/api'
import { API_ENDPOINTS, STORAGE_KEYS } from '~/utils/constants'

export const useAnalyticsStore = defineStore('analytics', () => {
    const { $api } = useNuxtApp()

    // State with localStorage caching
    const dashboard = useLocalStorage<IDashboardData | null>(STORAGE_KEYS.analyticsCache + '.dashboard', null)
    const portfolio = useLocalStorage<IPortfolioData | null>(STORAGE_KEYS.analyticsCache + '.portfolio', null)
    const monthlyPurchases = ref<IMonthlyPurchases | null>(null)
    const brandDistribution = ref<IBrandDistribution | null>(null)
    const trends = ref<ITrends | null>(null)

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Cache timestamps
    const lastFetchedDashboard = useLocalStorage<number | null>(STORAGE_KEYS.analyticsCache + '.dashboard.timestamp', null)
    const lastFetchedPortfolio = useLocalStorage<number | null>(STORAGE_KEYS.analyticsCache + '.portfolio.timestamp', null)

    // Cache duration: 5 minutes
    const CACHE_DURATION = 5 * 60 * 1000

    // Computed
    const isDashboardCacheValid = computed(() => {
        if (!lastFetchedDashboard.value) return false
        return Date.now() - lastFetchedDashboard.value < CACHE_DURATION
    })

    const isPortfolioCacheValid = computed(() => {
        if (!lastFetchedPortfolio.value) return false
        return Date.now() - lastFetchedPortfolio.value < CACHE_DURATION
    })

    // Actions

    /**
     * Fetch dashboard statistics
     */
    async function fetchDashboard(currentGoldPrice?: number, forceRefresh = false): Promise<void> {
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && isDashboardCacheValid.value && dashboard.value) {
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const url = currentGoldPrice
                ? `${API_ENDPOINTS.analytics.dashboard}?current_gold_price=${currentGoldPrice}`
                : API_ENDPOINTS.analytics.dashboard

            const response = await $api<IAPIResponse<IDashboardData>>(url)

            dashboard.value = response.data
            lastFetchedDashboard.value = Date.now()
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch dashboard data'
            console.error('Failed to fetch dashboard:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch portfolio analytics
     */
    async function fetchPortfolio(currentGoldPrice?: number, forceRefresh = false): Promise<void> {
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && isPortfolioCacheValid.value && portfolio.value) {
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const url = currentGoldPrice
                ? `${API_ENDPOINTS.analytics.portfolio}?current_gold_price=${currentGoldPrice}`
                : API_ENDPOINTS.analytics.portfolio

            const response = await $api<IAPIResponse<IPortfolioData>>(url)

            portfolio.value = response.data
            lastFetchedPortfolio.value = Date.now()
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch portfolio data'
            console.error('Failed to fetch portfolio:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch monthly purchases trend
     */
    async function fetchMonthlyPurchases(params: IAnalyticsParams = {}): Promise<void> {
        isLoading.value = true
        error.value = null

        try {
            const queryParams = new URLSearchParams()
            if (params.months) queryParams.append('months', params.months.toString())
            if (params.pocketId) queryParams.append('pocket_id', params.pocketId)

            const url = queryParams.toString()
                ? `${API_ENDPOINTS.analytics.monthlyPurchases}?${queryParams.toString()}`
                : API_ENDPOINTS.analytics.monthlyPurchases

            const response = await $api<IAPIResponse<IMonthlyPurchases>>(url)

            monthlyPurchases.value = response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch monthly purchases'
            console.error('Failed to fetch monthly purchases:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch brand distribution
     */
    async function fetchBrandDistribution(): Promise<void> {
        isLoading.value = true
        error.value = null

        try {
            const response = await $api<IAPIResponse<IBrandDistribution>>(
                API_ENDPOINTS.analytics.brandDistribution
            )

            brandDistribution.value = response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch brand distribution'
            console.error('Failed to fetch brand distribution:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Fetch trends analytics
     */
    async function fetchTrends(params: IAnalyticsParams = {}): Promise<void> {
        isLoading.value = true
        error.value = null

        try {
            const queryParams = new URLSearchParams()
            if (params.period) queryParams.append('period', params.period)
            if (params.groupBy) queryParams.append('group_by', params.groupBy)

            const url = queryParams.toString()
                ? `${API_ENDPOINTS.analytics.trends}?${queryParams.toString()}`
                : API_ENDPOINTS.analytics.trends

            const response = await $api<IAPIResponse<ITrends>>(url)

            trends.value = response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch trends'
            console.error('Failed to fetch trends:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Refresh all analytics data
     */
    async function refreshAll(currentGoldPrice?: number): Promise<void> {
        await Promise.all([
            fetchDashboard(currentGoldPrice, true),
            fetchPortfolio(currentGoldPrice, true),
            fetchMonthlyPurchases(),
            fetchBrandDistribution(),
            fetchTrends(),
        ])
    }

    /**
     * Clear cache
     */
    function clearCache() {
        lastFetchedDashboard.value = null
        lastFetchedPortfolio.value = null
    }

    /**
     * Clear all state
     */
    function clear() {
        dashboard.value = null
        portfolio.value = null
        monthlyPurchases.value = null
        brandDistribution.value = null
        trends.value = null
        lastFetchedDashboard.value = null
        lastFetchedPortfolio.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        // State (readonly for external access)
        dashboard: readonly(dashboard),
        portfolio: readonly(portfolio),
        monthlyPurchases: readonly(monthlyPurchases),
        brandDistribution: readonly(brandDistribution),
        trends: readonly(trends),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Computed
        isDashboardCacheValid,
        isPortfolioCacheValid,

        // Actions
        fetchDashboard,
        fetchPortfolio,
        fetchMonthlyPurchases,
        fetchBrandDistribution,
        fetchTrends,
        refreshAll,
        clearCache,
        clear,
    }
})
