/**
 * Memory Game Component
 *
 * @component
 * Interactive 4x4 memory card matching game
 * Features: card flipping, matching validation, scoring, animations, shuffle effects
 *
 * @example
 * ```html
 * <app-memory-game
 *   [difficulty]="'medium'"
 *   [showHints]="true"
 *   (gameComplete)="onGameComplete($event)"
 *   (scoreUpdate)="onScoreUpdate($event)">
 * </app-memory-game>
 * ```
 *
 * @used-in Games, Challenges, Activities pages
 */

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking?: boolean;
}

export interface GameScore {
  matched: number;
  attempts: number;
  totalCards: number;
  percentage: number;
  moves: number;
}

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  /**
   * Game difficulty level
   * Affects initial card preview duration and animation speed
   * @type {'easy' | 'medium' | 'hard'}
   * @default 'medium'
   */
  @Input() difficulty: 'easy' | 'medium' | 'hard' = 'medium';

  /**
   * Show hint system during gameplay
   * @type {boolean}
   * @default false
   */
  @Input() showHints: boolean = false;

  /**
   * Enable/disable sound effects
   * @type {boolean}
   * @default true
   */
  @Input() enableSounds: boolean = true;

  /**
   * Emitted when game is completed
   * @type {EventEmitter<GameScore>}
   * @event
   */
  @Output() gameComplete = new EventEmitter<GameScore>();

  /**
   * Emitted when score updates
   * @type {EventEmitter<GameScore>}
   * @event
   */
  @Output() scoreUpdate = new EventEmitter<GameScore>();

  /**
   * Array of cards in the game
   * @type {Card[]}
   * @internal
   */
  cards: Card[] = [];

  /**
   * Currently flipped cards (max 2)
   * @type {Card[]}
   * @internal
   */
  flippedCards: Card[] = [];

  /**
   * Number of matched pairs
   * @type {number}
   * @internal
   */
  matchedPairs: number = 0;

  /**
   * Total number of attempts/moves
   * @type {number}
   * @internal
   */
  attempts: number = 0;

  /**
   * Total number of moves (incremented once per pair attempt)
   * @type {number}
   * @internal
   */
  moves: number = 0;

  /**
   * Game state: initializing, playing, completing, completed
   * @type {string}
   * @internal
   */
  gameState: 'initializing' | 'showing' | 'playing' | 'completing' | 'completed' =
    'initializing';

  /**
   * Is game locked (during card flip/match check)
   * @type {boolean}
   * @internal
   */
  isGameLocked: boolean = false;

  /**
   * Time left for showing cards initially
   * @type {number}
   * @internal
   */
  previewTimeLeft: number = 0;

  /**
   * Unsubscribe trigger
   * @type {Subject<void>}
   * @internal
   */
  private destroy$ = new Subject<void>();

  /**
   * Emoji pairs for cards (8 pairs = 16 cards)
   * @type {string[]}
   * @internal
   */
  private readonly EMOJI_PAIRS: string[] = [
    '🌟', '🌟', // Star
    '🎨', '🎨', // Art
    '🎭', '🎭', // Theater
    '🎪', '🎪', // Circus
    '🎯', '🎯', // Target
    '🎲', '🎲', // Dice
    '🎸', '🎸', // Guitar
    '🎺', '🎺', // Trumpet
  ];

  /**
   * Difficulty settings
   * @type {object}
   * @internal
   */
  private readonly DIFFICULTY_SETTINGS = {
    easy: { previewTime: 5000, flipDuration: 400, delay: 200 },
    medium: { previewTime: 3000, flipDuration: 300, delay: 150 },
    hard: { previewTime: 1500, flipDuration: 200, delay: 100 },
  };

  /**
   * Initialize game on component load
   */
  ngOnInit(): void {
    this.initializeGame();
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize or reset the game
   * Creates shuffled cards and starts preview mode
   * @private
   */
  private initializeGame(): void {
    this.gameState = 'initializing';
    this.isGameLocked = true;
    this.cards = this.createAndShuffleCards();
    this.matchedPairs = 0;
    this.attempts = 0;
    this.moves = 0;

    // Show cards for preview duration
    this.gameState = 'showing';
    const previewTime = this.DIFFICULTY_SETTINGS[this.difficulty].previewTime;
    this.previewTimeLeft = Math.round(previewTime / 100);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      this.previewTimeLeft--;
      if (this.previewTimeLeft <= 0) {
        clearInterval(countdownInterval);
        this.startPlayingPhase();
      }
    }, 100);
  }

  /**
   * Transition from showing phase to playing phase
   * Flips all cards face down with shuffle animation
   * @private
   */
  private startPlayingPhase(): void {
    this.gameState = 'playing';
    const flipDuration = this.DIFFICULTY_SETTINGS[this.difficulty].flipDuration;

    // Flip all cards with staggered delay for shuffle effect
    this.cards.forEach((card, index) => {
      setTimeout(() => {
        card.isFlipped = false;
        if (index === this.cards.length - 1) {
          this.isGameLocked = false;
        }
      }, index * 30);
    });
  }

  /**
   * Create and shuffle card pairs
   * @returns Array of shuffled cards
   * @private
   */
  private createAndShuffleCards(): Card[] {
    const cards: Card[] = this.EMOJI_PAIRS.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: true,
      isMatched: false,
    }));

    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
  }

  /**
   * Handle card click event
   * @param card - Clicked card
   * @internal
   */
  onCardClick(card: Card): void {
    // Validate click
    if (
      this.isGameLocked ||
      card.isFlipped ||
      card.isMatched ||
      this.gameState !== 'playing'
    ) {
      return;
    }

    // Flip the card
    card.isFlipped = true;
    this.flippedCards.push(card);

    // Check if two cards are flipped
    if (this.flippedCards.length === 2) {
      this.attempts++;
      this.moves++;
      this.checkForMatch();
    }
  }

  /**
   * Check if flipped cards match
   * If match: keep them flipped and emit success
   * If no match: flip back with shake animation
   * @private
   */
  private checkForMatch(): void {
    this.isGameLocked = true;
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.emoji === card2.emoji;

    if (isMatch) {
      // Cards match
      setTimeout(() => {
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;

        this.emitScoreUpdate();

        // Check if game is complete
        if (this.matchedPairs === this.EMOJI_PAIRS.length / 2) {
          this.completeGame();
        } else {
          this.flippedCards = [];
          this.isGameLocked = false;
        }
      }, 400);
    } else {
      // Cards don't match - shake and flip back
      card1.isShaking = true;
      card2.isShaking = true;

      setTimeout(() => {
        card1.isShaking = false;
        card2.isShaking = false;
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.isGameLocked = false;
      }, 600);
    }
  }

  /**
   * Complete the game and emit result
   * @private
   */
  private completeGame(): void {
    this.gameState = 'completed';
    const score = this.calculateScore();
    this.gameComplete.emit(score);
  }

  /**
   * Emit current score update
   * @private
   */
  private emitScoreUpdate(): void {
    const score = this.calculateScore();
    this.scoreUpdate.emit(score);
  }

  /**
   * Calculate current game score
   * @returns Game score object
   * @private
   */
  private calculateScore(): GameScore {
    const totalCards = this.EMOJI_PAIRS.length;
    const percentage = Math.round((this.matchedPairs / (totalCards / 2)) * 100);

    return {
      matched: this.matchedPairs,
      attempts: this.attempts,
      totalCards,
      percentage,
      moves: this.moves,
    };
  }

  /**
   * Restart the game
   * Resets all counters and reinitializes
   * @internal
   */
  restartGame(): void {
    this.flippedCards = [];
    this.initializeGame();
  }

  /**
   * Get accuracy percentage
   * @returns Percentage of correct matches vs attempts
   * @internal
   */
  getAccuracy(): number {
    if (this.attempts === 0) return 0;
    return Math.round(((this.matchedPairs * 2) / this.attempts) * 100);
  }

  /**
   * Get game state for template
   * @returns Current game state string
   * @internal
   */
  getGameStateClass(): string {
    return `game-state-${this.gameState}`;
  }

  /**
   * Track by function for *ngFor optimization
   * @param index - Card index
   * @param card - Card object
   * @returns Card ID for tracking
   * @internal
   */
  trackByCardId(index: number, card: Card): number {
    return card.id;
  }
}
