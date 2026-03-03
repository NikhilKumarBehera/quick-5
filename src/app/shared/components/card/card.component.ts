/**
 * Card Component
 *
 * @component
 * Reusable card component with multiple style variants
 * Supports various sizes, colors, and optional icons
 *
 * @example
 * ```html
 * <app-card
 *   title="Achievement Unlocked"
 *   subtitle="Complete 10 daily challenges"
 *   variant="success"
 *   icon="star"
 *   size="medium"
 *   [isClickable]="true"
 *   (cardClick)="onCardClick()">
 * </app-card>
 * ```
 *
 * @used-in All pages
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CardVariantType, CardSizeType, CardIconPositionType } from '../types';
import { isValidCardVariant, isValidCardSize, isValidCardIconPosition } from '../type-guards';
import { CARD } from '../component-config';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  /**
   * Card title text
   * Main heading displayed in bold
   * @type {string}
   * @default ''
   */
  @Input() title: string = '';

  /**
   * Card subtitle or description text
   * Displayed below title in smaller font
   * @type {string}
   * @default ''
   */
  @Input() subtitle: string = '';

  /**
   * Visual variant/color scheme
   * - 'default': Standard light background
   * - 'gradient': Multi-color gradient background
   * - 'success': Green accent (positive actions)
   * - 'warning': Orange accent (caution)
   * - 'error': Red accent (errors)
   * @type {CardVariantType}
   * @default 'default'
   */
  @Input() variant: CardVariantType = CARD.DEFAULT_VARIANT;

  /**
   * Icon name (Ionicons)
   * Displayed in card header
   * @type {string}
   * @default ''
   */
  @Input() icon: string = '';

  /**
   * Icon position relative to title
   * - 'start': Left side (LTR) / Right side (RTL)
   * - 'end': Right side (LTR) / Left side (RTL)
   * @type {CardIconPositionType}
   * @default 'start'
   */
  @Input() iconPosition: CardIconPositionType = CARD.DEFAULT_ICON_POSITION;

  /**
   * Card size
   * Affects padding and font sizes
   * - 'small': Compact layout
   * - 'medium': Standard layout
   * - 'large': Spacious layout
   * @type {CardSizeType}
   * @default 'medium'
   */
  @Input() size: CardSizeType = CARD.DEFAULT_SIZE;

  /**
   * Display drop shadow
   * Visual depth cue
   * @type {boolean}
   * @default true
   */
  @Input() hasShadow: boolean = true;

  /**
   * Make card interactive with click feedback
   * Applies hover effects and cursor pointer
   * @type {boolean}
   * @default false
   */
  @Input() isClickable: boolean = false;

  /**
   * Emitted when clickable card is clicked
   * @type {EventEmitter<void>}
   * @event
   */
  @Output() cardClick = new EventEmitter<void>();

  /**
   * Validates inputs on component initialization
   */
  ngOnInit(): void {
    this.validateInputs();
  }

  /**
   * Handles card click events
   * Only emitted if isClickable is true
   * @emits cardClick
   */
  onCardClick(): void {
    if (this.isClickable) {
      this.cardClick.emit();
    }
  }

  /**
   * Validates component inputs for correct types and values
   * Logs warnings for invalid inputs but doesn't prevent rendering
   * @private
   */
  private validateInputs(): void {
    // Validate variant
    if (!isValidCardVariant(this.variant)) {
      console.warn(
        `CardComponent: Invalid variant "${this.variant}". ` +
        `Expected one of: ${CARD.VARIANTS.join(', ')}.`
      );
      this.variant = CARD.DEFAULT_VARIANT;
    }

    // Validate size
    if (!isValidCardSize(this.size)) {
      console.warn(
        `CardComponent: Invalid size "${this.size}". ` +
        `Expected one of: ${CARD.SIZES.join(', ')}.`
      );
      this.size = CARD.DEFAULT_SIZE;
    }

    // Validate icon position
    if (!isValidCardIconPosition(this.iconPosition)) {
      console.warn(
        `CardComponent: Invalid icon position "${this.iconPosition}". ` +
        `Expected one of: start, end.`
      );
      this.iconPosition = CARD.DEFAULT_ICON_POSITION;
    }
  }
}
