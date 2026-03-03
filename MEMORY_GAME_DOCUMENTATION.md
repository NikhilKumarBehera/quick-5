# Memory Game Component Documentation

## Overview

The Memory Game component is a full-featured 4x4 card matching game with:
- **8 emoji pairs** (16 cards total)
- **3 difficulty levels** (Easy, Medium, Hard)
- **Comprehensive scoring system** (moves, accuracy, pairs)
- **Smooth animations** (flip, shuffle, shake, match effects)
- **Keyboard accessibility** (Tab, Enter, Space navigation)
- **Responsive design** (Works on all screen sizes)
- **Visual feedback** (Stars, ratings, animations)

## Features

### Game Mechanics
- **Card Preview**: 5/3/1.5 seconds to memorize cards (by difficulty)
- **Card Flipping**: Smooth 3D flip animation on click
- **Match Detection**: Automatic checking for matching pairs
- **Mismatch Feedback**: Shake animation + flip back
- **Match Celebration**: Pop animation + visual confirmation
- **Game Completion**: Modal with rating and statistics

### Scoring System
- **Moves**: Each pair attempt counts as one move
- **Attempts**: Total card clicks
- **Accuracy**: Percentage of correct matches (Matched Pairs × 2 / Total Attempts)
- **Pairs Matched**: Count of successfully matched pairs
- **Star Rating**: 1-3 stars based on accuracy
  - ⭐ 70%+ accuracy
  - ⭐⭐ 85%+ accuracy
  - ⭐⭐⭐ 95%+ accuracy

### Difficulty Levels

| Level | Preview | Flip Speed | Shuffle | Use Case |
|-------|---------|-----------|---------|----------|
| Easy | 5 seconds | 400ms | Slow | Children, learning |
| Medium | 3 seconds | 300ms | Normal | General players |
| Hard | 1.5 seconds | 200ms | Fast | Challenge mode |

### Animations
- **Slide Down**: Header entrance
- **Fade In**: Game board appearance
- **Card Flip**: 3D rotation (180°)
- **Shake**: Mismatch feedback
- **Pop**: Match confirmation
- **Bounce**: Timer pulsing
- **Slide Up**: Completion modal
- **Star Pop**: Rating animation

## Component API

### Inputs

```typescript
/**
 * Game difficulty level
 * @type {'easy' | 'medium' | 'hard'}
 * @default 'medium'
 */
@Input() difficulty: 'easy' | 'medium' | 'hard' = 'medium';

/**
 * Show hint system
 * @type {boolean}
 * @default false
 */
@Input() showHints: boolean = false;

/**
 * Enable sound effects
 * @type {boolean}
 * @default true
 */
@Input() enableSounds: boolean = true;
```

### Outputs

```typescript
/**
 * Emitted when game is completed
 * @event gameComplete
 * @payload {GameScore}
 */
@Output() gameComplete = new EventEmitter<GameScore>();

/**
 * Emitted when score updates
 * @event scoreUpdate
 * @payload {GameScore}
 */
@Output() scoreUpdate = new EventEmitter<GameScore>();
```

### GameScore Interface

```typescript
interface GameScore {
  matched: number;      // Number of matched pairs
  attempts: number;     // Total card clicks
  totalCards: number;   // Always 16
  percentage: number;   // Match percentage (0-100)
  moves: number;        // Number of pair attempts
}
```

## Usage Examples

### Basic Usage

```html
<app-memory-game
  [difficulty]="'medium'"
  (gameComplete)="onGameComplete($event)"
  (scoreUpdate)="onScoreUpdate($event)">
</app-memory-game>
```

### With All Options

```html
<app-memory-game
  [difficulty]="selectedDifficulty"
  [showHints]="true"
  [enableSounds]="true"
  (gameComplete)="handleGameComplete($event)"
  (scoreUpdate)="updateScore($event)">
</app-memory-game>
```

### TypeScript Integration

```typescript
import { GameScore } from '@shared/components';

export class GamePage {
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  currentScore: GameScore | null = null;

  onGameComplete(score: GameScore): void {
    console.log('Game Score:', {
      moves: score.moves,
      accuracy: score.percentage,
      pairs: score.matched
    });

    // Send to backend
    this.gameService.submitScore(score).subscribe(
      response => console.log('Score saved', response)
    );
  }

  onScoreUpdate(score: GameScore): void {
    this.currentScore = score;
    // Update UI with current stats
  }
}
```

## Game States

### 1. Initializing
- Component loads
- Cards are shuffled
- Game prepares to start

### 2. Showing
- All cards are flipped (emojis visible)
- Timer counts down
- Player memorizes positions
- Click is disabled

### 3. Playing
- Cards are flipped face down
- Player can click to reveal
- Click is enabled
- Score is tracked

### 4. Completing
- Last pair is matched
- Animation plays
- Modal prepares to show

### 5. Completed
- Final score is calculated
- Modal is displayed
- Player can restart

## Card Properties

```typescript
interface Card {
  id: number;           // Unique identifier
  emoji: string;        // Card emoji (🌟, 🎨, etc.)
  isFlipped: boolean;   // Current flip state
  isMatched: boolean;   // Match confirmation
  isShaking?: boolean;  // Shake animation flag
}
```

## Public Methods

### restartGame()
Resets all counters and starts a new game.

```typescript
component.restartGame(); // Restarts the game
```

### getAccuracy()
Returns current accuracy percentage.

```typescript
const accuracy = component.getAccuracy(); // Returns 0-100
```

### getGameStateClass()
Returns CSS class for current game state.

```typescript
const stateClass = component.getGameStateClass();
// Returns: 'game-state-initializing', 'game-state-showing', etc.
```

## Styling

### CSS Variables (Customizable)

```scss
// Override gradient
.memory-game-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// Card colors
.card-front {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
}

.card-back {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
}

// Matched card color
.card.is-matched .card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Keyboard Accessibility

| Key | Action |
|-----|--------|
| Tab | Navigate between cards |
| Shift+Tab | Navigate backwards |
| Enter | Flip selected card |
| Space | Flip selected card |

## Performance Optimizations

1. **OnPush Change Detection**: Only updates when inputs change
2. **TrackBy Function**: Efficient card list rendering
3. **Hardware Acceleration**: 3D transforms on cards
4. **Staggered Animations**: Sequential card reveal
5. **Memory Cleanup**: Proper subscription management

## Responsive Behavior

### Desktop (> 768px)
- 4x4 grid with 12px gaps
- Max width: 500px
- Normal animations

### Tablet (480px - 768px)
- 4x4 grid with 8px gaps
- Full width - 32px padding
- Slightly faster animations

### Mobile (< 480px)
- 4x4 grid with 6px gaps
- Full width - 16px padding
- Optimized touch targets
- Faster animations

## Browser Support

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- IE11: ⚠️ No 3D transforms

## Accessibility Features

✅ **ARIA Labels**: All interactive elements have labels
✅ **Keyboard Navigation**: Full keyboard support
✅ **Focus Management**: Visual focus indicators
✅ **Color Contrast**: WCAG AA compliant
✅ **Screen Reader**: Semantic HTML structure
✅ **Touch Targets**: 44x44px minimum size

## Integration Patterns

### Pattern 1: Score Tracking

```typescript
export class GameService {
  submitScore(score: GameScore): Observable<any> {
    return this.http.post('/api/game-scores', {
      gameType: 'memory',
      ...score,
      timestamp: new Date()
    });
  }
}
```

### Pattern 2: Difficulty Progression

```typescript
@Component({...})
export class GamePage {
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  onGameComplete(score: GameScore): void {
    // Progress to next difficulty
    if (score.percentage >= 85) {
      this.difficulty = 'hard';
    } else if (score.percentage >= 70) {
      this.difficulty = 'medium';
    }
  }
}
```

### Pattern 3: Leaderboard

```typescript
onGameComplete(score: GameScore): void {
  const leaderboardEntry = {
    playerName: this.playerName,
    moves: score.moves,
    accuracy: score.percentage,
    timestamp: new Date()
  };

  this.leaderboardService.addEntry(leaderboardEntry).subscribe();
}
```

## Testing

### Unit Test Example

```typescript
describe('MemoryGameComponent', () => {
  let component: MemoryGameComponent;
  let fixture: ComponentFixture<MemoryGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoryGameComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with 16 cards', () => {
    expect(component.cards.length).toBe(16);
  });

  it('should emit gameComplete when all pairs matched', (done) => {
    component.gameComplete.subscribe((score: GameScore) => {
      expect(score.matched).toBe(8);
      done();
    });

    // Simulate matching all pairs
    component.matchedPairs = 8;
    component['completeGame']();
  });

  it('should reset on restart', () => {
    component.moves = 10;
    component.restartGame();
    expect(component.moves).toBe(0);
  });
});
```

## Troubleshooting

### Cards not flipping
- Check if `isGameLocked` is true
- Verify `gameState` is 'playing'
- Check card `isMatched` or `isFlipped` state

### Score not updating
- Verify `scoreUpdate` event is bound
- Check if matches are being detected correctly
- Confirm `GameScore` interface matches expected shape

### Animations not smooth
- Check GPU acceleration (3D transforms enabled)
- Verify CSS animations are not conflicting
- Check for high CPU usage on device

## Future Enhancements

- [ ] Sound effects on flip/match/complete
- [ ] Hint system (show card positions)
- [ ] Multiplayer mode
- [ ] Custom emoji sets
- [ ] Time-based challenges
- [ ] Power-ups and bonuses
- [ ] Leaderboard integration
- [ ] Achievement system

---

**Version:** 1.0.0  
**Last Updated:** February 18, 2026  
**Component:** MemoryGameComponent  
**Module:** MemoryGameModule
