/**
 * Gold Calculator Composable
 * Business logic for gold price calculations
 */

import type { IPocketStats } from '~/types/pocket'

export const useGoldCalculator = () => {
    const currentGoldPrice = ref(1050000) // IDR per gram, will be fetched from API

    /**
     * Calculate total price from weight and price per gram
     */
    const calculateTotalPrice = (weight: number, pricePerGram: number): number => {
        return weight * pricePerGram
    }

    /**
     * Calculate average price per gram
     */
    const calculateAveragePrice = (totalPrice: number, totalWeight: number): number => {
        if (totalWeight === 0) return 0
        return totalPrice / totalWeight
    }

    /**
     * Calculate current value based on market price
     */
    const calculateCurrentValue = (weight: number): number => {
        return weight * currentGoldPrice.value
    }

    /**
     * Calculate profit/loss
     */
    const calculateProfitLoss = (
        investedAmount: number,
        currentValue: number
    ): { amount: number; percentage: number; isProfit: boolean } => {
        const profit = currentValue - investedAmount
        const percentage = investedAmount > 0 ? (profit / investedAmount) * 100 : 0

        return {
            amount: profit,
            percentage,
            isProfit: profit >= 0,
        }
    }

    /**
     * Calculate pocket statistics
     */
    const calculatePocketStats = (
        totalPrice: number,
        totalWeight: number
    ): IPocketStats => {
        const averagePricePerGram = calculateAveragePrice(totalPrice, totalWeight)
        const currentValue = calculateCurrentValue(totalWeight)
        const { amount: profitLoss, percentage: profitLossPercentage } =
            calculateProfitLoss(totalPrice, currentValue)

        return {
            totalWeight,
            totalValue: totalPrice,
            averagePricePerGram,
            currentValue,
            profitLoss,
            profitLossPercentage,
        }
    }

    /**
     * Fetch current gold price from API
     */
    async function fetchCurrentGoldPrice() {
        try {
            const { $publicApi } = useNuxtApp()
            const response = await $publicApi<{ price: number }>('/api/gold-price/current')
            currentGoldPrice.value = response.price
        } catch (error) {
            console.error('Failed to fetch gold price:', error)
            // Keep using cached price
        }
    }

    return {
        currentGoldPrice: readonly(currentGoldPrice),
        calculateTotalPrice,
        calculateAveragePrice,
        calculateCurrentValue,
        calculateProfitLoss,
        calculatePocketStats,
        fetchCurrentGoldPrice,
    }
}
