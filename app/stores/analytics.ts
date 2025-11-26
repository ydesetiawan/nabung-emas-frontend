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

export const useAnalyticsStore = defineStore('analytics', () => {
    const analyticsApi = useAnalyticsApi()

    // State - no localStorage persistence
    const dashboard = ref<IDashboardData | null>(null)
    const portfolio = ref<IPortfolioData | null>(null)
    const monthlyPurchases = ref<IMonthlyPurchases | null>(null)
    const brandDistribution = ref<IBrandDistribution | null>(null)
    const trends = ref<ITrends | null>(null)

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Actions

    /**
     * Fetch dashboard statistics
     */
    async function fetchDashboard(currentGoldPrice?: number, forceRefresh = false): Promise<void> {
        isLoading.value = true
        error.value = null

        try {
            dashboard.value = await analyticsApi.fetchDashboard(currentGoldPrice)
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
        isLoading.value = true
        error.value = null

        try {
            portfolio.value = await analyticsApi.fetchPortfolio(currentGoldPrice)
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
            monthlyPurchases.value = await analyticsApi.fetchMonthlyPurchases(params)
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
            brandDistribution.value = await analyticsApi.fetchBrandDistribution()
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
            trends.value = await analyticsApi.fetchTrends(params)
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
     * Clear all state
     */
    function clear() {
        dashboard.value = null
        portfolio.value = null
        monthlyPurchases.value = null
        brandDistribution.value = null
        trends.value = null
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

        // Actions
        fetchDashboard,
        fetchPortfolio,
        fetchMonthlyPurchases,
        fetchBrandDistribution,
        fetchTrends,
        refreshAll,
        clear,
    }
})
