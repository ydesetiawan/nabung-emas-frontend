/**
 * Analytics types
 * Based on EmasGo API specification
 */

/**
 * Dashboard statistics
 */
export interface IDashboardData {
    totalPockets: number
    totalWeight: number
    totalInvested: number
    currentValue: number
    profitLoss: number
    profitLossPercentage: number
    recentTransactions: Array<{
        id: string
        pocketName: string
        weight: number
        totalPrice: number
        transactionDate: Date
    }>
}

/**
 * Portfolio analytics
 */
export interface IPortfolioData {
    pockets: Array<{
        id: string
        name: string
        typePocketName: string
        weight: number
        value: number
        percentage: number
    }>
    totalWeight: number
    totalValue: number
}

/**
 * Monthly purchases data point
 */
export interface IMonthlyPurchaseData {
    month: string
    year: number
    weight: number
    totalPrice: number
    transactionCount: number
}

/**
 * Monthly purchases response
 */
export interface IMonthlyPurchases {
    data: IMonthlyPurchaseData[]
    summary: {
        totalWeight: number
        totalPrice: number
        averageMonthlyWeight: number
        averageMonthlyPrice: number
    }
}

/**
 * Brand distribution data
 */
export interface IBrandDistribution {
    brands: Array<{
        brand: string
        weight: number
        totalPrice: number
        transactionCount: number
        percentage: number
    }>
    totalWeight: number
    totalPrice: number
}

/**
 * Trend data point
 */
export interface ITrendData {
    period: string
    weight: number
    value: number
    averagePrice: number
}

/**
 * Trends response
 */
export interface ITrends {
    data: ITrendData[]
    period: '1m' | '3m' | '6m' | '1y' | 'all'
    groupBy: 'day' | 'week' | 'month' | 'year'
}

/**
 * Analytics query parameters
 */
export interface IAnalyticsParams {
    currentGoldPrice?: number
    pocketId?: string
    months?: number
    period?: '1m' | '3m' | '6m' | '1y' | 'all'
    groupBy?: 'day' | 'week' | 'month' | 'year'
}
