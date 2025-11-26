/**
 * Analytics types
 * Based on EmasGo API specification
 */

/**
 * Dashboard statistics
 */
export interface IPortfolioSummary {
    totalValue: number
    totalWeight: number
    totalPockets: number
    totalTransactions: number
    averagePricePerGram: number
    currentGoldPrice: number
    currentValue: number
    profitLoss: number
    profitLossPercentage: number
}

export interface ITopPockets {
    id: string
    user_id: string
    type_pocket_id: string
    name: string
    description: string
    aggregate_total_price: number
    aggregate_total_weight: number
    target_weight: number
    type_pocket: {
        id: string
        name: string
        description: string
        icon: string
        color: string
        created_at: string
        updated_at: string
    }
    created_at: string
    updated_at: string
}

export interface IRecentTransactions {
    id: string
    pocketId: string
    transactionDate: string
    brand: string
    weight: number
    totalPrice: number
    pocket: {
        id: string
        name: string
        typePocket: {
            color: string
        }
    }
}

export interface IDashboardData {
    portfolio: IPortfolioSummary,
    topPockets: ITopPockets[],
    recentTransactions: IRecentTransactions[]
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
