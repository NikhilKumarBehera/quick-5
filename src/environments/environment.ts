/**
 * Development Environment Configuration
 * This file is used during development. It's replaced with environment.prod.ts during production build.
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableLogging: true,
  enableDebugTools: true,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  requestTimeout: 30000, // 30 seconds
} as const;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';
  // Included with Angular CLI.
