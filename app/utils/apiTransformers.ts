/**
 * API Transformers - Convert between snake_case (API) and camelCase (Frontend)
 * Following the pattern from copilot-instructions.md
 */

/**
 * Convert a string from camelCase to snake_case
 */
function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * Convert a string from snake_case to camelCase
 */
function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Transform object keys from camelCase to snake_case
 * Handles nested objects and arrays
 */
export function toSnakeCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toSnakeCase(item)) as T
    }

    if (typeof obj === 'object' && !(obj instanceof Date)) {
        const transformed: any = {}
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const snakeKey = camelToSnake(key)
                transformed[snakeKey] = toSnakeCase(obj[key])
            }
        }
        return transformed as T
    }

    return obj
}

/**
 * Transform object keys from snake_case to camelCase
 * Handles nested objects and arrays
 */
export function toCamelCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item)) as T
    }

    if (typeof obj === 'object' && !(obj instanceof Date)) {
        const transformed: any = {}
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const camelKey = snakeToCamel(key)
                transformed[camelKey] = toCamelCase(obj[key])
            }
        }
        return transformed as T
    }

    return obj
}

/**
 * Transform request data before sending to API
 * Converts camelCase to snake_case
 */
export function transformRequest<T = any>(data: any): T {
    return toSnakeCase<T>(data)
}

/**
 * Transform response data after receiving from API
 * Converts snake_case to camelCase
 */
export function transformResponse<T = any>(data: any): T {
    return toCamelCase<T>(data)
}

/**
 * Transform API error response
 */
export interface ITransformedError {
    message: string
    errors?: Record<string, string[]>
}

export function transformError(error: any): ITransformedError {
    if (error?.data) {
        return {
            message: error.data.message || 'An error occurred',
            errors: error.data.errors ? toCamelCase(error.data.errors) : undefined,
        }
    }

    return {
        message: error?.message || 'An error occurred',
    }
}
