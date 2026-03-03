/**
 * Stats Grid Component
 *
 * @component
 * Responsive statistics grid display
 * Shows key metrics in a flexible grid layout
 *
 * @example
 * ```html
 * <app-stats-grid
 *   [stats]="[
 *     { label: 'Solved', value: 42, icon: 'checkmark-circle' },
 *     { label: 'Streak', value: 7, icon: 'flame' },
 *     { label: 'Score', value: '2,150', icon: 'trophy' }
 *   ]"
 *   [columns]="3"
 *   [centered]="true"
 *   size="medium">
 * </app-stats-grid>
 * ```
 *
 * @used-in Results, Achievements, Stats pages
 */

import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IStatItem, StatsGridColumnsType } from '../types';
import { isValidStatArray, isValidStatsGridColumns } from '../type-guards';
import { STATS_GRID } from '../component-config';

@Component({
  selector: 'app-stats-grid',
  templateUrl: './stats-grid.component.html',
  styleUrls: ['./stats-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsGridComponent implements OnInit {
  /**
   * Array of statistics to display
   * Each item must have label and value
   * @type {IStatItem[]}
   * @required
   */
  @Input() stats: IStatItem[] = [];

  /**
   * Number of grid columns
   * Responsive: 1 column on mobile, adjusts on tablets/desktop
   * - 1: Single column (full width)
   * - 2: Two columns
   * - 3: Three columns
   * @type {StatsGridColumnsType}
   * @default 3
   */
  @Input() columns: StatsGridColumnsType = STATS_GRID.DEFAULT_COLUMNS;

  /**
   * Display divider lines between items
   * Visual separation of stats
   * @type {boolean}
   * @default true
   */
  @Input() showDividers: boolean = true;

  /**
   * Center align text content
   * @type {boolean}
   * @default true
   */
  @Input() centered: boolean = true;

  /**
   * Stats item size
   * Affects padding and font sizes
   * @type {'small' | 'medium' | 'large'}
   * @default 'medium'
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Validates inputs on component initialization
   */
  ngOnInit(): void {
    this.validateInputs();
  }

  /**
   * Validates component inputs for correct types and values
   * @private
   */
  private validateInputs(): void {
    // Validate stats array
    if (!isValidStatArray(this.stats)) {
      console.warn(
        'StatsGridComponent: Invalid stats array. Expected array of valid stat items.',
        this.stats
      );
    }

    // Validate columns
    if (!isValidStatsGridColumns(this.columns)) {
      console.warn(
        `StatsGridComponent: Invalid columns value "${this.columns}". Expected 1, 2, or 3.`
      );
      this.columns = STATS_GRID.DEFAULT_COLUMNS;
    }
  }

  /**
   * TrackBy function for *ngFor optimization
   * @param index - Item index
   * @param stat - Stat item
   * @returns Unique identifier for the stat
   */
  trackByLabel(index: number, stat: IStatItem): string {
    return stat.label;
  }
}
