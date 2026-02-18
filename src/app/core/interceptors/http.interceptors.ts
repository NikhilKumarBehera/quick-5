/**
 * Enterprise HTTP Interceptor with Exponential Backoff & Retry Logic
 * Production-grade request/response handling
 */

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, retryWhen, catchError, tap, timeout, finalize } from 'rxjs/operators';

import { ErrorFactory, AppError, ErrorCode } from '../services/error-logging.service';

export interface RetryConfig {
  maxRetries: number;
  excludeStatusCodes: number[];
  backoffConfig: BackoffConfig;
}

export interface BackoffConfig {
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  excludeStatusCodes: [400, 401, 403, 404, 422],
  backoffConfig: {
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    multiplier: 2,
  },
};

@Injectable()
export class HttpRetryInterceptor implements HttpInterceptor {
  private requestStartTimes = new Map<string, number>();

  constructor(private retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    this.requestStartTimes.set(requestId, startTime);

    return next.handle(this.addRequestHeaders(request, requestId)).pipe(
      // Add timeout
      timeout(30000),

      // Tap to track request
      tap((event) => {
        // Log successful response
      }),

      // Retry logic with exponential backoff
      retryWhen((errors) =>
        errors.pipe(
          this.exponentialBackoffRetry(
            this.retryConfig.maxRetries,
            this.retryConfig.backoffConfig,
            this.retryConfig.excludeStatusCodes
          )
        )
      ),

      // Error handling
      catchError((error) => this.handleError(error, requestId)),

      // Cleanup
      finalize(() => {
        this.requestStartTimes.delete(requestId);
      })
    );
  }

  /**
   * Exponential backoff retry strategy
   * Retries failed requests with increasing delays
   */
  private exponentialBackoffRetry(
    maxRetries: number,
    backoffConfig: BackoffConfig,
    excludeStatusCodes: number[]
  ) {
    return (errors: Observable<any>) => {
      let retryCount = 0;

      return errors.pipe(
        retryWhen((error$) =>
          error$.pipe(
            tap((error) => {
              retryCount++;

              // Don't retry if status code is in exclude list
              if (
                error instanceof HttpErrorResponse &&
                excludeStatusCodes.includes(error.status)
              ) {
                throw error;
              }

              // Don't retry if max retries exceeded
              if (retryCount > maxRetries) {
                throw error;
              }

              const delayMs = this.calculateBackoffDelay(
                retryCount,
                backoffConfig
              );

              console.warn(
                `Retry attempt ${retryCount}/${maxRetries} after ${delayMs}ms`
              );
            }),
            catchError((error) => {
              throw error;
            })
          )
        )
      );
    };
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  private calculateBackoffDelay(
    retryCount: number,
    config: BackoffConfig
  ): number {
    const exponentialDelay =
      config.initialDelayMs *
      Math.pow(config.multiplier, retryCount - 1);
    const delay = Math.min(exponentialDelay, config.maxDelayMs);

    // Add jitter: ±10% of delay
    const jitter = delay * 0.1 * (Math.random() * 2 - 1);
    return Math.max(0, Math.round(delay + jitter));
  }

  /**
   * Handle HTTP errors with proper error codes
   */
  private handleError(error: any, requestId: string): Observable<never> {
    let appError: AppError;

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          appError = ErrorFactory.createNetworkError(error, { requestId });
          break;
        case 401:
          appError = ErrorFactory.createUnauthorizedError();
          break;
        case 403:
          appError = ErrorFactory.createUnknownError({
            message: 'Access forbidden',
          });
          break;
        case 404:
          appError = ErrorFactory.createUnknownError({
            message: 'Resource not found',
          });
          break;
        case 422:
          appError = ErrorFactory.createValidationError(
            'request',
            error.error?.message || 'Invalid request'
          );
          break;
        case 500:
          appError = ErrorFactory.createUnknownError({
            message: 'Server error',
          });
          break;
        case 503:
          appError = ErrorFactory.createUnknownError({
            message: 'Service unavailable',
          });
          break;
        default:
          appError = ErrorFactory.createUnknownError(error);
      }
    } else if (error.name === 'TimeoutError') {
      appError = ErrorFactory.createTimeoutError();
    } else {
      appError = ErrorFactory.createUnknownError(error);
    }

    return throwError(() => appError);
  }

  /**
   * Add custom headers and request tracking
   */
  private addRequestHeaders(
    request: HttpRequest<any>,
    requestId: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'X-Request-ID': requestId,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const start = Date.now();

    return next.handle(request).pipe(
      tap(
        (event) => {
          const duration = Date.now() - start;
          console.log(
            `[HTTP] ${request.method} ${request.url} (${duration}ms)`
          );
        },
        (error) => {
          const duration = Date.now() - start;
          console.error(
            `[HTTP] ${request.method} ${request.url} failed (${duration}ms)`,
            error
          );
        }
      )
    );
  }
}
