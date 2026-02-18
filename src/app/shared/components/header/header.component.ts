/**
 * Header Component
 *
 * @component
 * Reusable page header with streak tracking and gradient background
 * Displays title, subtitle, and optional trophy button for leaderboard access
 *
 * @example
 * ```html
 * <app-header
 *   title="Welcome"
 *   username="John"
 *   subtitle="Daily Challenge"
 *   gradientClass="gradient-purple-blue"
 *   [showTrophy]="true"
 *   (rightButtonClick)="openLeaderboard()">
 * </app-header>
 * ```
 *
 * @used-in Home, Challenge, Results pages
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { GradientVariantType } from '../types';
import { isValidGradientVariant } from '../type-guards';
import { HEADER } from '../component-config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  /**
   * Header title text
   * Main heading displayed in large font
   * @type {string}
   * @default ''
   */
  @Input() title: string = '';

  /**
   * User's name or username
   * Displayed next to trophy icon
   * @type {string}
   * @default ''
   */
  @Input() username: string = '';

  /**
   * Subtitle or secondary text
   * Displayed below title
   * @type {string}
   * @default ''
   */
  @Input() subtitle: string = '';

  /**
   * Hide subtitle on scroll (for responsive design)
   * @type {boolean}
   * @default false
   */
  @Input() hideSubtitle: boolean = false;

  /**
   * Display trophy/streak indicator button
   * @type {boolean}
   * @default true
   */
  @Input() showTrophy: boolean = true;

  /**
   * Background gradient class
   * Must be one of: gradient-purple-blue, gradient-green, gradient-orange, gradient-pink, gradient-blue
   * @type {GradientVariantType}
   * @default 'gradient-purple-blue'
   */
  @Input() gradientClass: GradientVariantType = HEADER.DEFAULT_GRADIENT;

  /**
   * Icon name for right button (Ionicons)
   * @type {string}
   * @default 'trophy'
   */
  @Input() rightIcon: string = 'trophy';

  /**
   * Emitted when right icon button is clicked
   * @type {EventEmitter<void>}
   * @event
   */
  @Output() rightButtonClick = new EventEmitter<void>();

  /**
   * Emitted on scroll events
   * @type {EventEmitter<Event>}
   * @event
   */
  @Output() scrollEvent = new EventEmitter<Event>();

  /**
   * Validates inputs on component initialization
   */
  ngOnInit(): void {
    this.validateInputs();
  }

  /**
   * Handles right button click
   * @emits rightButtonClick
   */
  onRightButtonClick(): void {
    this.rightButtonClick.emit();
  }

  /**
   * Handles scroll events
   * @param event - Native scroll event
   * @emits scrollEvent
   */
  onScroll(event: Event): void {
    this.scrollEvent.emit(event);
  }

  /**
   * Validates component inputs for correct types and values
   * Logs warnings for invalid inputs but doesn't prevent rendering
   * @private
   */
  private validateInputs(): void {
    // Validate gradient class
    if (!isValidGradientVariant(this.gradientClass)) {
      console.warn(
        `HeaderComponent: Invalid gradient "${this.gradientClass}". ` +
        `Expected one of: ${HEADER.GRADIENTS.join(', ')}.`
      );
      this.gradientClass = HEADER.DEFAULT_GRADIENT;
    }
  }
}
