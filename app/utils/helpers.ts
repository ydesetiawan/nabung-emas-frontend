/**
 * Helper utilities for Gold Savings App
 * Pure functions for data transformation and formatting
 */

import { CURRENCY } from './constants'

/**
 * Format currency in IDR
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: CURRENCY.idr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format currency in compact form (K, M, B)
 */
export function formatCompactCurrency(amount: number): string {
    if (amount >= 1000000000) {
        return `Rp${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
        return `Rp${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
        return `Rp${(amount / 1000).toFixed(1)}K`
    }
    return formatCurrency(amount)
}

/**
 * Format weight in grams
 */
export function formatWeight(weight: number): string {
    return `${weight.toFixed(2)}g`
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date

    if (format === 'short') {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(d)
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return formatDate(d, 'short')
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0
    return (value / total) * 100
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

/**
 * Generate unique ID (simple version)
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}
