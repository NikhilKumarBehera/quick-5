# Market-Standard Integration Guide

**Complete guide for integrating enterprise patterns into your Ionic/Angular app**

## Table of Contents
1. [Overview](#overview)
2. [Service Integration](#service-integration)
3. [Component Usage](#component-usage)
4. [Migration Path](#migration-path)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This guide shows how to use the four market-standard patterns created for your app:

| Pattern | File | Purpose |
|---------|------|---------|
| **State Management** | `app.state.ts` | Redux-like centralized state |
| **Error Handling** | `error-logging.service.ts` | Enterprise error + logging |
| **Configuration** | `app-config.interface.ts` | Environment-agnostic config |
| **HTTP Interceptors** | `http.interceptors.ts` | Retry + Auth + Logging |
| **Utilities** | `utility.ts` | 50+ helper functions |
| **Integration Service** | `app-integration.service.ts` | Example of combining all patterns |

---

## Service Integration

### Step 1: Register HTTP Interceptors in `app.module.ts`

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRetryInterceptor } from './core/interceptors/http.interceptors';
import { HttpAuthInterceptor } from './core/interceptors/http.interceptors';
import { HttpLoggingInterceptor } from './core/interceptors/http.interceptors';

@NgModule({
  providers: [
    // Register interceptors with multi: true to allow multiple
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRetryInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoggingInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
```

### Step 2: Inject Services in Your Component

```typescript
import { Component, OnInit } from '@angular/core';
import { AppIntegrationService } from './core/services/app-integration.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  challenges$ = this.appIntegration.state$.pipe(
    map(state => state.challenge.completedSessions)
  );

  isLoading$ = this.appIntegration.selectIsLoading();
  userProfile$ = this.appIntegration.selectCurrentUser();

  constructor(private appIntegration: AppIntegrationService) {}

  ngOnInit() {
    // Fetch challenges on component init
    this.appIntegration.fetchChallenges().subscribe();
  }
}
```

---

## Component Usage

### Pattern 1: Display Loading State

```typescript
// In your component
export class ChallengesComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private appIntegration: AppIntegrationService) {
    this.isLoading$ = this.appIntegration.selectIsLoading();
  }

  loadChallenges() {
    this.appIntegration.setLoading(true);
    this.appIntegration.fetchChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.appIntegration.setLoading(false);
      },
      error: (error) => {
        console.error('Failed to load challenges:', error);
        this.appIntegration.setLoading(false);
      },
    });
  }
}
```

### Pattern 2: Handle Authentication

```typescript
// In your auth service
export class AuthService {
  constructor(private appIntegration: AppIntegrationService) {}

  login(email: string, password: string) {
    this.appIntegration.setLoading(true);

    return this.http.post('/auth/login', { email, password }).pipe(
      tap((response: any) => {
        // Set authenticated state
        this.appIntegration.setUserAuthenticated(
          response.userId,
          response.email,
          response.token
        );

        // Store token for interceptor
        localStorage.setItem('auth_token', response.token);

        this.appIntegration.setLoading(false);
      }),
      catchError((error) => {
        this.appIntegration.setLoading(false);
        throw error;
      })
    );
  }
}
```

### Pattern 3: Manage Challenge State

```typescript
// In your challenge component
export class ChallengeComponent implements OnInit {
  currentChallenge$ = this.appIntegration.state$.pipe(
    map(state => state.challenge.currentSession)
  );

  constructor(private appIntegration: AppIntegrationService) {}

  startChallenge(challengeId: string) {
    this.appIntegration.startChallenge(challengeId);
  }

  submitAnswer(answerId: string) {
    this.appIntegration.submitChallenge(answerId).subscribe({
      next: (result) => {
        console.log('Challenge submitted:', result);
        // Component state updated automatically via state$
      },
      error: (error) => console.error('Submission failed:', error),
    });
  }
}
```

---

## Migration Path

### Phase 1: Add New Services (Your current state)
✅ Created HTTP interceptors, state management, error handling, utilities  
✅ Created integration service as reference  

### Phase 2: Register Interceptors (Next immediate step)
1. Open `src/app/app.module.ts`
2. Add HTTP_INTERCEPTORS providers (see Step 1 above)
3. Test that HTTP calls work with retry logic

### Phase 3: Migrate Existing Services
For each existing service (PuzzleService, StorageService, etc.):

**Before (Old Pattern):**
```typescript
export class PuzzleService {
  constructor(private http: HttpClient) {}

  getPuzzles() {
    return this.http.get('/api/puzzles');
  }
}
```

**After (New Pattern):**
```typescript
import { AppIntegrationService } from './app-integration.service';

export class PuzzleService {
  constructor(
    private http: HttpClient,
    private appIntegration: AppIntegrationService,
    private errorLogger: ErrorAndLoggingService
  ) {}

  getPuzzles() {
    this.appIntegration.setLoading(true);

    return this.appIntegration.executeApiCall(
      this.http.get('/api/puzzles'),
      'Fetch puzzles'
    ).pipe(
      tap(() => this.appIntegration.setLoading(false)),
      catchError((error) => {
        this.appIntegration.setLoading(false);
        throw error;
      })
    );
  }
}
```

### Phase 4: Update Components to Use New State
Replace component-level state with app-level state:

**Before:**
```typescript
export class TabsComponent {
  challenges: any[] = [];

  loadChallenges() {
    this.puzzleService.getChallenges().subscribe(
      data => this.challenges = data
    );
  }
}
```

**After:**
```typescript
export class TabsComponent {
  challenges$ = this.appIntegration.state$.pipe(
    map(state => state.challenge.completedSessions)
  );

  ngOnInit() {
    this.appIntegration.fetchChallenges().subscribe();
  }

  constructor(private appIntegration: AppIntegrationService) {}
}
```

---

## Best Practices

### 1. Always Use State for Global Data
```typescript
// ❌ Avoid: Component-level state for global data
export class HomeComponent {
  currentUser = new BehaviorSubject<any>(null);
}

// ✅ Prefer: Use app-integration service state
export class HomeComponent {
  currentUser$ = this.appIntegration.selectCurrentUser();

  constructor(private appIntegration: AppIntegrationService) {}
}
```

### 2. Handle Errors Consistently
```typescript
// ❌ Avoid: Generic error handling
this.http.get('/api/data').subscribe({
  error: (e) => console.log('Error occurred')
});

// ✅ Prefer: Typed error handling
this.appIntegration.fetchUserProfile(id).subscribe({
  error: (error) => {
    // ErrorFactory ensures type safety
    if (error.code === ErrorCode.NETWORK_ERROR) {
      // Handle network error specifically
    }
  }
});
```

### 3. Log Important Operations
```typescript
// ❌ Avoid: Silent failures
this.appIntegration.submitChallenge(id).subscribe();

// ✅ Prefer: Track events
this.appIntegration.submitChallenge(id).subscribe({
  next: (result) => {
    this.errorLogger.trackEvent('challenge_completed', {
      challengeId: id,
      score: result.score,
      timestamp: new Date(),
    });
  },
  error: (error) => {
    this.errorLogger.error('Challenge submission failed', error);
  }
});
```

### 4. Use Utility Functions for Common Tasks
```typescript
import { debounce, throttle, formatBytes, isValidEmail } from './shared/utils/utility';

// Debounce search input
const searchInput$ = new Subject<string>();
searchInput$.pipe(
  debounce((term) => this.appIntegration.searchChallenges(term), 300)
).subscribe();

// Validate email before submission
if (!isValidEmail(email)) {
  this.errorLogger.warn('Invalid email format');
}

// Format file size
const fileSizeStr = formatBytes(fileSizeBytes);
```

### 5. Access Configuration Safely
```typescript
// Get API base URL from config
const apiUrl = this.appIntegration.getApiBaseUrl();

// Get retry policy for advanced handling
const retryPolicy = this.appIntegration.getRetryPolicy();

// Use feature flags from config
const config = this.appIntegration.getConfig();
if (config.features.featureFlags['new-puzzle-types']) {
  // Show new feature UI
}
```

---

## Troubleshooting

### Issue: HTTP Interceptors Not Working

**Symptom:** Requests aren't retrying on failure  
**Solution:**
1. Verify interceptors are registered in `app.module.ts`
2. Check that `multi: true` is set on each provider
3. Verify order: Logging → Retry → Auth (this order matters)

```typescript
// Correct order
{
  provide: HTTP_INTERCEPTORS,
  useClass: HttpLoggingInterceptor,
  multi: true,
},
{
  provide: HTTP_INTERCEPTORS,
  useClass: HttpRetryInterceptor,
  multi: true,
},
{
  provide: HTTP_INTERCEPTORS,
  useClass: HttpAuthInterceptor,
  multi: true,
},
```

### Issue: State Updates Not Showing in Template

**Symptom:** Data bound to `state$` not updating  
**Solution:**
1. Ensure you're using async pipe: `{{ data$ | async }}`
2. Verify actions are being dispatched: Check browser console for debug logs
3. Make sure reducer handles the action type

```typescript
// ❌ Wrong: Forgot async pipe
<div>{{ challenges$ }}</div>

// ✅ Correct: Using async pipe
<div>{{ (challenges$ | async)?.length }}</div>
```

### Issue: Auth Token Not Being Sent

**Symptom:** Server returns 401 Unauthorized  
**Solution:**
1. Check token is stored in localStorage: `localStorage.getItem('auth_token')`
2. Verify AuthInterceptor reads from correct key
3. Test with manual HTTP header:

```typescript
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});
this.http.get('/api/data', { headers }).subscribe();
```

### Issue: Memory Leaks from Subscriptions

**Symptom:** App slows down over time  
**Solution:**
1. Use `takeUntil` in components:

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.appIntegration.state$
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      // Handle state
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

2. Or use async pipe in templates (handles unsubscription automatically)

### Issue: Configuration Not Loading

**Symptom:** Config values are undefined  
**Solution:**
1. Verify config is imported correctly:

```typescript
import { DEVELOPMENT_CONFIG, PRODUCTION_CONFIG } from '../config/app-config.interface';
```

2. Check you're using the right environment config
3. Verify feature flags exist before accessing:

```typescript
const config = this.appIntegration.getConfig();
const isFeatureEnabled = config.features.featureFlags['feature-name'] ?? false;
```

---

## Quick Reference

### Common Actions
```typescript
// Authentication
this.appIntegration.setUserAuthenticated(userId, email, token);

// Loading state
this.appIntegration.setLoading(true);

// Challenge state
this.appIntegration.startChallenge(challengeId);
this.appIntegration.completeChallenge(challengeId, score, duration);

// Notifications
this.appIntegration.updateSettings(theme, notifications);
```

### Common Selectors
```typescript
// Observable streams
this.appIntegration.selectCurrentUser();
this.appIntegration.selectIsAuthenticated();
this.appIntegration.selectChallengeStats();
this.appIntegration.selectIsLoading();
this.appIntegration.selectTheme();
```

### Common Utilities
```typescript
import { 
  debounce, throttle, memoize, deepClone,
  formatBytes, isValidEmail, formatDate,
  chunk, unique, groupBy, pick, omit
} from './shared/utils/utility';
```

---

## Next Steps

1. **Register interceptors** in `app.module.ts` (5 min)
2. **Test HTTP calls** in browser DevTools (10 min)
3. **Migrate first service** (PuzzleService or StorageService) (30 min)
4. **Update components** to use new state (1-2 hours)
5. **Remove old state** management code (1 hour)

**Total migration time: ~4 hours for complete app**

Would you like help with any specific step?
