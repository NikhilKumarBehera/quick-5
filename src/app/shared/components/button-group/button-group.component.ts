/**
 * Button Group Component
 *
 * @component
 * Reusable button group for action collections
 * Supports multiple layout options and styling variants
 *
 * @example
 * ```html
 * <app-button-group
 *   [buttons]="[
 *     { label: 'Cancel', action: 'cancel', color: 'medium' },
 *     { label: 'Submit', action: 'submit', color: 'primary' }
 *   ]"
 *   layout="horizontal"
 *   size="medium"
 *   variant="solid"
 *   (buttonClick)="onAction($event)">
 * </app-button-group>
 * ```
 *
 * @used-in All pages, dialogs, and modals
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IButtonConfig, ButtonLayoutType, ButtonSizeType, ButtonVariantType } from '../types';
import { isValidButtonArray, isValidButtonLayout, isValidButtonSize, isValidButtonVariant } from '../type-guards';
import { BUTTON } from '../component-config';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent implements OnInit {
  /**
   * Array of buttons configuration
   * Each button must have label and action properties
   * @type {IButtonConfig[]}
   * @required
   */
  @Input() buttons: IButtonConfig[] = [];

  /**
   * Button layout arrangement
   * - 'horizontal': Buttons in a row (wraps on mobile)
   * - 'vertical': Buttons in a column stack
   * - 'grid': 2-column grid (1 column on mobile)
   * @type {ButtonLayoutType}
   * @default 'horizontal'
   */
  @Input() layout: ButtonLayoutType = BUTTON.DEFAULT_LAYOUT;

  /**
   * Button size
   * Affects padding, font size, and icon size
   * @type {ButtonSizeType}
   * @default 'medium'
   */
  @Input() size: ButtonSizeType = BUTTON.DEFAULT_SIZE;

  /**
   * Full width buttons (expand to container width)
   * @type {boolean}
   * @default true
   */
  @Input() expand: boolean = true;

  /**
   * Button visual style variant
   * - 'solid': Filled background
   * - 'outline': Border only
   * - 'clear': Text only
   * @type {ButtonVariantType}
   * @default 'solid'
   */
  @Input() variant: ButtonVariantType = BUTTON.DEFAULT_VARIANT;

  /**
   * Emitted when any button is clicked
   * Emits the button's 'action' property value
   * @type {EventEmitter<string>}
   * @event
   */
  @Output() buttonClick = new EventEmitter<string>();

  /**
   * Validates inputs on component initialization
   */
  ngOnInit(): void {
    this.validateInputs();
  }

  /**
   * Handles button click events
   * @param action - The action identifier from the clicked button
   * @emits buttonClick with action string
   */
  onButtonClick(action: string): void {
    this.buttonClick.emit(action);
  }

  /**
   * Validates component inputs for correct types and values
   * Logs warnings for invalid inputs but doesn't prevent rendering
   * @private
   */
  private validateInputs(): void {
    // Validate buttons array
    if (!isValidButtonArray(this.buttons)) {
      console.warn(
        'ButtonGroupComponent: Invalid buttons array. Expected array of valid button configs.',
        this.buttons
      );
    }

    // Validate layout
    if (!isValidButtonLayout(this.layout)) {
      console.warn(
        `ButtonGroupComponent: Invalid layout "${this.layout}". Expected one of: horizontal, vertical, grid.`
      );
      this.layout = BUTTON.DEFAULT_LAYOUT;
    }

    // Validate size
    if (!isValidButtonSize(this.size)) {
      console.warn(
        `ButtonGroupComponent: Invalid size "${this.size}". Expected one of: small, medium, large.`
      );
      this.size = BUTTON.DEFAULT_SIZE;
    }

    // Validate variant
    if (!isValidButtonVariant(this.variant)) {
      console.warn(
        `ButtonGroupComponent: Invalid variant "${this.variant}". Expected one of: solid, outline, clear.`
      );
      this.variant = BUTTON.DEFAULT_VARIANT;
    }
  }

  /**
   * TrackBy function for *ngFor optimization
   * Improves rendering performance for large button lists
   * @param index - Item index
   * @param button - Button config
   * @returns Unique identifier for the button
   */
  trackByAction(index: number, button: IButtonConfig): string {
    return button.action;
  }
}
