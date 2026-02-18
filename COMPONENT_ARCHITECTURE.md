# Component Architecture Guide

This guide documents all reusable components in the `/src/app/shared/components` directory and shows how to integrate them into existing pages.

## Overview

The component library is organized to promote:
- **Code Reusability**: Use components across multiple pages
- **Consistent Design**: Unified styling and variants
- **Easy Maintenance**: Centralized component logic
- **Flexible Configuration**: Input/Output based component communication

## Components Overview

### 1. HeaderComponent
**Purpose**: Reusable gradient header with streak card and action button

**Location**: `/src/app/shared/components/header/`

**Inputs**:
- `title: string` - Main heading text
- `username: string` - User name for subtitle
- `subtitle: string` - Optional subtitle text
- `hideSubtitle: boolean` - Toggle subtitle visibility (default: false)
- `showTrophy: boolean` - Show trophy/streak button (default: true)
- `gradientClass: string` - Gradient variant: 'purple-blue' | 'green' | 'orange' | 'pink' (default: 'purple-blue')
- `rightIcon?: string` - Optional ion-icon name for right side

**Outputs**: None

**Usage Example**:
```html
<app-header
  title="Challenge #5"
  [username]="currentUser"
  [showTrophy]="true"
  gradientClass="purple-blue"
  rightIcon="settings-sharp">
</app-header>
```

**Variants**:
- Purple-Blue: `gradientClass="purple-blue"` - Primary gradient
- Green: `gradientClass="green"` - Success/correct theme
- Orange: `gradientClass="orange"` - Warning theme
- Pink: `gradientClass="pink"` - Highlight theme

**Use Cases**:
- Home page header
- Challenge page header
- Results page header
- Any page needing branded header

---

### 2. CardComponent
**Purpose**: Versatile card container with multiple styling variants

**Location**: `/src/app/shared/components/card/`

**Inputs**:
- `title: string` - Card heading
- `subtitle?: string` - Optional subtext
- `variant: string` - Style variant: 'default' | 'gradient' | 'success' | 'warning' | 'error' (default: 'default')
- `icon?: string` - Ion-icon name to display in header
- `iconPosition: string` - Icon placement: 'start' | 'end' (default: 'start')
- `size: string` - Card size: 'small' | 'medium' | 'large' (default: 'medium')
- `hasShadow: boolean` - Add drop shadow (default: true)
- `isClickable: boolean` - Add hover animation (default: false)

**Outputs**:
- `cardClick: EventEmitter<void>` - Emits when card clicked

**Usage Example**:
```html
<app-card
  title="Puzzle #3"
  subtitle="Difficulty: Hard"
  variant="gradient"
  icon="puzzle"
  size="medium"
  [hasShadow]="true"
  [isClickable]="true"
  (cardClick)="openChallenge(3)">
  <p>Challenge content goes here...</p>
</app-card>
```

**Variants**:
- Default: Light background with subtle border
- Gradient: Colored gradient background
- Success: Green theme (correct, completed)
- Warning: Orange theme (in progress, attention)
- Error: Red theme (failed, incomplete)

**Sizes**:
- Small: Compact card (padding: 12px)
- Medium: Standard card (padding: 16px)
- Large: Expanded card (padding: 20px)

**Use Cases**:
- Challenge list items
- Stats containers
- Achievement cards
- Content containers
- Result cards

---

### 3. StatsGridComponent
**Purpose**: Flexible grid for displaying statistics with icons

**Location**: `/src/app/shared/components/stats-grid/`

**Inputs**:
- `stats: StatItem[]` - Array of statistics to display
  - `label: string` - Stat label
  - `value: string` - Stat value/number
  - `icon: string` - Ion-icon name
  - `color: string` - Icon color (e.g., '#10b981')
- `columns: number` - Grid columns: 1 | 2 | 3 (default: 3)
- `showDividers: boolean` - Show dividing lines (default: false)
- `centered: boolean` - Center align text (default: true)
- `size: string` - Text size: 'small' | 'medium' | 'large' (default: 'medium')

**Outputs**: None

**Usage Example**:
```typescript
// In component.ts
stats = [
  { label: 'Correct', value: '8/10', icon: 'checkmark-circle', color: '#10b981' },
  { label: 'Time', value: '2:45', icon: 'timer', color: '#3b82f6' },
  { label: 'XP', value: '+250', icon: 'star', color: '#f59e0b' }
];
```

```html
<!-- In component.html -->
<app-stats-grid
  [stats]="stats"
  [columns]="3"
  [size]="'medium'"
  [showDividers]="true">
</app-stats-grid>
```

**Responsive Behavior**:
- 3 columns on desktop (768px+)
- 2 columns on tablet (480px - 768px)
- 1 column on mobile (< 480px)

**Use Cases**:
- Results page stats display
- Achievements summary
- User statistics dashboard
- Performance metrics

---

### 4. ButtonGroupComponent
**Purpose**: Configurable group of buttons with layout options

**Location**: `/src/app/shared/components/button-group/`

**Inputs**:
- `buttons: ButtonConfig[]` - Array of button configurations
  - `label: string` - Button text
  - `action: string` - Action identifier (emitted on click)
  - `color: string` - Button color
  - `icon?: string` - Ion-icon name
  - `disabled: boolean` - Button disabled state
- `layout: string` - Button arrangement: 'horizontal' | 'vertical' | 'grid' (default: 'horizontal')
- `size: string` - Button size: 'small' | 'medium' | 'large' (default: 'medium')
- `expand: boolean` - Full width buttons (default: true)
- `variant: string` - Style variant: 'solid' | 'outline' | 'clear' (default: 'solid')

**Outputs**:
- `buttonClick: EventEmitter<string>` - Emits action string on button click

**Usage Example**:
```typescript
// In component.ts
actionButtons = [
  { label: 'Retry', action: 'retry', color: 'primary', icon: 'reload' },
  { label: 'Next', action: 'next', color: 'success' },
  { label: 'Home', action: 'home', color: 'medium' }
];

onButtonClick(action: string) {
  switch(action) {
    case 'retry': this.retryChallenge(); break;
    case 'next': this.goToNext(); break;
    case 'home': this.goHome(); break;
  }
}
```

```html
<!-- In component.html -->
<app-button-group
  [buttons]="actionButtons"
  layout="horizontal"
  size="medium"
  variant="solid"
  (buttonClick)="onButtonClick($event)">
</app-button-group>
```

**Layouts**:
- Horizontal: Buttons in a row (wraps on mobile)
- Vertical: Buttons in a column
- Grid: 2-column grid (1 column on mobile)

**Use Cases**:
- Action buttons (Retry, Next, Home)
- Navigation options
- Result page buttons
- Challenge options
- Confirmation dialogs

---

### 5. ProgressBarComponent
**Purpose**: Visual progress indicator with animations

**Location**: `/src/app/shared/components/progress-bar/`

**Inputs**:
- `value: number` - Progress value (0-100)
- `size: string` - Bar height: 'small' | 'medium' | 'large' (default: 'medium')
- `color: string` - Color theme: 'primary' | 'success' | 'warning' | 'danger' | 'custom' (default: 'primary')
- `animated: boolean` - Add shimmer animation (default: false)
- `striped: boolean` - Add stripe pattern (default: false)
- `showLabel: boolean` - Show percentage label (default: true)
- `customColor?: string` - Custom hex color (when color='custom')
- `label?: string` - Custom label text

**Outputs**: None

**Usage Example**:
```html
<!-- Basic usage -->
<app-progress-bar
  [value]="75"
  size="medium"
  color="success"
  [animated]="true"
  label="Completion">
</app-progress-bar>

<!-- Custom color with animation -->
<app-progress-bar
  [value]="progress"
  size="large"
  color="custom"
  customColor="#667eea"
  [striped]="true"
  [animated]="true"
  label="Challenge Progress">
</app-progress-bar>
```

**Features**:
- Smooth width transitions (0.6s)
- Gradient backgrounds per color
- Optional shimmer animation
- Optional stripe pattern
- Responsive sizing

**Use Cases**:
- Challenge progress bars
- Time remaining indicators
- Difficulty meters
- Loading indicators
- Completion percentages

---

### 6. OptionButtonComponent
**Purpose**: Interactive button for challenge options with state indication

**Location**: `/src/app/shared/components/option-button/`

**Inputs**:
- `text: string` - Option text/label
- `icon?: string` - Ion-icon name
- `state: OptionState` - Current state: 'default' | 'selected' | 'correct' | 'incorrect' (default: 'default')
- `disabled: boolean` - Disable option (default: false)
- `index?: number` - Option index identifier
- `size: string` - Button size: 'small' | 'medium' | 'large' (default: 'medium')

**Outputs**:
- `selected: EventEmitter<number>` - Emits option index when selected
- `stateChanged: EventEmitter<OptionState>` - Emits new state

**Usage Example**:
```typescript
// In component.ts
currentQuestion = {
  question: "What is 2 + 2?",
  options: [
    { text: "3", index: 0 },
    { text: "4", index: 1 },
    { text: "5", index: 2 }
  ]
};

selectedOption: number | null = null;
optionStates: { [key: number]: OptionState } = {};

selectOption(index: number) {
  this.selectedOption = index;
  this.optionStates[index] = 'selected';
}

revealAnswer(correctIndex: number) {
  this.optionStates[correctIndex] = 'correct';
  if (this.selectedOption !== correctIndex) {
    this.optionStates[this.selectedOption] = 'incorrect';
  }
}
```

```html
<!-- In component.html -->
<div class="options-container">
  <app-option-button
    *ngFor="let option of currentQuestion.options"
    [text]="option.text"
    [index]="option.index"
    [state]="optionStates[option.index] || 'default'"
    [disabled]="optionStates[option.index] ? true : false"
    (selected)="selectOption($event)">
  </app-option-button>
</div>
```

**States**:
- Default: Unselected option
- Selected: User clicked option
- Correct: Correct answer (green)
- Incorrect: Wrong answer (red)

**Use Cases**:
- Challenge multiple-choice questions
- Quiz options
- Answer selection with feedback
- Interactive questions

---

## Page Integration Examples

### Home Page Refactoring

**Before**: 1,045 lines of SCSS + mixed HTML/TS logic

**After**: Using reusable components

```typescript
// home.component.ts
import { HeaderComponent, CardComponent, ProgressBarComponent, StatsGridComponent } from '@app/shared/components';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  currentUser = 'Alex Johnson';
  challenges = [
    { title: 'Puzzle #1', subtitle: 'Easy', icon: 'puzzle', completed: true },
    { title: 'Puzzle #2', subtitle: 'Medium', icon: 'puzzle', completed: false }
  ];

  stats = [
    { label: 'Completed', value: '12', icon: 'checkmark-circle', color: '#10b981' },
    { label: 'Streak', value: '5 Days', icon: 'flame', color: '#f59e0b' },
    { label: 'XP Total', value: '1,240', icon: 'star', color: '#667eea' }
  ];

  openChallenge(id: string) {
    // Navigate to challenge
  }
}
```

```html
<!-- home.page.html -->
<ion-content>
  <!-- Header -->
  <app-header
    title="Welcome Back!"
    [username]="currentUser"
    gradientClass="purple-blue"
    [showTrophy]="true">
  </app-header>

  <!-- Quick Stats -->
  <app-stats-grid
    [stats]="stats"
    [columns]="3"
    [showDividers]="true">
  </app-stats-grid>

  <!-- Active Challenges -->
  <div class="section">
    <h2>Your Challenges</h2>
    <app-card
      *ngFor="let challenge of challenges"
      [title]="challenge.title"
      [subtitle]="challenge.subtitle"
      [icon]="challenge.icon"
      variant="gradient"
      [isClickable]="true"
      (cardClick)="openChallenge(challenge.id)">
      <app-progress-bar
        [value]="challenge.progress"
        size="small"
        color="success"
        [animated]="true">
      </app-progress-bar>
    </app-card>
  </div>
</ion-content>
```

**CSS Reduction**: From 1,045 lines → ~200 lines (component SCSS reuse)

---

### Challenge Page Refactoring

```typescript
// challenge.component.ts
export class ChallengePage {
  question = {
    text: "What is the capital of France?",
    options: [
      { text: "London", index: 0 },
      { text: "Paris", index: 1 },
      { text: "Berlin", index: 2 }
    ]
  };

  selectedOption: number | null = null;
  optionStates: { [key: number]: OptionState } = {};

  selectOption(index: number) {
    this.selectedOption = index;
    this.optionStates[index] = 'selected';
  }

  submitAnswer() {
    // Validate and reveal correct answer
    const correctIndex = 1;
    this.optionStates[correctIndex] = 'correct';
    if (this.selectedOption !== correctIndex) {
      this.optionStates[this.selectedOption] = 'incorrect';
    }
  }
}
```

```html
<!-- challenge.page.html -->
<ion-content>
  <app-header
    title="Challenge #5"
    gradientClass="green"
    [showTrophy]="false">
  </app-header>

  <!-- Progress -->
  <app-progress-bar
    [value]="75"
    size="medium"
    color="primary"
    label="Challenge Progress"
    [animated]="true">
  </app-progress-bar>

  <!-- Question -->
  <app-card
    [title]="question.text"
    variant="default"
    size="large">
  </app-card>

  <!-- Options -->
  <div class="options-section">
    <app-option-button
      *ngFor="let option of question.options"
      [text]="option.text"
      [index]="option.index"
      [state]="optionStates[option.index] || 'default'"
      [disabled]="selectedOption !== null"
      size="large"
      (selected)="selectOption($event)">
    </app-option-button>
  </div>

  <!-- Submit Button -->
  <app-button-group
    [buttons]="[
      { label: 'Submit', action: 'submit', color: 'primary' }
    ]"
    layout="horizontal"
    (buttonClick)="submitAnswer()">
  </app-button-group>
</ion-content>
```

---

### Results Page Refactoring

```html
<!-- results.page.html -->
<ion-content>
  <app-header
    title="Challenge Complete!"
    gradientClass="orange"
    [showTrophy]="true">
  </app-header>

  <!-- Performance Stats -->
  <app-stats-grid
    [stats]="[
      { label: 'Score', value: '8/10', icon: 'calculator', color: '#667eea' },
      { label: 'Time', value: '2:45', icon: 'timer', color: '#3b82f6' },
      { label: 'XP Earned', value: '+250', icon: 'star', color: '#f59e0b' }
    ]"
    [columns]="3"
    [size]="'large'">
  </app-stats-grid>

  <!-- Action Buttons -->
  <app-button-group
    [buttons]="[
      { label: 'Retry', action: 'retry', color: 'warning', icon: 'reload' },
      { label: 'Next', action: 'next', color: 'success' },
      { label: 'Home', action: 'home', color: 'medium' }
    ]"
    layout="vertical"
    size="large"
    (buttonClick)="handleAction($event)">
  </app-button-group>
</ion-content>
```

---

## Migration Checklist

### Step 1: Import Components
```typescript
// In shared.module.ts or feature module
import { SHARED_COMPONENTS } from '@app/shared/components';

@NgModule({
  declarations: [SHARED_COMPONENTS],
  exports: [SHARED_COMPONENTS]
})
export class SharedModule { }
```

### Step 2: Identify Patterns
- [ ] Find all header sections → Use `HeaderComponent`
- [ ] Find all card containers → Use `CardComponent`
- [ ] Find all progress bars → Use `ProgressBarComponent`
- [ ] Find all option/choice buttons → Use `OptionButtonComponent`
- [ ] Find all button groups → Use `ButtonGroupComponent`
- [ ] Find all stats grids → Use `StatsGridComponent`

### Step 3: Replace HTML
- [ ] Replace header HTML with `<app-header>`
- [ ] Replace card divs with `<app-card>`
- [ ] Move card content to ng-content slot

### Step 4: Update TypeScript
- [ ] Move styling logic to component @Input
- [ ] Move click handlers to component @Output
- [ ] Remove inline styles

### Step 5: Clean Up SCSS
- [ ] Remove component-specific SCSS
- [ ] Keep only page-level spacing/layout SCSS
- [ ] Target reduction: 50-70% SCSS reduction per page

### Step 6: Test
- [ ] Verify all components display correctly
- [ ] Test responsive behavior
- [ ] Test click/interaction handlers
- [ ] Run unit tests

---

## Best Practices

### 1. Use Components Over Custom HTML
❌ **Don't**: Create custom header divs
✅ **Do**: Use `<app-header>` component

### 2. Use Variants Instead of Custom CSS
❌ **Don't**: Create custom gradient colors
✅ **Do**: Use `gradientClass="pink"` variants

### 3. Leverage ng-content for Flexibility
❌ **Don't**: Add all content via @Input
✅ **Do**: Use ng-content for complex layouts

### 4. Use Barrel Exports
```typescript
// ✅ Good
import { HeaderComponent, CardComponent } from '@app/shared/components';

// ❌ Avoid
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { CardComponent } from '@app/shared/components/card/card.component';
```

### 5. Document Custom Implementations
If you need a variant not in the library, document it and consider adding it:
```typescript
// Example: Adding a new gradient variant
// 1. Add to header.component.scss
// 2. Update gradient documentation
// 3. Push update for team reuse
```

---

## File Structure

```
src/app/shared/components/
├── header/
│   ├── header.component.ts
│   ├── header.component.html
│   └── header.component.scss
├── card/
│   ├── card.component.ts
│   ├── card.component.html
│   └── card.component.scss
├── stats-grid/
│   ├── stats-grid.component.ts
│   ├── stats-grid.component.html
│   └── stats-grid.component.scss
├── button-group/
│   ├── button-group.component.ts
│   ├── button-group.component.html
│   └── button-group.component.scss
├── progress-bar/
│   ├── progress-bar.component.ts
│   ├── progress-bar.component.html
│   └── progress-bar.component.scss
├── option-button/
│   ├── option-button.component.ts
│   ├── option-button.component.html
│   └── option-button.component.scss
└── index.ts (barrel export)
```

---

## Questions & Support

For questions about:
- **Component Usage**: Check usage examples in this guide
- **Adding New Variants**: Update component @Input + SCSS
- **Styling Issues**: Check responsive breakpoints (480px, 768px)
- **Integration Issues**: Review page refactoring examples

---

## Summary

This component library eliminates code duplication and establishes a consistent design system across the application. By using these 6 core components, you can:

- **Reduce SCSS** by 60-70% through reuse
- **Improve Maintainability** with centralized component logic
- **Ensure Consistency** through unified styling
- **Accelerate Development** by composing pages from components
- **Enable Easy Updates** across entire app from component changes

**Total Components Created**: 6
**Estimated SCSS Reduction**: 60-70%
**Estimated Development Time Saved**: 30-40% per page refactor
