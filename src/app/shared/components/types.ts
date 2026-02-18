/**
 * Shared Component Types
 * Centralized type definitions for all components
 * Prevents type duplication and ensures consistency
 *
 * @file Type definitions for reusable components
 * @module shared/components/types
 */

// ============================================================================
// BUTTON COMPONENT TYPES
// ============================================================================

/**
 * Button color variants
 * @type {ButtonColorType}
 */
export const BUTTON_COLORS = ['primary', 'secondary', 'success', 'danger', 'warning'] as const;
export type ButtonColorType = typeof BUTTON_COLORS[number];

/**
 * Button layout options
 * Controls how buttons are arranged
 * @type {ButtonLayoutType}
 */
export const BUTTON_LAYOUTS = ['horizontal', 'vertical', 'grid'] as const;
export type ButtonLayoutType = typeof BUTTON_LAYOUTS[number];

/**
 * Button size options
 * @type {ButtonSizeType}
 */
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSizeType = typeof BUTTON_SIZES[number];

/**
 * Button style variants
 * @type {ButtonVariantType}
 */
export const BUTTON_VARIANTS = ['solid', 'outline', 'clear'] as const;
export type ButtonVariantType = typeof BUTTON_VARIANTS[number];

// ============================================================================
// CARD COMPONENT TYPES
// ============================================================================

/**
 * Card color/style variants
 * @type {CardVariantType}
 */
export const CARD_VARIANTS = ['default', 'gradient', 'success', 'warning', 'error'] as const;
export type CardVariantType = typeof CARD_VARIANTS[number];

/**
 * Card size options
 * @type {CardSizeType}
 */
export const CARD_SIZES = ['small', 'medium', 'large'] as const;
export type CardSizeType = typeof CARD_SIZES[number];

/**
 * Icon position within card
 * @type {CardIconPositionType}
 */
export const CARD_ICON_POSITIONS = ['start', 'end'] as const;
export type CardIconPositionType = typeof CARD_ICON_POSITIONS[number];

// ============================================================================
// HEADER COMPONENT TYPES
// ============================================================================

/**
 * Gradient background variants
 * @type {GradientVariantType}
 */
export const GRADIENT_VARIANTS = ['purple-blue', 'green', 'orange', 'pink'] as const;
export type GradientVariantType = typeof GRADIENT_VARIANTS[number];

// ============================================================================
// PROGRESS BAR COMPONENT TYPES
// ============================================================================

/**
 * Progress bar size options
 * @type {ProgressSizeType}
 */
export const PROGRESS_SIZES = ['small', 'medium', 'large'] as const;
export type ProgressSizeType = typeof PROGRESS_SIZES[number];

/**
 * Progress bar color variants
 * @type {ProgressColorType}
 */
export const PROGRESS_COLORS = ['primary', 'success', 'warning', 'danger', 'custom'] as const;
export type ProgressColorType = typeof PROGRESS_COLORS[number];

// ============================================================================
// OPTION BUTTON COMPONENT TYPES
// ============================================================================

/**
 * Option button state variants
 * Represents current state of an option (for quiz/selection)
 * @type {OptionStateType}
 */
export const OPTION_STATES = ['default', 'selected', 'correct', 'incorrect'] as const;
export type OptionStateType = typeof OPTION_STATES[number];

// ============================================================================
// STATS GRID COMPONENT TYPES
// ============================================================================

/**
 * Stats grid column count
 * @type {StatsGridColumnsType}
 */
export const STATS_GRID_COLUMNS = [1, 2, 3] as const;
export type StatsGridColumnsType = typeof STATS_GRID_COLUMNS[number];

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Button configuration interface
 * Defines a single button in a button group
 */
export interface IButtonConfig {
  /** Button display label */
  label: string;

  /** Action identifier emitted on click */
  action: string;

  /** Button color theme */
  color?: ButtonColorType;

  /** Icon name (ionicon) */
  icon?: string;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Statistic item for stats grid display
 */
export interface IStatItem {
  /** Display label */
  label: string;

  /** Value to display */
  value: string | number;

  /** Icon name (ionicon) */
  icon: string;

  /** Icon color (hex or named) */
  color: string;
}

/**
 * Challenge data interface
 */
export interface IChallenge {
  /** Unique challenge ID */
  id: string;

  /** Challenge title */
  title: string;

  /** Challenge difficulty */
  difficulty: 'easy' | 'medium' | 'hard';

  /** Progress percentage (0-100) */
  progress: number;

  /** Whether challenge is completed */
  completed: boolean;

  /** Challenge icon */
  icon: string;
}

// ============================================================================
// UNION TYPES FOR COMMON PATTERNS
// ============================================================================

/**
 * Any size type used across components
 */
export type AnySizeType = ButtonSizeType | CardSizeType | ProgressSizeType;

/**
 * Any color type used across components
 */
export type AnyColorType = ButtonColorType | ProgressColorType | OptionStateType;

/**
 * Breakpoint sizes for responsive design
 */
export type ResponsiveBreakpointType = 'mobile' | 'tablet' | 'desktop';

export const RESPONSIVE_BREAKPOINTS: Record<ResponsiveBreakpointType, number> = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};
