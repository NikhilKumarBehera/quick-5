# Memory Game - Quick Start Guide

## 🎮 Game Overview

A beautiful 4x4 memory card matching game with:
- **8 emoji pairs** to match
- **3 difficulty levels** (Easy, Medium, Hard)
- **Smooth animations** with 3D card flips
- **Scoring system** with accuracy tracking
- **Star ratings** based on performance
- **Keyboard accessible** with Tab and Enter keys

## 📦 Installation

The component is already installed in your shared components module.

### Import in Your Module

```typescript
import { MemoryGameModule } from '@shared/components/memory-game/memory-game.module';

@NgModule({
  imports: [MemoryGameModule],
})
export class YourModule {}
```

## 🚀 Basic Usage

### Simplest Usage (Default Settings)

```html
<app-memory-game
  (gameComplete)="onGameComplete($event)">
</app-memory-game>
```

### With All Options

```html
<app-memory-game
  difficulty="medium"
  [showHints]="true"
  [enableSounds]="true"
  (gameComplete)="onGameComplete($event)"
  (scoreUpdate)="onScoreUpdate($event)">
</app-memory-game>
```

## ⚙️ Component Properties

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `difficulty` | 'easy' \| 'medium' \| 'hard' | 'medium' | Game difficulty level |
| `showHints` | boolean | false | Enable hint system |
| `enableSounds` | boolean | true | Enable sound effects |

### Outputs

| Event | Payload | Fired | Description |
|-------|---------|-------|-------------|
| `gameComplete` | GameScore | When all pairs matched | Game finished |
| `scoreUpdate` | GameScore | After each match | Score changed |

## 📊 GameScore Object

```typescript
interface GameScore {
  matched: number;      // Number of matched pairs (0-8)
  attempts: number;     // Total card clicks
  totalCards: number;   // Always 16
  percentage: number;   // Accuracy percentage (0-100)
  moves: number;        // Number of pair attempts
}
```

## 💻 TypeScript Example

```typescript
import { Component } from '@angular/core';
import { GameScore } from '@shared/components';

@Component({
  selector: 'app-my-game-page',
  template: `
    <app-memory-game
      [difficulty]="difficulty"
      (gameComplete)="handleGameComplete($event)"
      (scoreUpdate)="handleScoreUpdate($event)">
    </app-memory-game>

    <div *ngIf="lastScore">
      <h3>Last Game</h3>
      <p>Moves: {{ lastScore.moves }}</p>
      <p>Accuracy: {{ lastScore.percentage }}%</p>
    </div>
  `,
})
export class MyGamePage {
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  lastScore: GameScore | null = null;

  handleGameComplete(score: GameScore): void {
    console.log('Game completed!', score);
    this.lastScore = score;

    // Optional: Send to backend
    // this.gameService.saveScore(score).subscribe(...);
  }

  handleScoreUpdate(score: GameScore): void {
    console.log('Current score:', score);
    // Update UI in real-time
  }
}
```

## 🎯 Difficulty Levels

### Easy
- **Preview Time**: 5 seconds to memorize cards
- **Card Flip Speed**: Slower (400ms)
- **Best for**: Learning, children
- **Setup**: `difficulty="easy"`

### Medium (Default)
- **Preview Time**: 3 seconds to memorize cards
- **Card Flip Speed**: Normal (300ms)
- **Best for**: General players
- **Setup**: `difficulty="medium"`

### Hard
- **Preview Time**: 1.5 seconds to memorize cards
- **Card Flip Speed**: Faster (200ms)
- **Best for**: Challenge mode, experts
- **Setup**: `difficulty="hard"`

## 🎨 Game States

### 1. Initializing
- Game loads and prepares
- Cards are shuffled

### 2. Showing
- All cards display emojis
- Timer counts down
- Memorization phase
- Clicking disabled

### 3. Playing
- Cards face down (question marks)
- Player clicks to flip
- Matches are checked
- Score tracked

### 4. Completing
- Last pair matched
- Animation plays

### 5. Completed
- Final score shown
- Modal displays results
- "Play Again" button appears

## 🎮 How to Play

1. **Remember**: Cards show for 3 seconds (medium difficulty)
2. **Click**: Click cards to reveal emojis
3. **Match**: Find pairs of identical emojis
4. **Score**: Your accuracy and moves are tracked
5. **Complete**: Finish when all 8 pairs are matched
6. **Restart**: Click "Play Again" for new game

## ⌨️ Keyboard Controls

| Key | Action |
|-----|--------|
| **Tab** | Move to next card |
| **Shift + Tab** | Move to previous card |
| **Enter** | Flip selected card |
| **Space** | Flip selected card |

## 🎬 Animations Included

- **Slide Down**: Header entrance
- **Fade In**: Board appearance  
- **Card Flip**: 3D rotation
- **Shake**: Mismatch effect
- **Pop**: Match confirmation
- **Bounce**: Timer pulsing
- **Slide Up**: Completion modal
- **Star Pop**: Rating animation

## 🎯 Scoring Explained

### Moves
- Counts each pair attempt
- Lower is better

### Attempts
- Total number of card clicks
- Every flip counts

### Accuracy Percentage
- Formula: (Matched Pairs × 2) / Total Attempts × 100
- 100% = perfect game (no wrong matches)

### Star Rating
- ⭐ 70%+ accuracy
- ⭐⭐ 85%+ accuracy  
- ⭐⭐⭐ 95%+ accuracy

## 🎨 Customization

### Change Theme Colors

Edit the gradient in your component or SCSS:

```scss
.memory-game-container {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Change Emoji Set

Edit `EMOJI_PAIRS` in memory-game.component.ts:

```typescript
private readonly EMOJI_PAIRS: string[] = [
  '🌟', '🌟', // Your emojis here
  '🎨', '🎨',
  // ... more pairs
];
```

### Adjust Animation Speeds

Edit `DIFFICULTY_SETTINGS` in component:

```typescript
private readonly DIFFICULTY_SETTINGS = {
  easy: { 
    previewTime: 5000,    // 5 seconds
    flipDuration: 400,    // 400ms flip
    delay: 200            // 200ms between cards
  },
  // ... other levels
};
```

## 🐛 Troubleshooting

### Cards not flipping?
- Check if game is in 'playing' state
- Verify card is not already matched
- Check if game is locked (during match checking)

### Score showing 0 moves?
- Make sure `gameComplete` event is being fired
- Check GameScore interface matches

### Animations not working?
- Verify CSS is properly loaded
- Check browser supports 3D transforms
- Try clearing browser cache

## 📱 Responsive Behavior

- **Desktop**: 4x4 grid, 500px max width
- **Tablet**: 4x4 grid, full width with padding
- **Mobile**: 4x4 grid, smaller gaps, optimized touch

## ✅ Accessibility

- ✅ ARIA labels on all elements
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Color contrast compliant
- ✅ Screen reader friendly

## 🔗 Integration Examples

### With Backend Score Saving

```typescript
handleGameComplete(score: GameScore): void {
  this.gameService.saveScore({
    gameType: 'memory',
    moves: score.moves,
    accuracy: score.percentage,
    timestamp: new Date()
  }).subscribe(() => {
    console.log('Score saved!');
  });
}
```

### With Difficulty Progression

```typescript
handleGameComplete(score: GameScore): void {
  if (score.percentage >= 85) {
    this.difficulty = 'hard'; // Progress to next level
  }
}
```

### With Leaderboard

```typescript
handleGameComplete(score: GameScore): void {
  this.leaderboardService.addScore({
    playerName: this.playerName,
    moves: score.moves,
    accuracy: score.percentage
  }).subscribe();
}
```

## 📚 Full Documentation

See `MEMORY_GAME_DOCUMENTATION.md` for complete API reference, testing examples, and advanced features.

## 🚀 What's Next?

Future enhancements:
- Sound effects for flips and matches
- Hint system to reveal positions
- Multiplayer competitive mode
- Custom emoji selection
- Time-based challenges
- Power-ups and bonuses
- Achievement system

---

**Ready to play?** Import the module and add `<app-memory-game></app-memory-game>` to your template!

For more details, check the full documentation file.
