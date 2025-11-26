/**
 * Analytics API Composable
 * Handles all analytics-related API calls
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
import { API_ENDPOINTS } from '~/utils/constants'

export const useAnalyticsApi = () => {
    const { $api } = useNuxtApp()

    /**
     * Fetch dashboard statistics
     */
    const fetchDashboard = async (currentGoldPrice?: number): Promise<IDashboardData> => {
        const url = currentGoldPrice
            ? `${API_ENDPOINTS.analytics.dashboard}?current_gold_price=${currentGoldPrice}`
            : API_ENDPOINTS.analytics.dashboard

        const response = await $api<IAPIResponse<IDashboardData>>(url)
        return response.data
    }

    /**
     * Fetch portfolio analytics
     */
    const fetchPortfolio = async (currentGoldPrice?: number): Promise<IPortfolioData> => {
        const url = currentGoldPrice
            ? `${API_ENDPOINTS.analytics.portfolio}?current_gold_price=${currentGoldPrice}`
            : API_ENDPOINTS.analytics.portfolio

        const response = await $api<IAPIResponse<IPortfolioData>>(url)
        return response.data
    }

    /**
     * Fetch monthly purchases trend
     */
    const fetchMonthlyPurchases = async (params: IAnalyticsParams = {}): Promise<IMonthlyPurchases> => {
        const queryParams = new URLSearchParams()
        if (params.months) queryParams.append('months', params.months.toString())
        if (params.pocketId) queryParams.append('pocket_id', params.pocketId)

        const url = queryParams.toString()
            ? `${API_ENDPOINTS.analytics.monthlyPurchases}?${queryParams.toString()}`
            : API_ENDPOINTS.analytics.monthlyPurchases

        const response = await $api<IAPIResponse<IMonthlyPurchases>>(url)
        return response.data
    }

    /**
     * Fetch brand distribution
     */
    const fetchBrandDistribution = async (): Promise<IBrandDistribution> => {
        const response = await $api<IAPIResponse<IBrandDistribution>>(
            API_ENDPOINTS.analytics.brandDistribution
        )
        return response.data
    }

    /**
     * Fetch trends analytics
     */
    const fetchTrends = async (params: IAnalyticsParams = {}): Promise<ITrends> => {
        const queryParams = new URLSearchParams()
        if (params.period) queryParams.append('period', params.period)
        if (params.groupBy) queryParams.append('group_by', params.groupBy)

        const url = queryParams.toString()
            ? `${API_ENDPOINTS.analytics.trends}?${queryParams.toString()}`
            : API_ENDPOINTS.analytics.trends

        const response = await $api<IAPIResponse<ITrends>>(url)
        return response.data
    }

    return {
        fetchDashboard,
        fetchPortfolio,
        fetchMonthlyPurchases,
        fetchBrandDistribution,
        fetchTrends,
    }
}
