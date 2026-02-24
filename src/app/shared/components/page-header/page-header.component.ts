import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

/**
 * Reusable Page Header Component
 * 
 * Features:
 * - Gradient background
 * - Title with optional subtitle
 * - Optional back button
 * - Optional action button
 * - Customizable gradient
 * - Glass card for stats/info
 * 
 * @example
 * <app-page-header 
 *   title="Accuracy Stats" 
 *   [showBack]="true"
 *   gradient="purple-blue">
 * </app-page-header>
 */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() showBack: boolean = false;
  @Input() showAction: boolean = false;
  @Input() actionIcon: string = 'ellipsis-horizontal';
  @Input() gradient: 'purple-blue' | 'success' | 'warning' | 'primary' = 'purple-blue';
  @Input() customGradient?: string;
  
  getGradientClass(): string {
    if (this.customGradient) {
      return 'custom-gradient';
    }
    return `gradient-${this.gradient}`;
  }

  onBackClick(): void {
    // Emit event or navigate back
    window.history.back();
  }

  onActionClick(): void {
    // Emit event for parent to handle
    console.log('Action clicked');
  }
}
