/**
 * Represents the global environment configuration.
 */
export interface GlobEnvConfig {
  /**
   * The title of the application.
   */
  VITE_GLOB_APP_TITLE: string
  /**
   * The URL of the API.
   */
  VITE_GLOB_API_URL: string
  /**
   * The prefix for the API URL.
   */
  VITE_GLOB_API_URL_PREFIX?: string
  /**
   * The URL for uploading files.
   */
  VITE_GLOB_UPLOAD_URL?: string
}
