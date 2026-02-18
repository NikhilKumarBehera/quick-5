/**
 * Type Guards for Components
 * Runtime type checking functions for component inputs
 *
 * Ensures component inputs are valid at runtime,
 * preventing invalid values from being used.
 *
 * @file Type guard functions for validation
 * @module shared/components/type-guards
 */

import {
  BUTTON_COLORS,
  BUTTON_LAYOUTS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  CARD_SIZES,
  CARD_VARIANTS,
  CARD_ICON_POSITIONS,
  GRADIENT_VARIANTS,
  PROGRESS_SIZES,
  PROGRESS_COLORS,
  OPTION_STATES,
  STATS_GRID_COLUMNS,
  ButtonColorType,
  ButtonLayoutType,
  ButtonSizeType,
  ButtonVariantType,
  CardSizeType,
  CardVariantType,
  CardIconPositionType,
  GradientVariantType,
  ProgressSizeType,
  ProgressColorType,
  OptionStateType,
  StatsGridColumnsType
} from './types';

// ============================================================================
// BUTTON COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard for ButtonColorType
 * @param value - Value to check
 * @returns True if value is a valid button color
 */
export const isValidButtonColor = (value: any): value is ButtonColorType => {
  return BUTTON_COLORS.includes(value);
};

/**
 * Type guard for ButtonLayoutType
 * @param value - Value to check
 * @returns True if value is a valid button layout
 */
export const isValidButtonLayout = (value: any): value is ButtonLayoutType => {
  return BUTTON_LAYOUTS.includes(value);
};

/**
 * Type guard for ButtonSizeType
 * @param value - Value to check
 * @returns True if value is a valid button size
 */
export const isValidButtonSize = (value: any): value is ButtonSizeType => {
  return BUTTON_SIZES.includes(value);
};

/**
 * Type guard for ButtonVariantType
 * @param value - Value to check
 * @returns True if value is a valid button variant
 */
export const isValidButtonVariant = (value: any): value is ButtonVariantType => {
  return BUTTON_VARIANTS.includes(value);
};

// ============================================================================
// CARD COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard for CardVariantType
 * @param value - Value to check
 * @returns True if value is a valid card variant
 */
export const isValidCardVariant = (value: any): value is CardVariantType => {
  return CARD_VARIANTS.includes(value);
};

/**
 * Type guard for CardSizeType
 * @param value - Value to check
 * @returns True if value is a valid card size
 */
export const isValidCardSize = (value: any): value is CardSizeType => {
  return CARD_SIZES.includes(value);
};

/**
 * Type guard for CardIconPositionType
 * @param value - Value to check
 * @returns True if value is a valid icon position
 */
export const isValidCardIconPosition = (value: any): value is CardIconPositionType => {
  return CARD_ICON_POSITIONS.includes(value);
};

// ============================================================================
// HEADER COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard for GradientVariantType
 * @param value - Value to check
 * @returns True if value is a valid gradient variant
 */
export const isValidGradientVariant = (value: any): value is GradientVariantType => {
  return GRADIENT_VARIANTS.includes(value);
};

// ============================================================================
// PROGRESS BAR COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard for ProgressSizeType
 * @param value - Value to check
 * @returns True if value is a valid progress size
 */
export const isValidProgressSize = (value: any): value is ProgressSizeType => {
  return PROGRESS_SIZES.includes(value);
};

/**
 * Type guard for ProgressColorType
 * @param value - Value to check
 * @returns True if value is a valid progress color
 */
export const isValidProgressColor = (value: any): value is ProgressColorType => {
  return PROGRESS_COLORS.includes(value);
};

/**
 * Type guard for progress value (0-100)
 * @param value - Value to check
 * @returns True if value is a valid progress value
 */
export const isValidProgressValue = (value: any): value is number => {
  return typeof value === 'number' && value >= 0 && value <= 100;
};

// ============================================================================
// OPTION BUTTON COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard for OptionStateType
 * @param value - Value to check
 * @returns True if value is a valid option state
 */
export const isValidOptionState = (value: any): value is OptionStateType => {
  return OPTION_STATES.includes(value);
};

// ============================================================================
// STATS GRID COMPONENT TYPE GUARDS
// ============================================================================

/**
 * Type guard for StatsGridColumnsType
 * @param value - Value to check
 * @returns True if value is a valid column count
 */
export const isValidStatsGridColumns = (value: any): value is StatsGridColumnsType => {
  return STATS_GRID_COLUMNS.includes(value);
};

// ============================================================================
// UTILITY VALIDATION GUARDS
// ============================================================================

/**
 * Type guard to check if value is a non-empty string
 * @param value - Value to check
 * @returns True if value is a non-empty string
 */
export const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Type guard to check if value is a valid hex color
 * @param value - Value to check
 * @returns True if value is a valid hex color
 */
export const isValidHexColor = (value: any): value is string => {
  return typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value);
};

/**
 * Type guard to check if value is a valid icon name
 * Ionicon names are lowercase with hyphens
 * @param value - Value to check
 * @returns True if value looks like an ionicon name
 */
export const isValidIconName = (value: any): value is string => {
  return typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
};

/**
 * Type guard to check if value is a non-empty array
 * @param value - Value to check
 * @returns True if value is a non-empty array
 */
export const isNonEmptyArray = <T>(value: any): value is T[] => {
  return Array.isArray(value) && value.length > 0;
};

// ============================================================================
// COMPOSITE VALIDATION GUARDS
// ============================================================================

/**
 * Validates button configuration object
 * @param config - Configuration to validate
 * @returns True if config is valid
 */
export const isValidButtonConfig = (config: any): boolean => {
  if (!config || typeof config !== 'object') return false;
  if (!isNonEmptyString(config.label)) return false;
  if (!isNonEmptyString(config.action)) return false;
  if (config.color && !isValidButtonColor(config.color)) return false;
  if (config.icon && !isValidIconName(config.icon)) return false;
  if (config.disabled !== undefined && typeof config.disabled !== 'boolean') return false;
  return true;
};

/**
 * Validates stat item object
 * @param stat - Stat item to validate
 * @returns True if stat is valid
 */
export const isValidStatItem = (stat: any): boolean => {
  if (!stat || typeof stat !== 'object') return false;
  if (!isNonEmptyString(stat.label)) return false;
  if (!stat.value) return false;
  if (!isValidIconName(stat.icon)) return false;
  if (!isValidHexColor(stat.color) && !isNonEmptyString(stat.color)) return false;
  return true;
};

/**
 * Validates array of button configs
 * @param buttons - Array to validate
 * @returns True if all buttons are valid
 */
export const isValidButtonArray = (buttons: any): boolean => {
  if (!Array.isArray(buttons)) return false;
  return buttons.every(isValidButtonConfig);
};

/**
 * Validates array of stats
 * @param stats - Array to validate
 * @returns True if all stats are valid
 */
export const isValidStatArray = (stats: any): boolean => {
  if (!Array.isArray(stats)) return false;
  return stats.every(isValidStatItem);
};
