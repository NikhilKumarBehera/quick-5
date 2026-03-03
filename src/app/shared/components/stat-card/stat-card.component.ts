import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

/**
 * Reusable Stat Card Component
 * 
 * Displays a statistic with icon, label, value, and optional change indicator
 * 
 * @example
 * <app-stat-card
 *   icon="trophy"
 *   label="Total Solved"
 *   value="248"
 *   change="+12"
 *   changeType="positive"
 *   color="primary">
 * </app-stat-card>
 */
@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class StatCardComponent {
  @Input() icon: string = 'stats-chart';
  @Input() label: string = '';
  @Input() value: string | number = '0';
  @Input() change?: string;
  @Input() changeType?: 'positive' | 'negative';
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
