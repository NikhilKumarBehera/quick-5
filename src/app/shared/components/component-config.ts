/**
 * Component Configuration
 * Centralized configuration for all reusable components
 *
 * @file Component-level constants and configuration
 * @module shared/components/component-config
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
  RESPONSIVE_BREAKPOINTS
} from './types';

/**
 * Comprehensive component configuration object
 * Centralized source of truth for component settings
 *
 * @constant
 * @readonly
 */
export const COMPONENT_CONFIG = {
  /**
   * Button Group Component Configuration
   */
  BUTTON: {
    /** Available button variants */
    VARIANTS: BUTTON_VARIANTS,
    /** Available button sizes */
    SIZES: BUTTON_SIZES,
    /** Available button colors */
    COLORS: BUTTON_COLORS,
    /** Available layout options */
    LAYOUTS: BUTTON_LAYOUTS,

    /** Default size when not specified */
    DEFAULT_SIZE: 'medium' as const,
    /** Default variant when not specified */
    DEFAULT_VARIANT: 'solid' as const,
    /** Default color when not specified */
    DEFAULT_COLOR: 'primary' as const,
    /** Default layout when not specified */
    DEFAULT_LAYOUT: 'horizontal' as const,

    /** Button border radius */
    BORDER_RADIUS: '12px',
    /** Button padding for small size */
    PADDING_SMALL: '8px 12px',
    /** Button padding for medium size */
    PADDING_MEDIUM: '12px 16px',
    /** Button padding for large size */
    PADDING_LARGE: '16px 20px',

    /** Animation duration */
    ANIMATION_DURATION: '300ms',
  },

  /**
   * Card Component Configuration
   */
  CARD: {
    /** Available card variants */
    VARIANTS: CARD_VARIANTS,
    /** Available card sizes */
    SIZES: CARD_SIZES,
    /** Available icon positions */
    ICON_POSITIONS: CARD_ICON_POSITIONS,

    /** Default size when not specified */
    DEFAULT_SIZE: 'medium' as const,
    /** Default variant when not specified */
    DEFAULT_VARIANT: 'default' as const,
    /** Default icon position */
    DEFAULT_ICON_POSITION: 'start' as const,

    /** Show shadow by default */
    DEFAULT_SHADOW: true,
    /** Card is clickable by default */
    DEFAULT_CLICKABLE: false,

    /** Card border radius */
    BORDER_RADIUS: '12px',
    /** Card padding for small size */
    PADDING_SMALL: '12px',
    /** Card padding for medium size */
    PADDING_MEDIUM: '16px',
    /** Card padding for large size */
    PADDING_LARGE: '20px',

    /** Shadow elevation for card */
    SHADOW_ELEVATION: 4,
    /** Shadow color (rgba) */
    SHADOW_COLOR: 'rgba(0, 0, 0, 0.15)',
  },

  /**
   * Header Component Configuration
   */
  HEADER: {
    /** Available gradient variants */
    GRADIENTS: GRADIENT_VARIANTS,

    /** Default gradient variant */
    DEFAULT_GRADIENT: 'purple-blue' as const,
    /** Show trophy button by default */
    SHOW_TROPHY_BY_DEFAULT: true,

    /** Header height */
    HEIGHT: '280px',
    /** Header padding */
    PADDING: '24px',

    /** Streak card size */
    STREAK_CARD_WIDTH: '120px',
    /** Streak card height */
    STREAK_CARD_HEIGHT: '100px',

    /** Animation duration for subtitle */
    ANIMATION_DURATION: '300ms',
  },

  /**
   * Progress Bar Component Configuration
   */
  PROGRESS: {
    /** Minimum progress value */
    MIN_VALUE: 0,
    /** Maximum progress value */
    MAX_VALUE: 100,

    /** Available progress sizes */
    SIZES: PROGRESS_SIZES,
    /** Available progress colors */
    COLORS: PROGRESS_COLORS,

    /** Default size when not specified */
    DEFAULT_SIZE: 'medium' as const,
    /** Default color when not specified */
    DEFAULT_COLOR: 'primary' as const,

    /** Progress bar height for small size */
    HEIGHT_SMALL: '4px',
    /** Progress bar height for medium size */
    HEIGHT_MEDIUM: '8px',
    /** Progress bar height for large size */
    HEIGHT_LARGE: '12px',

    /** Animation transition duration */
    TRANSITION_DURATION: '600ms',
    /** Show percentage label by default */
    SHOW_LABEL_BY_DEFAULT: true,
  },

  /**
   * Stats Grid Component Configuration
   */
  STATS_GRID: {
    /** Available column counts */
    COLUMNS: STATS_GRID_COLUMNS,
    /** Default column count */
    DEFAULT_COLUMNS: 3 as const,

    /** Show dividers between stats by default */
    DEFAULT_SHOW_DIVIDERS: false,
    /** Center align text by default */
    DEFAULT_CENTERED: true,

    /** Grid gap between items */
    GAP: '16px',
    /** Responsive breakpoints */
    RESPONSIVE_BREAKPOINTS,
  },

  /**
   * Option Button Component Configuration
   */
  OPTION: {
    /** Available option states */
    STATES: OPTION_STATES,
    /** Available option sizes */
    SIZES: BUTTON_SIZES,

    /** Default state when not specified */
    DEFAULT_STATE: 'default' as const,
    /** Default size when not specified */
    DEFAULT_SIZE: 'medium' as const,

    /** Option button border radius */
    BORDER_RADIUS: '8px',
    /** Option button padding */
    PADDING: '12px 16px',

    /** Animation duration */
    ANIMATION_DURATION: '300ms',
  },

  /**
   * Global Component Settings
   */
  GLOBAL: {
    /** Default breakpoint for responsive design (mobile) */
    BREAKPOINT_MOBILE: 480,
    /** Default breakpoint for responsive design (tablet) */
    BREAKPOINT_TABLET: 768,
    /** Default breakpoint for responsive design (desktop) */
    BREAKPOINT_DESKTOP: 1024,

    /** Global animation duration */
    ANIMATION_DURATION: '300ms',
    /** Global transition timing function */
    TRANSITION_TIMING: 'cubic-bezier(0.4, 0, 0.2, 1)',

    /** Global border radius */
    BORDER_RADIUS: '12px',

    /** Default font family */
    FONT_FAMILY: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',

    /** Accessibility: Reduced motion preference */
    PREFERS_REDUCED_MOTION: '@media (prefers-reduced-motion: reduce)',
  },
} as const;

/**
 * Export individual component configs for easier access
 */
export const {
  BUTTON,
  CARD,
  HEADER,
  PROGRESS,
  STATS_GRID,
  OPTION,
  GLOBAL
} = COMPONENT_CONFIG;
