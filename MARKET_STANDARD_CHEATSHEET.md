/**
 * MARKET-STANDARD PATTERNS QUICK REFERENCE
 * Cheat sheet for using the enterprise patterns
 */

// ============================================================================
// 1. STATE MANAGEMENT - Observable-based, Redux-like pattern
// ============================================================================

// Access state as Observable
this.appIntegration.state$.subscribe(state => {
  console.log('User:', state.user);
  console.log('Challenge:', state.challenge);
  console.log('UI:', state.ui);
  console.log('Settings:', state.settings);
});

// Or in template with async pipe
// <div>{{ (appIntegration.state$ | async)?.user?.profile?.firstName }}</div>

// Use selectors for specific data
this.appIntegration.selectCurrentUser().subscribe(user => {});
this.appIntegration.selectIsAuthenticated().subscribe(isAuth => {});
this.appIntegration.selectChallengeStats().subscribe(stats => {});
this.appIntegration.selectIsLoading().subscribe(loading => {});
this.appIntegration.selectTheme().subscribe(theme => {});

// ============================================================================
// 2. ERROR HANDLING - Factory pattern with typed errors
// ============================================================================

import { ErrorFactory, ErrorCode } from './core/services/error-logging.service';

// Create typed errors
const netError = ErrorFactory.createNetworkError('Connection lost', 'Please check your internet');
const authError = ErrorFactory.createUnauthorizedError('Invalid token', 'Please login again');
const validError = ErrorFactory.createValidationError('Email required', 'Email is mandatory');
const gameError = ErrorFactory.createGameStateError('Invalid move', 'This move is not allowed');

// Log errors with severity
this.errorLogger.error('Operation failed');        // ERROR level
this.errorLogger.warn('Something unexpected');    // WARN level
this.errorLogger.info('Action completed');        // INFO level
this.errorLogger.debug('Debug information');      // DEBUG level
this.errorLogger.critical('Critical failure');    // CRITICAL level

// Track custom events
this.errorLogger.trackEvent('user_logged_in', {
  userId: '123',
  email: 'user@example.com',
  timestamp: new Date()
});

// ============================================================================
// 3. HTTP OPERATIONS - Automatic retry with exponential backoff
// ============================================================================

// All HTTP calls automatically get:
// - Exponential backoff retry (1s → 2s → 4s)
// - Auth token injection from localStorage
// - Request/response logging
// - Performance tracking

// Simple GET
this.appIntegration.fetchUserProfile(userId).subscribe(
  profile => console.log('Profile:', profile),
  error => console.error('Failed:', error)
);

// Custom HTTP call with error handling
this.appIntegration.executeApiCall(
  this.http.post('/api/submit', data),
  'Submit action'
).subscribe({
  next: result => console.log('Success:', result),
  error: error => {
    if (error.code === ErrorCode.NETWORK_ERROR) {
      // Handle network error
    } else if (error.code === ErrorCode.UNAUTHORIZED) {
      // Handle auth error
    }
  }
});

// ============================================================================
// 4. CONFIGURATION - Environment-specific settings
// ============================================================================

// Get API base URL
const apiUrl = this.appIntegration.getApiBaseUrl();

// Get retry policy
const retryPolicy = this.appIntegration.getRetryPolicy();
// Returns: { maxAttempts: 3, initialDelayMs: 1000, multiplier: 2 }

// Get full config
const config = this.appIntegration.getConfig();

// Check feature flags
if (config.features.featureFlags['new-puzzle-types']) {
  // Feature is enabled
}

// ============================================================================
// 5. USER & AUTHENTICATION
// ============================================================================

// Login user
this.appIntegration.setUserAuthenticated(userId, email, token);

// Update user profile
this.appIntegration.updateUserProfile('John', 'Doe');

// Check if authenticated
this.appIntegration.selectIsAuthenticated().subscribe(isAuth => {
  if (isAuth) {
    // Show authenticated UI
  }
});

// ============================================================================
// 6. CHALLENGES & GAMING
// ============================================================================

// Start a challenge
this.appIntegration.startChallenge(challengeId);

// Complete a challenge
this.appIntegration.completeChallenge(
  challengeId,
  score,        // User score (0-100)
  timeTaken     // Time in milliseconds
);

// Get challenge stats
this.appIntegration.selectChallengeStats().subscribe(stats => {
  console.log('In progress:', stats.isInProgress);
  console.log('Sessions:', stats.completedSessions);
});

// ============================================================================
// 7. LOADING & UI STATE
// ============================================================================

// Show/hide loading
this.appIntegration.setLoading(true);  // Show spinner
// ... do work ...
this.appIntegration.setLoading(false); // Hide spinner

// Check if loading
this.appIntegration.selectIsLoading().subscribe(isLoading => {
  this.showSpinner = isLoading;
});

// ============================================================================
// 8. SETTINGS & PREFERENCES
// ============================================================================

// Update settings
this.appIntegration.updateSettings('dark', true);  // theme, notifications

// Get theme
this.appIntegration.selectTheme().subscribe(theme => {
  // 'light' or 'dark'
});

// ============================================================================
// 9. UTILITY FUNCTIONS - 50+ helper functions
// ============================================================================

import { 
  debounce, throttle, memoize,
  formatBytes, formatNumber, formatDate,
  isValidEmail, isValidUrl, isValidPhone,
  chunk, unique, groupBy, flatten,
  pick, omit, deepClone, deepMerge,
  isEmpty, retryAsync, withTimeout
} from './shared/utils/utility';

// Debounce (delayed execution after stops)
const debouncedSearch = debounce((term) => {
  this.appIntegration.searchChallenges(term);
}, 300);
searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle (max once per interval)
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);
window.addEventListener('scroll', throttledScroll);

// Format utilities
formatBytes(1024 * 1024);      // "1 MB"
formatNumber(1234567, 2);      // "1,234,567.00"
formatDate(new Date());        // "Jan 15, 2024"

// Validation
isValidEmail('user@example.com');  // true
isValidUrl('https://example.com'); // true
isValidPhone('+1-234-567-8900');   // true

// Array operations
chunk([1,2,3,4,5], 2);         // [[1,2], [3,4], [5]]
unique([1,2,2,3,3,3]);         // [1, 2, 3]
groupBy(items, (item) => item.category);  // { category: [...items] }
flatten([[1,2], [3,4]]);       // [1, 2, 3, 4]

// Object operations
pick(user, ['id', 'email']);   // { id: '...', email: '...' }
omit(user, ['password']);      // { id: '...', email: '...', ... }
deepClone(complexObject);      // Deep copy
deepMerge(obj1, obj2);         // Recursive merge

// Async utilities
isValidEmail('test') || isEmpty(value);  // Check if empty
await retryAsync(() => fetch('/api'), 3, 1000);  // Retry 3 times
await withTimeout(longPromise, 5000);    // Timeout after 5s

// Memoization (cache function results)
const memoizedCalculation = memoize((x) => expensiveCalculation(x));
memoizedCalculation(5);  // Calculated
memoizedCalculation(5);  // Cached result

// ============================================================================
// 10. COMPONENT INTEGRATION EXAMPLES
// ============================================================================

// EXAMPLE 1: Home Page (show authenticated user & challenges)
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <div *ngIf="isLoading$ | async" class="spinner"></div>
    
    <h1>{{ (currentUser$ | async)?.profile?.firstName }}'s Challenges</h1>
    <div *ngFor="let session of (challengeStats$ | async)?.completedSessions">
      {{ session.name }}: {{ session.score }} points
    </div>
  `
})
export class HomePage implements OnInit {
  currentUser$ = this.appIntegration.selectCurrentUser();
  isLoading$ = this.appIntegration.selectIsLoading();
  challengeStats$ = this.appIntegration.selectChallengeStats();

  constructor(private appIntegration: AppIntegrationService) {}

  ngOnInit() {
    this.appIntegration.fetchChallenges().subscribe();
  }
}

// EXAMPLE 2: Challenge Page (play & submit)
export class ChallengePage {
  currentChallenge$ = this.appIntegration.state$.pipe(
    map(state => state.challenge.currentSession)
  );

  constructor(
    private appIntegration: AppIntegrationService,
    private errorLogger: ErrorAndLoggingService
  ) {}

  startChallenge(id: string) {
    this.appIntegration.startChallenge(id);
  }

  submitChallenge(answerId: string) {
    this.appIntegration.submitChallenge(answerId).subscribe({
      next: (result) => {
        this.errorLogger.trackEvent('challenge_passed', {
          score: result.score,
          duration: result.duration
        });
      },
      error: (error) => {
        this.errorLogger.error(`Challenge failed: ${error.message}`);
      }
    });
  }
}

// EXAMPLE 3: Settings Page (theme & notifications)
export class SettingsPage {
  theme$ = this.appIntegration.selectTheme();

  constructor(private appIntegration: AppIntegrationService) {}

  changeTheme(newTheme: 'light' | 'dark') {
    this.appIntegration.updateSettings(newTheme, true);
  }
}

// EXAMPLE 4: Login Page (authentication)
export class LoginPage {
  isLoading$ = this.appIntegration.selectIsLoading();

  constructor(
    private appIntegration: AppIntegrationService,
    private http: HttpClient
  ) {}

  login(email: string, password: string) {
    this.appIntegration.setLoading(true);

    this.http.post('/auth/login', { email, password }).subscribe({
      next: (response: any) => {
        // Set state
        this.appIntegration.setUserAuthenticated(
          response.userId,
          response.email,
          response.token
        );

        // Store token for interceptor
        localStorage.setItem('auth_token', response.token);

        this.appIntegration.setLoading(false);
        // Navigate to home
      },
      error: (error) => {
        this.appIntegration.setLoading(false);
        // Show error message
      }
    });
  }
}

// ============================================================================
// 11. DEBUGGING TIPS
// ============================================================================

// In browser console
// View all state
this.appIntegration.state$.subscribe(s => console.log(s));

// Check if authenticated
localStorage.getItem('auth_token');

// View HTTP logs
// Open Network tab in DevTools
// Look for each request and its retries

// Check error logs
// Open Console tab in DevTools
// Look for [ErrorAndLoggingService] messages

// ============================================================================
// 12. COMMON PATTERNS
// ============================================================================

// Wait for auth before loading data
this.appIntegration.selectIsAuthenticated()
  .pipe(
    filter(isAuth => isAuth),
    switchMap(() => this.appIntegration.fetchChallenges())
  )
  .subscribe();

// Auto-retry on error
this.appIntegration.fetchChallenges()
  .pipe(
    retry(3),  // RxJS retry operator (different from HTTP retry)
    catchError(error => {
      this.errorLogger.error('Final attempt failed', error);
      return of([]);  // Return empty array on failure
    })
  )
  .subscribe();

// Combine multiple state streams
combineLatest([
  this.appIntegration.selectCurrentUser(),
  this.appIntegration.selectChallengeStats()
]).pipe(
  map(([user, stats]) => ({
    userName: user.profile.firstName,
    totalChallenges: stats.completedSessions.length
  }))
).subscribe(data => console.log(data));

// ============================================================================
// 13. PERFORMANCE TIPS
// ============================================================================

// ✅ DO: Use selectors (optimized)
this.user$ = this.appIntegration.selectCurrentUser();

// ❌ DON'T: Map entire state
this.user$ = this.appIntegration.state$.pipe(
  map(state => state.user)  // Unnecessary - use selector instead
);

// ✅ DO: Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ✅ DO: Unsubscribe or use async pipe
ngOnDestroy() {
  this.destroy$.next();
}

// ✅ DO: Use shareReplay for expensive operations
expensive$ = this.appIntegration.fetchUserProfile(id).pipe(
  shareReplay(1)  // Cache result for all subscribers
);
