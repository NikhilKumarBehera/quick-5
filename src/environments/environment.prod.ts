/**
 * Production Environment Configuration
 * This file is used during production builds.
 */

export const environment = {
  production: true,
  apiUrl: 'https://api.brainboost.app/api',
  enableLogging: false,
  enableDebugTools: false,
  cacheDuration: 1 * 60 * 60 * 1000, // 1 hour
  requestTimeout: 30000, // 30 seconds
} as const;
