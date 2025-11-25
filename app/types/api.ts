/**
 * API Response wrappers
 */
export interface IAPIResponse<T = any> {
    success: boolean
    data: T
    message?: string
}

export interface IAPIError {
    success: false
    message: string
    errors?: Record<string, string[]>
}

export interface IPaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
