import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface Card {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

interface GameScore {
  matched: number;
  attempts: number;
  totalCards: number;
  percentage: number;
  moves: number;
  timeElapsed: number;
}

type GameState = 'menu' | 'initializing' | 'showing' | 'playing' | 'completed';

interface DifficultySettings {
  previewTime: number;
  flipDuration: number;
  name: string;
}

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  gameState: GameState = 'menu';
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  cards: Card[] = [];
  flippedCards: string[] = [];
  matchedPairs: number = 0;
  attempts: number = 0;
  moves: number = 0;
  isGameLocked: boolean = false;
  previewTimeLeft: number = 0;
  gameTimeElapsed: number = 0;
  lastScore: GameScore | null = null;

  difficultyOptions = [
    { label: 'Easy', value: 'easy' as const, icon: '🎯', description: '5s preview' },
    { label: 'Medium', value: 'medium' as const, icon: '⚡', description: '3s preview' },
    { label: 'Hard', value: 'hard' as const, icon: '��', description: '1.5s preview' },
  ];

  private timerSubscription?: Subscription;
  private gameTimerSubscription?: Subscription;

  readonly EMOJI_PAIRS = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];

  readonly DIFFICULTY_SETTINGS: Record<'easy' | 'medium' | 'hard', DifficultySettings> = {
    easy: { previewTime: 5, flipDuration: 400, name: 'Easy' },
    medium: { previewTime: 3, flipDuration: 300, name: 'Medium' },
    hard: { previewTime: 1.5, flipDuration: 200, name: 'Hard' }
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.gameState = 'menu';
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.gameTimerSubscription?.unsubscribe();
  }

  startGame(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
    this.gameState = 'initializing';
    this.initializeGame();
    this.cdr.markForCheck();
  }

  private initializeGame(): void {
    this.gameState = 'initializing';
    this.createAndShuffleCards();
    this.matchedPairs = 0;
    this.attempts = 0;
    this.moves = 0;
    this.flippedCards = [];
    this.isGameLocked = false;
    this.gameTimeElapsed = 0;
    this.previewTimeLeft = this.DIFFICULTY_SETTINGS[this.difficulty].previewTime;
    this.startGameTimer();
    this.startShowingPhase();
    this.cdr.markForCheck();
  }

  private startGameTimer(): void {
    this.gameTimerSubscription?.unsubscribe();
    this.gameTimerSubscription = interval(1000).subscribe(() => {
      this.gameTimeElapsed++;
      this.cdr.markForCheck();
    });
  }

  private startShowingPhase(): void {
    this.gameState = 'showing';
    this.cards = this.cards.map(card => ({ ...card, isFlipped: true }));
    this.startPreviewTimer();
    this.cdr.markForCheck();
  }

  private startPreviewTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(100).subscribe(() => {
      this.previewTimeLeft -= 0.1;
      if (this.previewTimeLeft <= 0) {
        this.timerSubscription?.unsubscribe();
        this.startPlayingPhase();
      }
      this.cdr.markForCheck();
    });
  }

  private startPlayingPhase(): void {
    this.gameState = 'playing';
    this.cards = this.cards.map(card => ({ ...card, isFlipped: false }));
    this.flippedCards = [];
    this.isGameLocked = false;
    this.cdr.markForCheck();
  }

  private createAndShuffleCards(): void {
    const cards: Card[] = [];
    this.EMOJI_PAIRS.forEach((emoji, index) => {
      cards.push(
        { id: `${index}-0`, emoji, isFlipped: false, isMatched: false, isShaking: false },
        { id: `${index}-1`, emoji, isFlipped: false, isMatched: false, isShaking: false }
      );
    });
    this.cards = this.shuffleArray(cards);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  onCardClick(card: Card): void {
    if (this.gameState !== 'playing' || this.isGameLocked || card.isMatched || this.flippedCards.includes(card.id)) {
      return;
    }

    this.flippedCards.push(card.id);
    card.isFlipped = true;
    this.attempts++;

    if (this.flippedCards.length === 2) {
      this.isGameLocked = true;
      this.moves++;
      setTimeout(() => this.checkForMatch(), 600);
    }

    this.cdr.markForCheck();
  }

  private checkForMatch(): void {
    const [id1, id2] = this.flippedCards;
    const card1 = this.cards.find(c => c.id === id1)!;
    const card2 = this.cards.find(c => c.id === id2)!;

    if (card1.emoji === card2.emoji) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchedPairs++;

      if (this.matchedPairs === this.EMOJI_PAIRS.length) {
        this.completeGame();
      }
    } else {
      card1.isShaking = true;
      card2.isShaking = true;
      setTimeout(() => {
        card1.isShaking = false;
        card2.isShaking = false;
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.cdr.markForCheck();
      }, 600);
    }

    this.flippedCards = [];
    this.isGameLocked = false;
    this.cdr.markForCheck();
  }

  private completeGame(): void {
    this.gameTimerSubscription?.unsubscribe();
    this.gameState = 'completed';
    const score = this.calculateScore();
    this.lastScore = score;
    this.cdr.markForCheck();
  }

  private calculateScore(): GameScore {
    const percentage = this.attempts > 0 
      ? Math.round((this.matchedPairs * 2 / this.attempts) * 100)
      : 0;

    return {
      matched: this.matchedPairs,
      attempts: this.attempts,
      totalCards: this.EMOJI_PAIRS.length * 2,
      percentage: Math.min(percentage, 100),
      moves: this.moves,
      timeElapsed: this.gameTimeElapsed
    };
  }

  restartGame(): void {
    this.gameState = 'menu';
    this.cdr.markForCheck();
  }

  getAccuracy(): number {
    return this.attempts > 0 
      ? Math.round((this.matchedPairs * 2 / this.attempts) * 100)
      : 0;
  }

  getStarRating(): number {
    const accuracy = this.getAccuracy();
    if (accuracy >= 95) return 3;
    if (accuracy >= 85) return 2;
    if (accuracy >= 70) return 1;
    return 0;
  }

  getPerformanceMessage(): string {
    const accuracy = this.getAccuracy();
    if (accuracy >= 95) return '🏆 Perfect Match!';
    if (accuracy >= 85) return '⭐ Excellent!';
    if (accuracy >= 70) return '👍 Great!';
    return '💪 Keep Playing!';
  }

  trackByCardId(index: number, card: Card): string {
    return card.id;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
