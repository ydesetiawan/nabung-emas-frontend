/**
 * Authentication and User types
 * Based on EmasGo API specification
 */

/**
 * User entity
 */
export interface IUser {
    id: string
    fullName: string
    email: string
    phone: string
    createdAt: Date
    updatedAt: Date
}

/**
 * Authentication response (login/register)
 */
export interface IAuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
}

/**
 * Login request
 */
export interface ILoginRequest {
    email: string
    password: string
    rememberMe?: boolean
}

/**
 * Register request
 */
export interface IRegisterRequest {
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

/**
 * Forgot password request
 */
export interface IForgotPasswordRequest {
    email: string
}

/**
 * Change password request
 */
export interface IChangePasswordRequest {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

/**
 * Refresh token request
 */
export interface IRefreshTokenRequest {
    refreshToken: string
}

/**
 * Profile update request
 */
export interface IProfileUpdateRequest {
    fullName?: string
    phone?: string
}
