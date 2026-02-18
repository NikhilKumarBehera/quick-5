/**
 * Redux-like State Management Pattern
 * Market-standard state management for scalability
 */

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

// ============================================================================
// ACTION TYPES & INTERFACES
// ============================================================================

export enum ActionType {
  // User actions
  USER_LOGIN = '[User] Login',
  USER_LOGOUT = '[User] Logout',
  USER_UPDATE_PROFILE = '[User] Update Profile',
  USER_UPDATE_STATS = '[User] Update Stats',

  // Challenge actions
  CHALLENGE_START = '[Challenge] Start',
  CHALLENGE_ANSWER = '[Challenge] Answer',
  CHALLENGE_COMPLETE = '[Challenge] Complete',
  CHALLENGE_ABANDON = '[Challenge] Abandon',

  // UI actions
  UI_SHOW_LOADING = '[UI] Show Loading',
  UI_HIDE_LOADING = '[UI] Hide Loading',
  UI_SHOW_ERROR = '[UI] Show Error',
  UI_CLEAR_ERROR = '[UI] Clear Error',

  // Settings actions
  SETTINGS_UPDATE = '[Settings] Update',
  SETTINGS_RESET = '[Settings] Reset',
}

export interface Action {
  type: ActionType;
  payload?: any;
  timestamp: number;
}

// ============================================================================
// STATE INTERFACES
// ============================================================================

export interface AppState {
  user: UserState;
  challenge: ChallengeState;
  ui: UIState;
  settings: SettingsState;
}

export interface UserState {
  id: string | null;
  profile: any | null;
  statistics: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChallengeState {
  currentSession: any | null;
  completedSessions: any[];
  isInProgress: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  notification: Notification | null;
  theme: 'light' | 'dark';
}

export interface SettingsState {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  language: string;
  privacy: PrivacySettings;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

export interface PrivacySettings {
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  marketingEmails: boolean;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

export const INITIAL_APP_STATE: AppState = {
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
};

// ============================================================================
// REDUCER LOGIC
// ============================================================================

export function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // User reducers
    case ActionType.USER_LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          isAuthenticated: true,
          isLoading: false,
        },
      };

    case ActionType.USER_LOGOUT:
      return {
        ...state,
        user: INITIAL_APP_STATE.user,
      };

    case ActionType.USER_UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload,
        },
      };

    case ActionType.USER_UPDATE_STATS:
      return {
        ...state,
        user: {
          ...state.user,
          statistics: action.payload,
        },
      };

    // Challenge reducers
    case ActionType.CHALLENGE_START:
      return {
        ...state,
        challenge: {
          ...state.challenge,
          currentSession: action.payload,
          isInProgress: true,
          isLoading: false,
        },
      };

    case ActionType.CHALLENGE_COMPLETE:
      return {
        ...state,
        challenge: {
          ...state.challenge,
          completedSessions: [...state.challenge.completedSessions, action.payload],
          currentSession: null,
          isInProgress: false,
        },
      };

    case ActionType.CHALLENGE_ABANDON:
      return {
        ...state,
        challenge: {
          ...state.challenge,
          currentSession: null,
          isInProgress: false,
        },
      };

    // UI reducers
    case ActionType.UI_SHOW_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: true,
        },
      };

    case ActionType.UI_HIDE_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: false,
        },
      };

    case ActionType.UI_SHOW_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case ActionType.UI_CLEAR_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
        },
      };

    // Settings reducers
    case ActionType.SETTINGS_UPDATE:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case ActionType.SETTINGS_RESET:
      return {
        ...state,
        settings: INITIAL_APP_STATE.settings,
      };

    default:
      return state;
  }
}

// ============================================================================
// STATE SELECTORS (for performance optimization)
// ============================================================================

export const selectors = {
  selectUser: (state: AppState) => state.user,
  selectUserProfile: (state: AppState) => state.user.profile,
  selectUserStatistics: (state: AppState) => state.user.statistics,
  selectIsAuthenticated: (state: AppState) => state.user.isAuthenticated,

  selectChallenge: (state: AppState) => state.challenge,
  selectCurrentChallenge: (state: AppState) => state.challenge.currentSession,
  selectCompletedChallenges: (state: AppState) => state.challenge.completedSessions,
  selectIsInChallenge: (state: AppState) => state.challenge.isInProgress,

  selectUI: (state: AppState) => state.ui,
  selectIsLoading: (state: AppState) => state.ui.isLoading,
  selectError: (state: AppState) => state.ui.error,

  selectSettings: (state: AppState) => state.settings,
  selectPrivacy: (state: AppState) => state.settings.privacy,
};
