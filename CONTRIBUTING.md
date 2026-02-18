# Contributing to BrainBoost

Thank you for considering contributing to BrainBoost! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Basic knowledge of Angular and TypeScript

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/brainboost-mobile.git
cd brainboost-mobile

# Install dependencies
npm install

# Start development server
npm start

# In another terminal, run tests
npm test
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-name
```

### 2. Follow Coding Standards

#### File Naming
- **Components**: `home.page.ts`, `puzzle-card.component.ts`
- **Services**: `puzzle.service.ts`
- **Models**: `puzzle.model.ts`
- **Modules**: `home.module.ts`
- **Constants**: `app.constants.ts`

#### Code Style

**TypeScript**
```typescript
// ✅ Good - Clear naming, proper imports, organized structure
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PuzzleService } from '@services/puzzle.service';
import { Puzzle, DifficultyLevel } from '@models/puzzle.model';

@Component({
  selector: 'app-puzzle-card',
  templateUrl: './puzzle-card.component.html',
  styleUrls: ['./puzzle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuzzleCardComponent {
  @Input() puzzle: Puzzle;
  @Output() cardClicked = new EventEmitter<Puzzle>();

  constructor(private puzzleService: PuzzleService) {}

  onCardClick(): void {
    this.cardClicked.emit(this.puzzle);
  }
}

// ❌ Avoid - Unclear naming, magic strings, poor organization
export class MyComponent {
  puzzle: any;
  clicked = new EventEmitter();

  constructor(service: any) {}

  click() {
    this.clicked.emit(this.puzzle);
  }
}
```

**HTML/Templates**
```html
<!-- ✅ Good - Semantic, trackBy, safe navigation -->
<ion-list>
  <ion-item
    *ngFor="let puzzle of puzzles; trackBy: trackByPuzzleId"
    [attr.aria-label]="'Puzzle: ' + puzzle.question"
  >
    <ion-label>{{ puzzle.question }}</ion-label>
  </ion-item>
</ion-list>

<!-- ❌ Avoid - No trackBy, complex expressions -->
<ion-list>
  <ion-item *ngFor="let puzzle of puzzles">
    <ion-label>{{ puzzle.question | uppercase }}</ion-label>
  </ion-item>
</ion-list>
```

**SCSS/CSS**
```scss
// ✅ Good - Uses variables, organized, responsive
.puzzle-card {
  @include flex-column;
  padding: $space-md;
  border-radius: $border-radius-lg;
  background: $color-white;
  @include elevation(2);
  @include transition;

  &:hover {
    @include elevation(3);
  }

  @include respond-to($breakpoint-md) {
    padding: $space-lg;
  }
}

// ❌ Avoid - Magic values, poor naming, no organization
.card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3. Component Structure

Follow this order in your components:

```typescript
@Component({...})
export class MyComponent implements OnInit, OnDestroy {
  // Properties
  @Input() inputProperty: string;
  @Output() outputEvent = new EventEmitter();
  @ViewChild(ChildComponent) child: ChildComponent;

  public publicProperty: string;
  private privateProperty: string;
  private destroy$ = new Subject<void>();

  // Constructor
  constructor(private service: MyService) {}

  // Lifecycle hooks (in order)
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  public publicMethod(): void {}

  // Private methods
  private privateMethod(): void {}
}
```

### 4. Service Best Practices

```typescript
@Injectable({ providedIn: 'root' })
export class PuzzleService {
  private readonly puzzles$ = new BehaviorSubject<Puzzle[]>([]);

  constructor(private http: HttpClient) {}

  // Public API
  getPuzzles(): Observable<Puzzle[]> {
    return this.puzzles$.asObservable();
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error.message);
    return throwError(() => new Error('An error occurred'));
  }

  // Cleanup
  ngOnDestroy(): void {
    this.puzzles$.complete();
  }
}
```

### 5. Write Tests

Every new feature should include tests:

```typescript
describe('PuzzleCardComponent', () => {
  let component: PuzzleCardComponent;
  let fixture: ComponentFixture<PuzzleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuzzleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PuzzleCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when card is clicked', () => {
    spyOn(component.cardClicked, 'emit');
    const puzzle: Puzzle = { /* ... */ };
    component.puzzle = puzzle;

    component.onCardClick();

    expect(component.cardClicked.emit).toHaveBeenCalledWith(puzzle);
  });
});
```

### 6. Update Documentation

- Update ARCHITECTURE.md if changing project structure
- Update README.md for user-facing changes
- Add inline comments for complex logic
- Document public APIs with JSDoc

```typescript
/**
 * Calculates the user's XP gain for a puzzle session
 * @param correctAnswers - Number of correct answers
 * @param difficultyLevel - The difficulty level of the puzzle
 * @returns The calculated XP reward
 */
public calculateXP(correctAnswers: number, difficultyLevel: DifficultyLevel): number {
  // Implementation
}
```

## Commit Guidelines

Use conventional commits for clear history:

```
type(scope): subject

Detailed explanation of the change

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, dependencies, etc.

**Examples:**
```
feat(puzzle-service): add caching mechanism
fix(home-page): resolve memory leak in countdown timer
docs(architecture): update directory structure guide
refactor(challenge): simplify state management
test(puzzle-service): add unit tests for XP calculation
```

## Pull Request Process

1. **Update from main**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run checks locally**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Create descriptive PR**
   - Clear title following commit conventions
   - Detailed description of changes
   - Screenshots/videos for UI changes
   - Reference related issues (#123)

4. **Respond to reviews**
   - Address all feedback
   - Push updates to the same branch
   - Don't force-push (for history preservation)

5. **Merge**
   - Use squash or rebase merge as needed
   - Delete feature branch after merge

## Common Tasks

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Create necessary files following structure
# src/app/features/my-feature/
# ├── my-feature.page.ts
# ├── my-feature.page.html
# ├── my-feature.page.scss
# ├── my-feature.module.ts
# └── my-feature-routing.module.ts

# 3. Add to routing (src/app/app-routing.module.ts)
# 4. Write tests
# 5. Update documentation
# 6. Commit and push
git add .
git commit -m "feat(my-feature): add new feature"
git push origin feature/my-feature

# 7. Create PR on GitHub
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/bug-name

# 2. Make changes
# 3. Test the fix
# 4. Commit with reference to issue
git commit -m "fix(component): resolve issue with X

Fixes #456"

# 5. Push and create PR
```

### Updating Styles

- Use SCSS variables from `shared/styles/variables.scss`
- Maintain responsive design
- Test on multiple devices
- Document new utility classes

## Performance Guidelines

- Use `OnPush` change detection when possible
- Unsubscribe from observables properly
- Use `trackBy` in *ngFor loops
- Lazy load modules
- Optimize images and assets
- Monitor bundle size

## Mobile Testing

Before submitting:
```bash
# Test on simulator
npm run build:ios
npm run build:android

# Test on physical devices
ionic serve --external
```

## Questions?

- Check existing issues and documentation
- Ask in discussion forums
- Create a new issue for bugs
- Reach out to maintainers

---

Thank you for contributing! 🚀
