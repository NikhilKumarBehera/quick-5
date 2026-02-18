// Barrel exports for all reusable components

export * from './header/header.component';
export * from './card/card.component';
export * from './stats-grid/stats-grid.component';
export * from './button-group/button-group.component';
export * from './progress-bar/progress-bar.component';
export * from './option-button/option-button.component';

// Component array for module declarations
import { HeaderComponent } from './header/header.component';
import { CardComponent } from './card/card.component';
import { StatsGridComponent } from './stats-grid/stats-grid.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { OptionButtonComponent } from './option-button/option-button.component';

export const SHARED_COMPONENTS = [
  HeaderComponent,
  CardComponent,
  StatsGridComponent,
  ButtonGroupComponent,
  ProgressBarComponent,
  OptionButtonComponent,
];
