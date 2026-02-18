/**
 * Option Button Component
 *
 * @component
 * Interactive option button for quizzes and multiple choice questions
 * Supports different states (default, selected, correct, incorrect) with visual feedback
 *
 * @example
 * ```html
 * <app-option-button
 *   text="Option A"
 *   icon="checkmark"
 *   state="correct"
 *   [disabled]="false"
 *   [index]="0"
 *   size="medium"
 *   (selected)="onOptionSelect($event)">
 * </app-option-button>
 * ```
 *
 * @used-in Challenge page, Quiz modules
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { OptionStateType } from '../types';
import { isValidOptionState } from '../type-guards';
import { OPTION } from '../component-config';

@Component({
  selector: 'app-option-button',
  templateUrl: './option-button.component.html',
  styleUrls: ['./option-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OptionButtonComponent implements OnInit {
  /**
   * Option text/label
   * Displayed as the option choice
   * @type {string}
   * @required
   */
  @Input() text: string = '';

  /**
   * Optional icon name (Ionicons)
   * Displayed next to text
   * @type {string | undefined}
   * @default undefined
   */
  @Input() icon?: string;

  /**
   * Current state of the option
   * - 'default': Initial state (not selected)
   * - 'selected': User has selected this option
   * - 'correct': Correct answer (highlighted in green)
   * - 'incorrect': Wrong answer (highlighted in red)
   * @type {OptionStateType}
   * @default 'default'
   */
  @Input() state: OptionStateType = OPTION.DEFAULT_STATE;

  /**
   * Disable the option
   * Prevents selection and greys out button
   * @type {boolean}
   * @default false
   */
  @Input() disabled: boolean = false;

  /**
   * Index of this option
   * Used to identify which option was selected
   * @type {number | undefined}
   * @default undefined
   */
  @Input() index?: number;

  /**
   * Button size
   * Affects padding and font size
   * @type {'small' | 'medium' | 'large'}
   * @default 'medium'
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Emitted when option is clicked
   * Emits the index of the selected option
   * @type {EventEmitter<number | undefined>}
   * @event
   */
  @Output() selected = new EventEmitter<number | undefined>();

  /**
   * Emitted when state changes
   * @type {EventEmitter<OptionStateType>}
   * @event
   */
  @Output() stateChanged = new EventEmitter<OptionStateType>();

  /**
   * Validates inputs on component initialization
   */
  ngOnInit(): void {
    this.validateInputs();
  }

  /**
   * Handles option button click
   * Only emits if not disabled
   * @emits selected with option index
   */
  onClick(): void {
    if (!this.disabled) {
      this.selected.emit(this.index);
    }
  }

  /**
   * Validates component inputs for correct types and values
   * @private
   */
  private validateInputs(): void {
    // Validate state
    if (!isValidOptionState(this.state)) {
      console.warn(
        `OptionButtonComponent: Invalid state "${this.state}". ` +
        `Expected one of: ${OPTION.STATES.join(', ')}.`
      );
      this.state = OPTION.DEFAULT_STATE;
    }
  }

  /**
   * Gets CSS classes for the button
   * @returns CSS class string with state and size modifiers
   * @internal
   */
  getButtonClass(): string {
    return `option-button state-${this.state} size-${this.size}${
      this.disabled ? ' disabled' : ''
    }${this.icon ? ' has-icon' : ''}`;
  }

  /**
   * Gets the icon name for the current state
   * @returns Icon name or empty string
   * @internal
   */
  getStateIcon(): string {
    const stateIcons: Record<OptionStateType, string> = {
      default: '',
      selected: 'checkmark-circle',
      correct: 'checkmark-circle',
      incorrect: 'close-circle',
    };
    return stateIcons[this.state];
  }

  /**
   * Gets the color for the current state
   * @returns Color name
   * @internal
   */
  getStateColor(): string {
    const stateColors: Record<OptionStateType, string> = {
      default: 'medium',
      selected: 'primary',
      correct: 'success',
      incorrect: 'danger',
    };
    return stateColors[this.state];
  }
}
