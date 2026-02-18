/**
 * Progress Bar Component
 *
 * @component
 * Visual progress indicator with animations and customization options
 * Displays progress value (0-100) with optional label
 *
 * @example
 * ```html
 * <app-progress-bar
 *   [value]="75"
 *   size="medium"
 *   color="success"
 *   [animated]="true"
 *   [striped]="false"
 *   label="Questions Answered">
 * </app-progress-bar>
 * ```
 *
 * @used-in Challenge, Results pages
 */

import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ProgressSizeType, ProgressColorType } from '../types';
import { isValidProgressSize, isValidProgressColor, isValidProgressValue } from '../type-guards';
import { PROGRESS } from '../component-config';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ProgressBarComponent implements OnInit, OnChanges {
  /**
   * Progress value (0-100)
   * Represents completion percentage
   * @type {number}
   * @default 0
   * @min 0
   * @max 100
   */
  @Input() value: number = 0;

  /**
   * Progress bar height
   * - 'small': 4px (subtle progress)
   * - 'medium': 8px (standard)
   * - 'large': 16px (prominent)
   * @type {ProgressSizeType}
   * @default 'medium'
   */
  @Input() size: ProgressSizeType = PROGRESS.DEFAULT_SIZE;

  /**
   * Progress bar color
   * - 'primary': Blue (default action)
   * - 'success': Green (positive completion)
   * - 'warning': Orange (caution/partial)
   * - 'danger': Red (critical/failed)
   * @type {ProgressColorType}
   * @default 'primary'
   */
  @Input() color: ProgressColorType = PROGRESS.DEFAULT_COLOR;

  /**
   * Enable animation
   * Smooth bar fill transition
   * @type {boolean}
   * @default false
   */
  @Input() animated: boolean = false;

  /**
   * Enable striped pattern
   * Diagonal stripe animation overlay
   * @type {boolean}
   * @default false
   */
  @Input() striped: boolean = false;

  /**
   * Display percentage label
   * Shows value as "75%"
   * @type {boolean}
   * @default true
   */
  @Input() showLabel: boolean = true;

  /**
   * Custom hex color
   * Overrides standard color when provided
   * Example: '#FF6B6B'
   * @type {string | undefined}
   * @default undefined
   */
  @Input() customColor?: string;

  /**
   * Custom label text
   * Displayed above progress bar
   * Example: "Loading..."
   * @type {string | undefined}
   * @default undefined
   */
  @Input() label?: string;

  /**
   * Computed percentage for display
   * Clamped between 0-100
   * @type {number}
   * @internal
   */
  percent: number = 0;

  /**
   * Validates inputs on component initialization
   */
  ngOnInit(): void {
    this.validateInputs();
    this.updatePercent();
  }

  /**
   * Validates inputs on input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.updatePercent();
    }

    // Re-validate on changes
    this.validateInputs();
  }

  /**
   * Updates percent value (clamped 0-100)
   * @private
   */
  private updatePercent(): void {
    this.percent = Math.min(Math.max(this.value, 0), 100);
  }

  /**
   * Validates component inputs for correct types and values
   * @private
   */
  private validateInputs(): void {
    // Validate value range
    if (!isValidProgressValue(this.value)) {
      console.warn(
        `ProgressBarComponent: Invalid value "${this.value}". Expected number between 0-100.`
      );
    }

    // Validate size
    if (!isValidProgressSize(this.size)) {
      console.warn(
        `ProgressBarComponent: Invalid size "${this.size}". ` +
        `Expected one of: ${PROGRESS.SIZES.join(', ')}.`
      );
      this.size = PROGRESS.DEFAULT_SIZE;
    }

    // Validate color
    if (!isValidProgressColor(this.color)) {
      console.warn(
        `ProgressBarComponent: Invalid color "${this.color}". ` +
        `Expected one of: ${PROGRESS.COLORS.join(', ')}.`
      );
      this.color = PROGRESS.DEFAULT_COLOR;
    }
  }

  /**
   * Gets CSS classes for progress bar
   * @returns CSS class string with all modifiers
   * @internal
   */
  getProgressClass(): string {
    let classes = `progress-bar size-${this.size}`;

    // Add color class (unless custom color provided)
    if (this.color !== 'custom') {
      classes += ` color-${this.color}`;
    }

    // Add animation modifiers
    if (this.animated) {
      classes += ' animated';
    }

    if (this.striped) {
      classes += ' striped';
    }

    return classes;
  }
}
