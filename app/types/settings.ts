/**
 * Settings types
 * Based on EmasGo API specification
 */

/**
 * Notification settings
 */
export interface INotificationSettings {
    email: boolean
    push: boolean
    priceAlerts: boolean
}

/**
 * User settings
 */
export interface ISettings {
    language: 'en' | 'id'
    theme: 'light' | 'dark' | 'system'
    notifications: INotificationSettings
}

/**
 * Settings update request
 */
export interface ISettingsUpdateRequest {
    language?: 'en' | 'id'
    theme?: 'light' | 'dark' | 'system'
    notifications?: Partial<INotificationSettings>
}
