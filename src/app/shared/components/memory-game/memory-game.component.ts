import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

export interface Card {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

export interface GameScore {
  matched: number;
  attempts: number;
  totalCards: number;
  percentage: number;
  moves: number;
}

type GameState = 'initializing' | 'showing' | 'playing' | 'completing' | 'completed';

interface DifficultySettings {
  previewTime: number;
  flipDuration: number;
  name: string;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  @Input() difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  @Input() showHints: boolean = false;
  @Input() enableSounds: boolean = true;

  @Output() gameComplete = new EventEmitter<GameScore>();
  @Output() scoreUpdate = new EventEmitter<GameScore>();

  cards: Card[] = [];
  flippedCards: string[] = [];
  matchedPairs: number = 0;
  attempts: number = 0;
  moves: number = 0;
  gameState: GameState = 'initializing';
  isGameLocked: boolean = false;
  previewTimeLeft: number = 0;

  private timerSubscription?: Subscription;

  readonly EMOJI_PAIRS = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];

  readonly DIFFICULTY_SETTINGS: Record<'easy' | 'medium' | 'hard', DifficultySettings> = {
    easy: { previewTime: 5, flipDuration: 400, name: 'Easy' },
    medium: { previewTime: 3, flipDuration: 300, name: 'Medium' },
    hard: { previewTime: 1.5, flipDuration: 200, name: 'Hard' }
  };

  ngOnInit(): void {
    this.initializeGame();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  private initializeGame(): void {
    this.gameState = 'initializing';
    this.createAndShuffleCards();
    this.matchedPairs = 0;
    this.attempts = 0;
    this.moves = 0;
    this.flippedCards = [];
    this.isGameLocked = false;
    this.previewTimeLeft = this.DIFFICULTY_SETTINGS[this.difficulty].previewTime;
    this.startShowingPhase();
  }

  private startShowingPhase(): void {
    this.gameState = 'showing';
    this.cards = this.cards.map(card => ({ ...card, isFlipped: true }));
    this.startPreviewTimer();
  }

  private startPreviewTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(100).subscribe(() => {
      this.previewTimeLeft -= 0.1;
      if (this.previewTimeLeft <= 0) {
        this.timerSubscription?.unsubscribe();
        this.startPlayingPhase();
      }
    });
  }

  private startPlayingPhase(): void {
    this.gameState = 'playing';
    this.cards = this.cards.map(card => ({ ...card, isFlipped: false }));
    this.flippedCards = [];
    this.isGameLocked = false;
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

    this.emitScoreUpdate();
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
      }, 600);
    }

    this.flippedCards = [];
    this.isGameLocked = false;
    this.emitScoreUpdate();
  }

  private completeGame(): void {
    this.gameState = 'completed';
    const score = this.calculateScore();
    setTimeout(() => {
      this.gameComplete.emit(score);
    }, 500);
  }

  private emitScoreUpdate(): void {
    this.scoreUpdate.emit(this.calculateScore());
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
      moves: this.moves
    };
  }

  restartGame(): void {
    this.initializeGame();
  }

  getAccuracy(): number {
    return this.calculateScore().percentage;
  }

  getGameStateClass(): string {
    return `game-state-${this.gameState}`;
  }

  trackByCardId(index: number, card: Card): string {
    return card.id;
  }
}
