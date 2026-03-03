/**
 * BrainBoost - Production-Grade Configuration
 * Market-Standard Enterprise Architecture
 */

// ============================================================================
// ENVIRONMENT-AGNOSTIC CONFIGURATION
// ============================================================================

export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    minVersionCode: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryPolicy: RetryPolicy;
    interceptors: string[];
  };
  features: {
    featureFlags: Record<string, boolean>;
    betaFeatures: string[];
  };
  performance: {
    preloadStrategies: string[];
    cacheStrategy: CacheStrategy;
    bundleOptimizations: BundleOptimizations;
  };
  analytics: {
    enabled: boolean;
    trackingId: string;
    events: EventTracking;
  };
  security: {
    enableSSLPinning: boolean;
    encryptionLevel: 'high' | 'medium';
    tokenRefreshStrategy: 'auto' | 'manual';
  };
  monitoring: {
    errorReporting: boolean;
    performanceMonitoring: boolean;
    crashReporting: boolean;
  };
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelayMs: number;
  maxDelayMs: number;
}

export interface CacheStrategy {
  enabled: boolean;
  ttlMs: number;
  maxSize: number;
  compression: boolean;
}

export interface BundleOptimizations {
  lazyLoadModules: boolean;
  treeShakerEnabled: boolean;
  minification: boolean;
  sourceMaps: boolean;
}

export interface EventTracking {
  userBehavior: boolean;
  featureUsage: boolean;
  performance: boolean;
  errors: boolean;
}

// ============================================================================
// PRODUCTION CONFIG
// ============================================================================

export const PRODUCTION_CONFIG: AppConfig = {
  app: {
    name: 'BrainBoost',
    version: '1.0.0',
    description: 'Interactive puzzle game for cognitive skill development',
    minVersionCode: 1,
  },
  api: {
    baseUrl: 'https://api.brainboost.app/v1',
    timeout: 30000,
    retryPolicy: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
    },
    interceptors: ['auth', 'error-handling', 'performance-monitoring'],
  },
  features: {
    featureFlags: {
      'new-puzzle-types': true,
      'social-features': false,
      'ads': false,
      'premium-pass': false,
    },
    betaFeatures: [],
  },
  performance: {
    preloadStrategies: ['critical-puzzles', 'user-preferences'],
    cacheStrategy: {
      enabled: true,
      ttlMs: 3600000, // 1 hour
      maxSize: 52428800, // 50MB
      compression: true,
    },
    bundleOptimizations: {
      lazyLoadModules: true,
      treeShakerEnabled: true,
      minification: true,
      sourceMaps: false,
    },
  },
  analytics: {
    enabled: true,
    trackingId: 'GA-BRAINBOOST-PROD',
    events: {
      userBehavior: true,
      featureUsage: true,
      performance: true,
      errors: true,
    },
  },
  security: {
    enableSSLPinning: true,
    encryptionLevel: 'high',
    tokenRefreshStrategy: 'auto',
  },
  monitoring: {
    errorReporting: true,
    performanceMonitoring: true,
    crashReporting: true,
  },
};

// ============================================================================
// DEVELOPMENT CONFIG
// ============================================================================

export const DEVELOPMENT_CONFIG: AppConfig = {
  ...PRODUCTION_CONFIG,
  api: {
    ...PRODUCTION_CONFIG.api,
    baseUrl: 'http://localhost:3000/api',
  },
  features: {
    featureFlags: {
      ...PRODUCTION_CONFIG.features.featureFlags,
      'debug-mode': true,
      'mock-data': true,
    },
    betaFeatures: ['experimental-ai', 'dark-mode-v2'],
  },
  performance: {
    ...PRODUCTION_CONFIG.performance,
    bundleOptimizations: {
      ...PRODUCTION_CONFIG.performance.bundleOptimizations,
      sourceMaps: true,
    },
  },
  analytics: {
    ...PRODUCTION_CONFIG.analytics,
    enabled: false,
  },
  monitoring: {
    ...PRODUCTION_CONFIG.monitoring,
    performanceMonitoring: true,
  },
};

// ============================================================================
// STAGING CONFIG
// ============================================================================

export const STAGING_CONFIG: AppConfig = {
  ...PRODUCTION_CONFIG,
  api: {
    ...PRODUCTION_CONFIG.api,
    baseUrl: 'https://staging-api.brainboost.app/v1',
  },
  analytics: {
    ...PRODUCTION_CONFIG.analytics,
    trackingId: 'GA-BRAINBOOST-STAGING',
  },
  security: {
    ...PRODUCTION_CONFIG.security,
    enableSSLPinning: false, // For testing
  },
};
