# Implementation Checklist

**Market-Standard Patterns - Step-by-Step Implementation Guide**

---

## Phase 1: Setup & Registration (5 minutes) ⚡

### Step 1.1: Register HTTP Interceptors
- [ ] Open `src/app/app.module.ts`
- [ ] Add imports:
```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRetryInterceptor, HttpAuthInterceptor, HttpLoggingInterceptor } from './core/interceptors/http.interceptors';
```
- [ ] Add to `providers` array:
```typescript
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: HttpLoggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpRetryInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
]
```
- [ ] Save and verify no compile errors

### Step 1.2: Verify HTTP Interceptors Work
- [ ] Build project: `ng build`
- [ ] Run app: `ng serve`
- [ ] Open DevTools → Network tab
- [ ] Make a simple HTTP call
- [ ] Verify request shows in Network tab with correct headers

**Result:** HTTP interceptors are ready! ✅

---

## Phase 2: Basic Integration (20 minutes) 🔧

### Step 2.1: Use AppIntegrationService in a Component
- [ ] Choose one component (e.g., HomePage)
- [ ] Add import:
```typescript
import { AppIntegrationService } from './core/services/app-integration.service';
```
- [ ] Inject in constructor:
```typescript
constructor(private appIntegration: AppIntegrationService) {}
```
- [ ] Create observable properties:
```typescript
isLoading$ = this.appIntegration.selectIsLoading();
currentUser$ = this.appIntegration.selectCurrentUser();
```

### Step 2.2: Update Component Template
- [ ] Replace hardcoded data with observables using async pipe:
```html
<div *ngIf="isLoading$ | async">Loading...</div>
<h1>{{ (currentUser$ | async)?.profile?.firstName }}'s Dashboard</h1>
```
- [ ] Save and test in browser

**Result:** Component using new patterns! ✅

---

## Phase 3: Service Migration (2-6 hours) 🛠️

### Step 3.1: Audit Existing Services
- [ ] List all services in `src/app/services/` and `src/app/core/services/`
- [ ] For each service, identify:
  - [ ] HTTP calls (these can use interceptors now)
  - [ ] State that should move to app.state
  - [ ] Error handling that should use ErrorFactory

### Step 3.2: Migrate PuzzleService
- [ ] Copy pattern from app-integration.service.ts
- [ ] Add AppIntegrationService dependency:
```typescript
constructor(
  private http: HttpClient,
  private appIntegration: AppIntegrationService,
  private errorLogger: ErrorAndLoggingService
) {}
```
- [ ] Wrap HTTP calls with executeApiCall:
```typescript
getPuzzles() {
  return this.appIntegration.executeApiCall(
    this.http.get('/api/puzzles'),
    'Fetch puzzles'
  );
}
```
- [ ] Update calling code to use returned observable
- [ ] Test in browser

### Step 3.3: Migrate Other Services
- [ ] Repeat Step 3.2 for each service:
  - [ ] StorageService
  - [ ] AuthService
  - [ ] GameService
  - [ ] Any other services

### Step 3.4: Update Components to Use New Services
- [ ] Update each component that calls migrated services
- [ ] Replace direct state with `selectXxx()` methods
- [ ] Use async pipe in templates
- [ ] Test each component

**Result:** All services using new patterns! ✅

---

## Phase 4: State Management Integration (2-4 hours) 📊

### Step 4.1: Map Component State to AppState
- [ ] For each component with BehaviorSubject/state:
  - [ ] Identify what state is used
  - [ ] Check if it exists in AppState
  - [ ] If not, extend AppState interface

### Step 4.2: Replace Component State
- [ ] Replace component `data$` with `selectXxx()`:
```typescript
// Before
data$ = new BehaviorSubject<Challenge[]>([]);

// After
data$ = this.appIntegration.state$.pipe(
  map(state => state.challenge.completedSessions)
);
```

### Step 4.3: Update State Actions
- [ ] When component updates data, dispatch actions:
```typescript
// Before
this.data$.next(newData);

// After
this.appIntegration.startChallenge(id);
```

### Step 4.4: Test State Flow
- [ ] Open DevTools → Console
- [ ] Subscribe to state:
```typescript
this.appIntegration.state$.subscribe(s => console.log(s))
```
- [ ] Trigger actions and verify state updates
- [ ] Check that all components see updated state

**Result:** Centralized state management! ✅

---

## Phase 5: Error Handling Integration (1-2 hours) 🚨

### Step 5.1: Replace Try-Catch Blocks
- [ ] In each service method, replace try-catch:
```typescript
// Before
try {
  const data = await fetch(url);
} catch (e) {
  console.error(e);
}

// After
return this.appIntegration.executeApiCall(
  this.http.get(url),
  'Operation name'
);
```

### Step 5.2: Add Error Handlers in Components
- [ ] Update subscribe blocks to handle errors:
```typescript
this.appIntegration.fetchChallenges().subscribe({
  next: data => { /* handle success */ },
  error: error => {
    this.errorLogger.error(error.message);
    // Show user-friendly message
  }
});
```

### Step 5.3: Add Event Tracking
- [ ] After successful operations:
```typescript
this.errorLogger.trackEvent('operation_name', {
  key1: value1,
  key2: value2
});
```

### Step 5.4: Test Error Handling
- [ ] Simulate network failure: DevTools → Network → Offline
- [ ] Make HTTP call
- [ ] Verify it retries 3 times automatically
- [ ] Check error is logged

**Result:** Production-grade error handling! ✅

---

## Phase 6: Cleanup (1-2 hours) 🧹

### Step 6.1: Remove Old Patterns
- [ ] Remove old BehaviorSubject state from components
- [ ] Remove manual HTTP retry logic
- [ ] Remove old error handling try-catch blocks
- [ ] Remove unused imports

### Step 6.2: Update Tests
- [ ] Update component unit tests to use new services
- [ ] Update service tests to mock AppIntegrationService
- [ ] Add tests for error scenarios

### Step 6.3: Final Verification
- [ ] [ ] All TypeScript errors resolved: `ng build`
- [ ] [ ] All lint errors resolved: `ng lint`
- [ ] [ ] App runs without warnings: `ng serve`
- [ ] [ ] Features work end-to-end
- [ ] [ ] HTTP retry works (DevTools Network tab)
- [ ] [ ] Auth token injected (check headers)
- [ ] [ ] State persists across navigation
- [ ] [ ] Errors logged to console

**Result:** Clean, production-ready codebase! ✅

---

## Phase 7: Testing & Validation (1-2 hours) 🧪

### Step 7.1: Manual Testing
- [ ] Test login flow → verify state updates
- [ ] Test loading state → verify spinner shows
- [ ] Test HTTP call → verify interceptors run
- [ ] Test error → verify retry happens
- [ ] Test navigation → verify state persists
- [ ] Test offline → verify retry logic

### Step 7.2: DevTools Verification
- [ ] Open DevTools → Network tab
- [ ] Make HTTP call that fails
- [ ] Verify 3 retry attempts with delays
- [ ] Check Authorization header injected
- [ ] Check response logged with duration

### Step 7.3: Code Review
- [ ] All services follow integration pattern
- [ ] All components use async pipe
- [ ] All HTTP calls use interceptors
- [ ] All errors logged with ErrorFactory
- [ ] No console.error (use errorLogger instead)
- [ ] No hardcoded API URLs (use config)

**Result:** Fully tested and validated! ✅

---

## Phase 8: Documentation & Handoff (1 hour) 📚

### Step 8.1: Document Custom Patterns
- [ ] If you extended AppState, document new fields
- [ ] If you created new action types, document them
- [ ] Create examples for your specific domain

### Step 8.2: Team Training
- [ ] Share MARKET_STANDARD_CHEATSHEET.md with team
- [ ] Walkthrough app-integration.service.ts as example
- [ ] Pair program on first service migration
- [ ] Review pull requests carefully

### Step 8.3: Create Runbook
- [ ] Document how to:
  - [ ] Run app locally
  - [ ] Register new services
  - [ ] Add new features
  - [ ] Debug common issues
  - [ ] Deploy to staging/production

**Result:** Team ready to use new patterns! ✅

---

## Progress Tracking

### Completion Status

| Phase | Task | Status | Time |
|-------|------|--------|------|
| 1 | Register HTTP Interceptors | ⏳ | 5 min |
| 2 | Basic Integration | ⏳ | 20 min |
| 3 | Service Migration | ⏳ | 2-6 h |
| 4 | State Management | ⏳ | 2-4 h |
| 5 | Error Handling | ⏳ | 1-2 h |
| 6 | Cleanup | ⏳ | 1-2 h |
| 7 | Testing | ⏳ | 1-2 h |
| 8 | Documentation | ⏳ | 1 h |
| **TOTAL** | | | **9-24 h** |

---

## Troubleshooting

### Issue: Interceptors Not Registering
**Symptom:** HTTP calls not retrying  
**Solution:** Verify `multi: true` is set on each interceptor provider

### Issue: State Not Updating
**Symptom:** Component shows old data  
**Solution:** Check using async pipe, not direct subscription

### Issue: Auth Token Not Injected
**Symptom:** Server returns 401  
**Solution:** Verify token in localStorage: `localStorage.getItem('auth_token')`

### Issue: Services Not Compiling
**Symptom:** TypeScript errors about AppIntegrationService  
**Solution:** Verify import path and that service is provided in app.module

---

## Quick Reference

**To access state:**
```typescript
this.appIntegration.selectCurrentUser()
this.appIntegration.selectIsLoading()
this.appIntegration.selectChallengeStats()
```

**To update state:**
```typescript
this.appIntegration.setUserAuthenticated(id, email, token)
this.appIntegration.startChallenge(id)
this.appIntegration.setLoading(true)
```

**To make HTTP calls:**
```typescript
this.appIntegration.fetchUserProfile(id)
this.appIntegration.fetchChallenges()
this.appIntegration.executeApiCall(observable, 'Operation')
```

**To handle errors:**
```typescript
const error = ErrorFactory.createNetworkError(msg, userMsg)
this.errorLogger.error(message)
this.errorLogger.trackEvent('name', data)
```

---

## Success Indicators

You'll know you're done when:

✅ All services use AppIntegrationService  
✅ All components use selectXxx() methods  
✅ All templates use async pipe  
✅ All HTTP calls automatically retry on failure  
✅ All errors logged with ErrorFactory  
✅ No console.log error messages  
✅ DevTools shows correct headers and retries  
✅ Team understands new patterns  
✅ No TypeScript errors  
✅ App is ready for production  

---

## Next: App Store Submission

Once all phases complete, see `PUBLISHING_CHECKLIST.md` for:
- [ ] Code signing
- [ ] App store metadata
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Submission process
- [ ] Review guidelines

---

**Estimated Total Time: 9-24 hours (depending on app complexity)**

Start with Phase 1 (5 minutes) - everything else flows from there!
