/**
 * Business Constants for Gold Savings App
 * Following the pattern from copilot-instructions.md
 */

// Gold brands
export const GOLD_BRANDS = {
    antam: 'Antam',
    ubs: 'UBS',
    pegadaian: 'Pegadaian',
    kingHalim: 'King Halim',
    custom: 'Custom',
} as const

export type GoldBrand = typeof GOLD_BRANDS[keyof typeof GOLD_BRANDS]

export const GOLD_BRAND_LIST = Object.values(GOLD_BRANDS)

// Pocket type categories with icons and colors
export const POCKET_TYPES = {
    emergency: {
        name: 'Emergency Fund',
        icon: 'heroicons:shield-check',
        color: 'blue',
    },
    wedding: {
        name: 'Wedding',
        icon: 'heroicons:heart',
        color: 'pink',
    },
    investment: {
        name: 'Investment',
        icon: 'heroicons:chart-bar',
        color: 'gold',
    },
    education: {
        name: 'Education',
        icon: 'heroicons:academic-cap',
        color: 'green',
    },
    retirement: {
        name: 'Retirement',
        icon: 'heroicons:home',
        color: 'purple',
    },
} as const

export type PocketTypeKey = keyof typeof POCKET_TYPES

// Weight units
export const WEIGHT_UNIT = {
    gram: 'g',
    kilogram: 'kg',
} as const

// Currency
export const CURRENCY = {
    idr: 'IDR',
} as const

// Business rules and validation constraints
export const BUSINESS_RULES = {
    // Transaction constraints
    minTransactionWeight: 0.1, // grams
    maxTransactionWeight: 1000, // grams
    minPricePerGram: 1000, // IDR
    maxPricePerGram: 10000000, // IDR

    // Pocket constraints
    minPocketNameLength: 3,
    maxPocketNameLength: 100,
    maxDescriptionLength: 500,

    // Pagination
    defaultPageSize: 20,
    maxPageSize: 100,
} as const

// Date format patterns
export const DATE_FORMATS = {
    display: 'dd MMM yyyy',
    displayWithTime: 'dd MMM yyyy HH:mm',
    input: 'yyyy-MM-dd',
    api: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const

// Chart colors
export const CHART_COLORS = {
    primary: '#3B82F6',
    gold: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gray: '#6B7280',
} as const

// Storage keys (namespaced)
export const STORAGE_KEYS = {
    pockets: 'gold.pockets',
    transactions: 'gold.transactions',
    selectedPocketId: 'gold.selectedPocketId',
    userPreferences: 'gold.user.preferences',
    analyticsCache: 'gold.analytics.cache',
    locale: 'gold.locale',
    darkMode: 'gold.darkMode',
} as const

// API endpoints
export const API_ENDPOINTS = {
    pockets: '/api/pockets',
    transactions: '/api/transactions',
    typePockets: '/api/type-pockets',
    analytics: '/api/analytics',
    goldPrice: '/api/gold-price/current',
} as const
