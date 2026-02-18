/**
 * App Integration Service
 * 
 * Shows how to integrate:
 * - State management (app.state.ts)
 * - Error handling (error-logging.service.ts)
 * - Configuration (app-config.interface.ts)
 * - HTTP interceptors (http.interceptors.ts)
 * 
 * This is a TEMPLATE for how to use the new market-standard patterns
 * Copy this pattern to your services
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AppState, appStateReducer, ActionType } from '../state/app.state';
import { ErrorAndLoggingService, ErrorFactory } from './error-logging.service';
import { DEVELOPMENT_CONFIG } from '../config/app-config.interface';

/**
 * INTEGRATION SERVICE PATTERN
 * 
 * This service demonstrates the recommended usage of:
 * 1. Centralized state management
 * 2. Error handling with factory pattern
 * 3. Configuration management
 * 4. HTTP operations with interceptors
 */
@Injectable({
  providedIn: 'root',
})
export class AppIntegrationService {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  /**
   * Central application state
   * Managed through AppState interface and reducer pattern
   */
  private appState$ = new BehaviorSubject<AppState>({
    user: {
      id: null,
      profile: null,
      statistics: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    },
    challenge: {
      currentSession: null,
      completedSessions: [],
      isInProgress: false,
      isLoading: false,
      error: null,
    },
    ui: {
      isLoading: false,
      error: null,
      notification: null,
      theme: 'light',
    },
    settings: {
      soundEnabled: true,
      notificationsEnabled: true,
      autoSave: true,
      language: 'en',
      privacy: {
        analyticsEnabled: true,
        crashReportingEnabled: true,
        marketingEmails: false,
      },
    },
  });

  /**
   * Expose immutable state as Observable
   * Components subscribe to this instead of directly modifying state
   */
  public state$ = this.appState$.asObservable();

  // ========================================================================
  // CONFIGURATION MANAGEMENT
  // ========================================================================

  /**
   * Application configuration based on environment
   * Access environment-specific settings
   */
  private config = DEVELOPMENT_CONFIG;

  getConfig() {
    return this.config;
  }

  getApiBaseUrl(): string {
    return this.config.api.baseUrl;
  }

  getRetryPolicy() {
    return this.config.api.retryPolicy;
  }

  // ========================================================================
  // ERROR HANDLING & LOGGING
  // ========================================================================

  /**
   * ErrorAndLoggingService is injected as dependency
   * All errors pass through this service for consistent handling
   */
  constructor(
    private http: HttpClient,
    private errorLogger: ErrorAndLoggingService
  ) {
    this.initializeAppState();
  }

  /**
   * Initialize app state on service startup
   */
  private initializeAppState(): void {
    this.errorLogger.info('App Integration Service initialized');
  }

  /**
   * Example: Handle API call with proper error handling
   */
  protected executeApiCall<T>(
    request: Observable<T>,
    operationName: string
  ): Observable<T> {
    return request.pipe(
      map((result) => {
        this.errorLogger.info(`${operationName} completed successfully`);
        return result;
      }),
      catchError((error) => {
        // Use ErrorFactory to create typed errors
        const appError = ErrorFactory.createNetworkError(
          error.message,
          `Failed to ${operationName}`
        );

        // Log the error with proper severity (pass as string, not Error object)
        this.errorLogger.error(appError.message);

        // Dispatch error to state
        this.dispatchAction({
          type: ActionType.UI_SHOW_ERROR,
          payload: appError.message,
        });

        throw appError;
      })
    );
  }

  // ========================================================================
  // STATE ACTIONS
  // ========================================================================

  /**
   * Dispatch action to update state
   * All state changes go through the reducer
   */
  private dispatchAction(action: any): void {
    const currentState = this.appState$.value;
    const newState = appStateReducer(currentState, action);
    this.appState$.next(newState);

    this.errorLogger.debug(`Action dispatched: ${action.type}`);
  }

  /**
   * Example: Update user authentication state
   */
  setUserAuthenticated(userId: string, email: string, token: string): void {
    this.dispatchAction({
      type: ActionType.USER_LOGIN,
      payload: { userId, email, token },
    });

    this.errorLogger.info(`User authenticated: ${email}`);
  }

  /**
   * Example: Update user profile
   */
  updateUserProfile(firstName: string, lastName: string): void {
    this.dispatchAction({
      type: ActionType.USER_UPDATE_PROFILE,
      payload: { firstName, lastName },
    });

    this.errorLogger.info('User profile updated');
  }

  /**
   * Example: Start challenge session
   */
  startChallenge(challengeId: string): void {
    this.dispatchAction({
      type: ActionType.CHALLENGE_START,
      payload: { challengeId, startTime: new Date() },
    });

    this.errorLogger.info(`Challenge started: ${challengeId}`);
  }

  /**
   * Example: Complete challenge
   */
  completeChallenge(
    challengeId: string,
    score: number,
    timeTaken: number
  ): void {
    this.dispatchAction({
      type: ActionType.CHALLENGE_COMPLETE,
      payload: { challengeId, score, timeTaken, completedAt: new Date() },
    });

    this.errorLogger.info(`Challenge completed: ${challengeId} (Score: ${score})`);
  }

  /**
   * Example: Show loading state
   */
  setLoading(isLoading: boolean): void {
    this.dispatchAction({
      type: isLoading ? ActionType.UI_SHOW_LOADING : ActionType.UI_HIDE_LOADING,
      payload: isLoading,
    });
  }

  /**
   * Example: Update settings
   */
  updateSettings(theme: string, notifications: boolean): void {
    this.dispatchAction({
      type: ActionType.SETTINGS_UPDATE,
      payload: { theme, notifications },
    });

    this.errorLogger.info('Settings updated');
  }

  // ========================================================================
  // USAGE EXAMPLES
  // ========================================================================

  /**
   * EXAMPLE 1: Simple HTTP call with error handling
   *
   * Usage in component:
   * ```typescript
   * this.appIntegration.fetchUserProfile(userId).subscribe(
   *   (profile) => console.log(profile),
   *   (error) => console.error(error)
   * );
   * ```
   */
  fetchUserProfile(userId: string): Observable<any> {
    const url = `${this.config.api.baseUrl}/users/${userId}`;

    return this.executeApiCall(
      this.http.get(url),
      `Fetch user profile for ${userId}`
    );
  }

  /**
   * EXAMPLE 2: HTTP call with performance tracking
   *
   * Usage in component:
   * ```typescript
   * this.appIntegration.fetchChallenges().subscribe(
   *   (challenges) => this.challenges = challenges
   * );
   * ```
   */
  fetchChallenges(): Observable<any[]> {
    const operationName = 'Fetch challenges';
    const url = `${this.config.api.baseUrl}/challenges`;

    return this.executeApiCall(
      this.http.get<any[]>(url),
      operationName
    );
  }

  /**
   * EXAMPLE 3: Stateful operation with multiple steps
   *
   * Usage in component:
   * ```typescript
   * this.appIntegration.submitChallenge(answerId).subscribe(
   *   (result) => console.log('Challenge submitted:', result)
   * );
   * ```
   */
  submitChallenge(answerId: string): Observable<any> {
    // Step 1: Show loading
    this.setLoading(true);

    const url = `${this.config.api.baseUrl}/challenges/submit`;
    const payload = { answerId, submittedAt: new Date() };

    return this.executeApiCall(
      this.http.post(url, payload),
      'Submit challenge'
    ).pipe(
      map((result: any) => {
        // Step 2: Update state
        this.completeChallenge(answerId, result?.score || 0, result?.duration || 0);

        // Step 3: Hide loading
        this.setLoading(false);

        // Step 4: Log event for analytics
        this.errorLogger.trackEvent('challenge_submitted', {
          challengeId: answerId,
          score: result?.score || 0,
        });

        return result;
      }),
      catchError((error) => {
        // Step 3: Hide loading on error
        this.setLoading(false);

        throw error;
      })
    );
  }

  // ========================================================================
  // SELECTOR PATTERN
  // ========================================================================

  /**
   * Selectors provide optimized, memoized access to state
   * Usage: this.appIntegration.selectUserProfile().subscribe(...)
   */

  selectCurrentUser(): Observable<any> {
    return this.state$.pipe(map((state) => state.user));
  }

  selectIsAuthenticated(): Observable<boolean> {
    return this.state$.pipe(map((state) => state.user.isAuthenticated));
  }

  selectChallengeStats(): Observable<any> {
    return this.state$.pipe(map((state) => state.challenge));
  }

  selectIsLoading(): Observable<boolean> {
    return this.state$.pipe(map((state) => state.ui.isLoading));
  }

  selectTheme(): Observable<string> {
    return this.state$.pipe(map((state) => state.ui.theme));
  }
}
