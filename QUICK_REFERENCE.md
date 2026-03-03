# Quick Reference Guide

## Essential Commands

```bash
# Development
npm start              # Start dev server
ionic serve          # Ionic with live reload
npm test             # Run tests
npm run lint         # Check code quality

# Building
npm run build        # Development build
npm run build:prod   # Production build
npm run build:ios    # Build for iOS
npm run build:android # Build for Android

# Mobile Testing
npm run build:ios && npx cap open ios
npm run build:android && npx cap open android
ionic serve --external  # Network live reload
```

## Project Structure Quick Look

```
src/app/
├── core/models/          👈 Data models (Puzzle, User, etc.)
├── shared/constants/     👈 App configuration & constants
├── shared/styles/        👈 SCSS variables, mixins, utilities
├── shared/components/    👈 Reusable UI components
├── features/             👈 Feature modules (lazy-loaded)
├── services/             👈 Business logic
└── app-routing.module.ts 👈 Main routing configuration
```

## Common Imports

```typescript
// Models & Interfaces
import { Puzzle, DifficultyLevel, PuzzleCategory } from '@core/models';
import { UserProfile, UserStatistics } from '@core/models';

// Constants
import { APP_CONFIG, ROUTES, GAME_CONFIG, STORAGE_KEYS } from '@shared/constants';

// Services
import { PuzzleService } from '@services/puzzle-service/puzzle-service';
import { StorageService } from '@services/storage-service/storage-service';

// Directives & Pipes
import { SharedModule } from '@shared/shared.module';
```

## SCSS Quick Reference

### Colors
```scss
$color-primary      // Blue: #667eea
$color-secondary    // Red: #f5576c
$color-success      // Cyan: #30cfd0
$color-warning      // Pink: #fa709a
$color-danger       // Red: #f85151
```

### Spacing (4px base)
```scss
$space-xs  // 4px   - .p-xs, .m-xs
$space-sm  // 8px   - .p-sm, .m-sm
$space-md  // 16px  - .p-md, .m-md
$space-lg  // 24px  - .p-lg, .m-lg
$space-xl  // 32px  - .p-xl, .m-xl
```

### Mixins
```scss
@include flex-center       // Center flexbox
@include flex-between      // Space-between flex
@include elevation(2)      // Box shadow
@include transition        // Smooth transition
@include text-truncate     // Ellipsis
@include respond-to($bp)   // Media query
```

### Utility Classes
```html
<!-- Flexbox -->
<div class="flex-center">Centered content</div>
<div class="flex-between">Space between</div>

<!-- Spacing -->
<div class="p-md m-lg">Padding & margin</div>
<div class="px-lg py-md">X/Y padding</div>

<!-- Text -->
<p class="text-bold text-lg">Bold large text</p>
<p class="text-primary">Primary color text</p>

<!-- Layout -->
<div class="rounded-lg shadow-md">Card style</div>
<div class="text-center">Centered text</div>
```

## Component Template

```typescript
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Puzzle } from '@core/models';
import { PuzzleService } from '@services/puzzle-service/puzzle-service';

@Component({
  selector: 'app-puzzle-card',
  templateUrl: './puzzle-card.component.html',
  styleUrls: ['./puzzle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuzzleCardComponent implements OnInit, OnDestroy {
  // Inputs & Outputs
  @Input() puzzle: Puzzle;
  @Output() selected = new EventEmitter<Puzzle>();

  // Properties
  private destroy$ = new Subject<void>();

  // Constructor with DI
  constructor(private puzzleService: PuzzleService) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    // Initialization
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public Methods
  public onCardClick(): void {
    this.selected.emit(this.puzzle);
  }

  // Private Methods
  private trackChanges(): void {
    this.puzzleService.getPuzzles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(puzzles => {
        // Handle updates
      });
  }
}
```

## Service Template

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Puzzle } from '@core/models';

@Injectable({ providedIn: 'root' })
export class PuzzleService {
  private readonly puzzles$ = new BehaviorSubject<Puzzle[]>([]);

  constructor() {
    this.loadPuzzles();
  }

  // Public API
  getPuzzles(): Observable<Puzzle[]> {
    return this.puzzles$.asObservable();
  }

  // Modifiers
  addPuzzle(puzzle: Puzzle): void {
    const current = this.puzzles$.value;
    this.puzzles$.next([...current, puzzle]);
  }

  // Private Methods
  private loadPuzzles(): void {
    // Load initial data
  }

  private handleError(error: Error): void {
    console.error('Service error:', error);
  }
}
```

## Routing

### Main Routes (`app-routing.module.ts`)
```typescript
const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { 
    path: 'splash',
    loadChildren: () => import('./features/splash/splash.module')
      .then(m => m.SplashPageModule)
  },
  { 
    path: 'home',
    loadChildren: () => import('./features/home/home.module')
      .then(m => m.HomePageModule)
  },
  // ... more routes
];
```

### Feature Navigation
```typescript
import { Router } from '@angular/router';
import { ROUTES } from '@shared/constants';

constructor(private router: Router) {}

navigate(): void {
  this.router.navigate([ROUTES.HOME], {
    state: { someData: 'value' }
  });
}
```

## Styling a Component

```scss
// component.component.scss
@import '@shared/styles/variables.scss';

.component-container {
  @include flex-column;
  padding: $space-lg;
  gap: $space-md;
}

.component-header {
  @include flex-between;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: $space-md;
}

.component-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $space-md;
}

.component-card {
  padding: $space-md;
  border-radius: $border-radius-lg;
  background: $color-white;
  @include elevation(2);
  @include transition;

  &:hover {
    @include elevation(3);
    transform: translateY(-2px);
  }

  @include respond-to($breakpoint-md) {
    padding: $space-lg;
  }
}
```

## Constants Usage

```typescript
import { APP_CONFIG, ROUTES, GAME_CONFIG, STORAGE_KEYS } from '@shared/constants';

// Configuration
const timeout = APP_CONFIG.timeout;
const dailyLimit = GAME_CONFIG.DAILY_CHALLENGES;

// Navigation
this.router.navigate([ROUTES.CHALLENGE]);

// Storage
localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

// Animation timing
const duration = ANIMATION_CONFIG.slideUpDuration;
```

## Type Safety Tips

```typescript
// ❌ Avoid: any type
const data: any = response;

// ✅ Use: Typed models
const data: Puzzle = response;

// ✅ Use: Strict typing in functions
public calculateScore(answers: UserAnswerRecord[]): number {
  return answers.filter(a => a.isCorrect).length * GAME_CONFIG.XP_PER_CORRECT_ANSWER;
}

// ✅ Use: Enums for controlled values
export enum DifficultyLevel {
  EASY = 'easy',
  HARD = 'hard',
}

const level: DifficultyLevel = DifficultyLevel.EASY;
```

## Testing Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PuzzleCardComponent', () => {
  let component: PuzzleCardComponent;
  let fixture: ComponentFixture<PuzzleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuzzleCardComponent],
      providers: [PuzzleService],
    }).compileComponents();

    fixture = TestBed.createComponent(PuzzleCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on card click', () => {
    spyOn(component.selected, 'emit');
    component.puzzle = mockPuzzle;

    component.onCardClick();

    expect(component.selected.emit).toHaveBeenCalledWith(mockPuzzle);
  });
});
```

## Environment Variables

```typescript
// Use in components
import { environment } from '@environments/environment';

if (environment.enableLogging) {
  console.log('Debug info');
}

const apiUrl = environment.apiUrl;
```

## Performance Best Practices

```typescript
// ✅ OnPush Change Detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// ✅ TrackBy in ngFor
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

trackById(index: number, item: Puzzle): string {
  return item.id;
}

// ✅ Unsubscribe from observables
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {});
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// ✅ Async pipe in templates
<div>{{ puzzle$ | async }}</div>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Import path errors | Check path aliases in `tsconfig.json` |
| Style not applying | Verify SCSS import, check class names |
| Type errors | Ensure models imported from `@core/models` |
| Constant undefined | Check `shared/constants/app.constants.ts` |
| Change detection not working | Add `OnPush` change detection |
| Memory leaks | Unsubscribe using `takeUntil(destroy$)` |

---

**Last Updated:** February 2026  
**Version:** 1.0.0
