# Quick Integration Guide - Component Usage

## 🚀 Getting Started in 5 Minutes

### Step 1: Import SharedModule

```typescript
// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SHARED_COMPONENTS } from './components';

@NgModule({
  declarations: [SHARED_COMPONENTS],
  imports: [CommonModule, IonicModule],
  exports: [SHARED_COMPONENTS, CommonModule, IonicModule]
})
export class SharedModule { }
```

### Step 2: Import in Your Page Module

```typescript
// home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule  // ← Add this
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
```

---

## 📋 Copy-Paste Examples

### Example 1: Using HeaderComponent

```html
<!-- Simple header -->
<app-header
  title="Welcome Back"
  [username]="currentUser"
  gradientClass="purple-blue">
</app-header>

<!-- With trophy button -->
<app-header
  title="Challenge #5"
  [username]="currentUser"
  gradientClass="green"
  [showTrophy]="true"
  [hideSubtitle]="false">
</app-header>

<!-- Different gradient -->
<app-header
  title="Your Results"
  [username]="currentUser"
  gradientClass="orange">
</app-header>
```

---

### Example 2: Using CardComponent

```html
<!-- Simple card -->
<app-card
  title="Challenge"
  subtitle="Easy">
  <p>Challenge description here</p>
</app-card>

<!-- Gradient card with icon -->
<app-card
  title="Daily Puzzle"
  subtitle="Locked"
  variant="gradient"
  icon="lock"
  size="medium">
  <p>Complete tomorrow to unlock</p>
</app-card>

<!-- Clickable card for action -->
<app-card
  title="Complete Challenge"
  variant="success"
  [isClickable]="true"
  (cardClick)="openChallenge()">
  <p>Tap to start</p>
</app-card>

<!-- Multiple cards in loop -->
<ion-list>
  <app-card
    *ngFor="let challenge of challenges"
    [title]="challenge.name"
    [subtitle]="challenge.difficulty"
    [icon]="challenge.icon"
    [variant]="challenge.completed ? 'success' : 'default'"
    [isClickable]="true"
    (cardClick)="openChallenge(challenge.id)">
  </app-card>
</ion-list>
```

---

### Example 3: Using StatsGridComponent

```typescript
// In your component.ts
export class ResultsPage {
  stats = [
    { label: 'Correct', value: '8/10', icon: 'checkmark-circle', color: '#10b981' },
    { label: 'Time', value: '2:45', icon: 'timer', color: '#3b82f6' },
    { label: 'XP Earned', value: '+250', icon: 'star', color: '#f59e0b' }
  ];
}
```

```html
<!-- In your component.html -->
<!-- Desktop: 3 columns -->
<app-stats-grid
  [stats]="stats"
  [columns]="3"
  [size]="'medium'"
  [showDividers]="true">
</app-stats-grid>

<!-- Mobile: 2 columns -->
<app-stats-grid
  [stats]="stats"
  [columns]="2"
  [size]="'small'">
</app-stats-grid>

<!-- Single column for detail view -->
<app-stats-grid
  [stats]="stats"
  [columns]="1"
  [centered]="true">
</app-stats-grid>
```

---

### Example 4: Using ProgressBarComponent

```html
<!-- Basic progress -->
<app-progress-bar
  [value]="75"
  size="medium"
  color="primary"
  [showLabel]="true"
  label="Challenge Progress">
</app-progress-bar>

<!-- Animated progress -->
<app-progress-bar
  [value]="progress"
  size="large"
  color="success"
  [animated]="true"
  [striped]="true"
  label="Time Used">
</app-progress-bar>

<!-- Custom color -->
<app-progress-bar
  [value]="difficulty"
  size="small"
  color="custom"
  customColor="#8b5cf6"
  label="Difficulty">
</app-progress-bar>

<!-- Multiple bars for different metrics -->
<div class="metrics">
  <app-progress-bar
    [value]="accuracy"
    color="success"
    label="Accuracy">
  </app-progress-bar>
  <app-progress-bar
    [value]="speed"
    color="primary"
    label="Speed">
  </app-progress-bar>
  <app-progress-bar
    [value]="difficulty"
    color="warning"
    label="Difficulty">
  </app-progress-bar>
</div>
```

---

### Example 5: Using OptionButtonComponent

```typescript
// In your component.ts
export class ChallengePage {
  question = {
    text: "What is 2 + 2?",
    options: [
      { text: "2", index: 0 },
      { text: "3", index: 1 },
      { text: "4", index: 2 },
      { text: "5", index: 3 }
    ],
    correct: 2
  };

  selectedOption: number | null = null;
  optionStates: { [key: number]: OptionState } = {};

  selectOption(index: number) {
    if (this.selectedOption === null) {
      this.selectedOption = index;
      this.optionStates[index] = 'selected';
    }
  }

  revealAnswer() {
    this.optionStates[this.question.correct] = 'correct';
    if (this.selectedOption !== this.question.correct) {
      this.optionStates[this.selectedOption!] = 'incorrect';
    }
  }
}
```

```html
<!-- In your component.html -->
<div class="question-container">
  <h2>{{ question.text }}</h2>
  
  <div class="options">
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

  <ion-button
    *ngIf="selectedOption !== null"
    (click)="revealAnswer()"
    color="primary"
    expand="block">
    Show Answer
  </ion-button>
</div>
```

---

### Example 6: Using ButtonGroupComponent

```typescript
// In your component.ts
export class ResultsPage {
  actionButtons = [
    { label: 'Retry', action: 'retry', color: 'warning', icon: 'reload' },
    { label: 'Next Challenge', action: 'next', color: 'success', icon: 'arrow-forward' },
    { label: 'Home', action: 'home', color: 'medium', icon: 'home' }
  ];

  handleAction(action: string) {
    switch(action) {
      case 'retry':
        this.retryChallenge();
        break;
      case 'next':
        this.goToNextChallenge();
        break;
      case 'home':
        this.goHome();
        break;
    }
  }

  retryChallenge() { /* ... */ }
  goToNextChallenge() { /* ... */ }
  goHome() { /* ... */ }
}
```

```html
<!-- In your component.html -->

<!-- Horizontal buttons (default) -->
<app-button-group
  [buttons]="actionButtons"
  layout="horizontal"
  size="medium"
  variant="solid"
  (buttonClick)="handleAction($event)">
</app-button-group>

<!-- Vertical stack for mobile -->
<app-button-group
  [buttons]="actionButtons"
  layout="vertical"
  size="large"
  variant="outline"
  (buttonClick)="handleAction($event)">
</app-button-group>

<!-- Grid layout -->
<app-button-group
  [buttons]="actionButtons"
  layout="grid"
  size="medium"
  (buttonClick)="handleAction($event)">
</app-button-group>
```

---

## 🎯 Common Patterns

### Pattern 1: Header + Content Card + Action Buttons

```html
<ion-content>
  <!-- Header Section -->
  <app-header
    title="Challenge Complete!"
    [username]="user"
    gradientClass="orange">
  </app-header>

  <!-- Content -->
  <app-card
    title="Results"
    variant="default"
    size="medium">
    <p>You scored 8/10</p>
  </app-card>

  <!-- Actions -->
  <app-button-group
    [buttons]="[
      { label: 'Retry', action: 'retry', color: 'warning' },
      { label: 'Next', action: 'next', color: 'success' }
    ]"
    layout="vertical"
    (buttonClick)="onAction($event)">
  </app-button-group>
</ion-content>
```

### Pattern 2: Header + Stats Grid

```html
<ion-content>
  <app-header
    title="Your Achievements"
    [username]="user"
    gradientClass="green">
  </app-header>

  <app-stats-grid
    [stats]="achievements"
    [columns]="3"
    [showDividers]="true"
    [centered]="true">
  </app-stats-grid>
</ion-content>
```

### Pattern 3: Challenge with Progress

```html
<ion-content>
  <app-header
    title="Challenge #5"
    gradientClass="purple-blue">
  </app-header>

  <app-progress-bar
    [value]="questionNumber / totalQuestions * 100"
    size="medium"
    color="primary"
    [animated]="true"
    label="Progress">
  </app-progress-bar>

  <app-card
    [title]="question.text"
    variant="default"
    size="large">
  </app-card>

  <div class="options">
    <app-option-button
      *ngFor="let option of question.options"
      [text]="option.text"
      [index]="option.index"
      [state]="optionStates[option.index] || 'default'"
      size="large"
      (selected)="selectOption($event)">
    </app-option-button>
  </div>
</ion-content>
```

---

## ✅ Validation Checklist

After integrating components:

- [ ] Import SharedModule in your page module
- [ ] Components display correctly
- [ ] Responsive behavior works (test on mobile/tablet)
- [ ] Click handlers work (@Output events)
- [ ] Styling matches design
- [ ] No console errors
- [ ] Page loads quickly
- [ ] Variants display correctly

---

## 🆘 Troubleshooting

### Components not displaying?
```typescript
// Make sure SharedModule is imported in your page module
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [SharedModule] // ← Required
})
```

### Styling looks wrong?
```html
<!-- Check variant names are correct -->
<app-card variant="gradient"> ✅ Correct
<app-card variant="gradent">  ❌ Typo
```

### @Output not working?
```typescript
// Make sure to handle the event
<app-button-group
  (buttonClick)="onButtonClick($event)"> ✅ Correct
  (clicked)="onClicked()">                ❌ Wrong event name
```

### Responsive not working?
- Check breakpoints: 480px (mobile), 768px (tablet)
- Inspect element in DevTools
- Verify [columns] is properly bound
- Check media queries in SCSS

---

## 📚 Reference

For detailed documentation, see:
- **COMPONENT_ARCHITECTURE.md** - Complete API reference
- **COMPONENT_LIBRARY_SUMMARY.md** - Quick stats and overview

For specific component help:
- **HeaderComponent**: Gradient variants, authentication display
- **CardComponent**: Content containers, variant combinations
- **StatsGridComponent**: Data display, responsive grids
- **ButtonGroupComponent**: Action collections, layout options
- **ProgressBarComponent**: Visual progress, animations
- **OptionButtonComponent**: Interactive selections, state feedback

---

Good luck! Your component library is ready to use. 🎉
