import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface Card {
  id: string;
  emoji: string;
  isRevealed: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

export interface GameScore {
  matched: number;
  attempts: number;
  totalCards: number;
  percentage: number;
  moves: number;
  timeElapsed: number;
}

/** Persisted per-difficulty stats stored in localStorage */
interface DifficultyStats {
  bestTime: number | null; // seconds — null = never completed
  bestMoves: number | null; // fewest moves
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number; // consecutive wins without quitting
  bestStreak: number;
  lastPlayed: string | null; // ISO date string
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'initializing' | 'showing' | 'playing' | 'completed';

interface DifficultySettings {
  previewTime: number;
  name: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const LS_KEY = 'memory_game_stats_v1';

const DEFAULT_STATS: DifficultyStats = {
  bestTime: null,
  bestMoves: null,
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayed: null,
};

// ─── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  gameState: GameState = 'menu';
  difficulty: Difficulty = 'medium';

  cards: Card[] = [];
  revealedCardIds: string[] = [];
  matchedPairs = 0;
  attempts = 0;
  moves = 0;
  isGameLocked = false;
  previewTimeLeft = 0;
  gameTimeElapsed = 0;
  isScrolled = false;

  lastScore: GameScore | null = null;

  /** Set to true when the just-completed run beats the saved best time */
  isNewBestTime = false;
  isNewBestMoves = false;

  /** All per-difficulty stats loaded from localStorage */
  allStats: Record<Difficulty, DifficultyStats> = {
    easy: { ...DEFAULT_STATS },
    medium: { ...DEFAULT_STATS },
    hard: { ...DEFAULT_STATS },
  };

  difficultyOptions: {
    label: string;
    value: Difficulty;
    icon: string;
    description: string;
  }[] = [
    { label: 'Easy', value: 'easy', icon: '🎯', description: '5s preview' },
    { label: 'Medium', value: 'medium', icon: '⚡', description: '3s preview' },
    { label: 'Hard', value: 'hard', icon: '🔥', description: '1.5s preview' },
  ];

  private timerSub?: Subscription;
  private gameTimerSub?: Subscription;

  readonly EMOJI_PAIRS = ['🌟', '🎨', '🎭', '🎪', '🦋', '🎲', '🌈', '🔮'];

  readonly DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
    easy: { previewTime: 5, name: 'Easy' },
    medium: { previewTime: 3, name: 'Medium' },
    hard: { previewTime: 1.5, name: 'Hard' },
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.gameState = 'menu';
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.gameTimerSub?.unsubscribe();
  }

  // ─── LocalStorage helpers ──────────────────────────────────────────────────

  private loadStats(): void {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<
          Record<Difficulty, Partial<DifficultyStats>>
        >;
        (['easy', 'medium', 'hard'] as Difficulty[]).forEach((d) => {
          this.allStats[d] = { ...DEFAULT_STATS, ...(parsed[d] ?? {}) };
        });
      }
    } catch {
      // localStorage unavailable or corrupt — use defaults
    }
  }

  private saveStats(): void {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(this.allStats));
    } catch {
      // Silently fail if storage is full / unavailable
    }
  }

  /** Convenience getter for the currently-selected difficulty stats */
  get currentStats(): DifficultyStats {
    return this.allStats[this.difficulty];
  }

  /** Win rate percentage for a given difficulty (0-100) */
  winRate(d: Difficulty): number {
    const s = this.allStats[d];
    return s.gamesPlayed > 0
      ? Math.round((s.gamesWon / s.gamesPlayed) * 100)
      : 0;
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async onBackPressed(): Promise<void> {
    if (this.gameState === 'playing' || this.gameState === 'showing') {
      await this.showQuitAlert();
    } else {
      this.location.back();
    }
  }

  private async showQuitAlert(): Promise<void> {
    this.timerSub?.unsubscribe();
    this.gameTimerSub?.unsubscribe();

    const alert = await this.alertCtrl.create({
      header: '🚪 Quit Game?',
      message: 'Your progress will be lost and the timer will reset.',
      cssClass: 'quit-alert',
      buttons: [
        {
          text: 'Keep Playing',
          role: 'cancel',
          cssClass: 'alert-btn-keep',
          handler: () => this.resumeTimers(),
        },
        {
          text: 'Quit & Restart',
          cssClass: 'alert-btn-quit',
          handler: () => {
            // Record as a played-but-not-won game & break streak
            this.allStats[this.difficulty].gamesPlayed++;
            this.allStats[this.difficulty].currentStreak = 0;
            this.saveStats();
            this.quitGame();
          },
        },
      ],
    });
    await alert.present();
  }

  private resumeTimers(): void {
    this.gameTimerSub = interval(1000).subscribe(() => {
      this.gameTimeElapsed++;
      this.cdr.markForCheck();
    });

    if (this.gameState === 'showing') {
      this.timerSub = interval(100).subscribe(() => {
        this.previewTimeLeft = Math.max(0, this.previewTimeLeft - 0.1);
        if (this.previewTimeLeft <= 0) {
          this.timerSub?.unsubscribe();
          this.startPlayingPhase();
        }
        this.cdr.markForCheck();
      });
    }
  }

  private quitGame(): void {
    this.timerSub?.unsubscribe();
    this.gameTimerSub?.unsubscribe();
    this.cards = [];
    this.revealedCardIds = [];
    this.matchedPairs =
      this.attempts =
      this.moves =
      this.gameTimeElapsed =
      this.previewTimeLeft =
        0;
    this.isGameLocked = false;
    this.isNewBestTime = this.isNewBestMoves = false;
    this.gameState = 'menu';
    this.cdr.markForCheck();
  }

  // ─── Game Flow ─────────────────────────────────────────────────────────────

  startGame(level: Difficulty): void {
    this.difficulty = level;
    this.isNewBestTime = this.isNewBestMoves = false;
    this.initializeGame();
  }

  private initializeGame(): void {
    this.timerSub?.unsubscribe();
    this.gameTimerSub?.unsubscribe();

    const raw: Card[] = [];
    this.EMOJI_PAIRS.forEach((emoji, i) => {
      raw.push(
        {
          id: `${i}-a`,
          emoji,
          isRevealed: false,
          isMatched: false,
          isShaking: false,
        },
        {
          id: `${i}-b`,
          emoji,
          isRevealed: false,
          isMatched: false,
          isShaking: false,
        }
      );
    });
    this.cards = this.shuffleArray(raw);

    this.revealedCardIds = [];
    this.matchedPairs = this.attempts = this.moves = this.gameTimeElapsed = 0;
    this.isGameLocked = false;
    this.previewTimeLeft =
      this.DIFFICULTY_SETTINGS[this.difficulty].previewTime;

    this.startGameTimer();
    setTimeout(() => this.startShowingPhase(), 300);
    this.cdr.markForCheck();
  }

  private startGameTimer(): void {
    this.gameTimerSub?.unsubscribe();
    this.gameTimerSub = interval(1000).subscribe(() => {
      this.gameTimeElapsed++;
      this.cdr.markForCheck();
    });
  }

  private startShowingPhase(): void {
    this.gameState = 'showing';
    this.cards = this.cards.map((c) => ({ ...c, isRevealed: true }));
    this.cdr.markForCheck();

    this.timerSub = interval(100).subscribe(() => {
      this.previewTimeLeft = Math.max(0, this.previewTimeLeft - 0.1);
      if (this.previewTimeLeft <= 0) {
        this.timerSub?.unsubscribe();
        this.startPlayingPhase();
      }
      this.cdr.markForCheck();
    });
  }

  private startPlayingPhase(): void {
    this.gameState = 'playing';
    this.cards = this.cards.map((c) => ({ ...c, isRevealed: false }));
    this.revealedCardIds = [];
    this.isGameLocked = false;
    this.cdr.markForCheck();
  }

  onCardClick(card: Card): void {
    if (
      this.gameState !== 'playing' ||
      this.isGameLocked ||
      card.isMatched ||
      card.isRevealed
    )
      return;

    card.isRevealed = true;
    this.revealedCardIds.push(card.id);
    this.attempts++;

    if (this.revealedCardIds.length === 2) {
      this.isGameLocked = true;
      this.moves++;
      setTimeout(() => this.checkForMatch(), 900);
    }

    this.cdr.markForCheck();
  }

  private checkForMatch(): void {
    const [id1, id2] = this.revealedCardIds;
    const card1 = this.cards.find((c) => c.id === id1)!;
    const card2 = this.cards.find((c) => c.id === id2)!;

    if (card1.emoji === card2.emoji) {
      card1.isMatched = card2.isMatched = true;
      this.matchedPairs++;
      if (this.matchedPairs === this.EMOJI_PAIRS.length) {
        this.completeGame();
      }
    } else {
      card1.isShaking = card2.isShaking = true;
      setTimeout(() => {
        card1.isShaking = card2.isShaking = false;
        card1.isRevealed = card2.isRevealed = false;
        this.cdr.markForCheck();
      }, 600);
    }

    this.revealedCardIds = [];
    this.isGameLocked = false;
    this.cdr.markForCheck();
  }

  private completeGame(): void {
    this.gameTimerSub?.unsubscribe();
    this.gameState = 'completed';
    this.lastScore = this.calculateScore();

    // ── Update persistent stats ──
    const stats = this.allStats[this.difficulty];
    const time = this.gameTimeElapsed;
    const moves = this.moves;

    stats.gamesPlayed++;
    stats.gamesWon++;
    stats.currentStreak++;
    stats.lastPlayed = new Date().toISOString();

    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }

    // Best time — lower is better
    if (stats.bestTime === null || time < stats.bestTime) {
      this.isNewBestTime = true;
      stats.bestTime = time;
    } else {
      this.isNewBestTime = false;
    }

    // Best moves — lower is better
    if (stats.bestMoves === null || moves < stats.bestMoves) {
      this.isNewBestMoves = true;
      stats.bestMoves = moves;
    } else {
      this.isNewBestMoves = false;
    }

    this.saveStats();
    this.cdr.markForCheck();
  }

  private calculateScore(): GameScore {
    const pct =
      this.attempts > 0
        ? Math.round(((this.matchedPairs * 2) / this.attempts) * 100)
        : 0;
    return {
      matched: this.matchedPairs,
      attempts: this.attempts,
      totalCards: this.EMOJI_PAIRS.length * 2,
      percentage: Math.min(pct, 100),
      moves: this.moves,
      timeElapsed: this.gameTimeElapsed,
    };
  }

  restartGame(): void {
    this.isNewBestTime = this.isNewBestMoves = false;
    this.gameState = 'menu';
    this.cdr.markForCheck();
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  getAccuracy(): number {
    return this.attempts > 0
      ? Math.round(((this.matchedPairs * 2) / this.attempts) * 100)
      : 0;
  }

  getStarRating(): number {
    const a = this.getAccuracy();
    return a >= 95 ? 3 : a >= 80 ? 2 : a >= 60 ? 1 : 0;
  }

  getPerformanceMessage(): string {
    if (this.isNewBestTime && this.isNewBestMoves)
      return '🏆 New best time AND moves!';
    if (this.isNewBestTime) return '⚡ New best time!';
    if (this.isNewBestMoves) return '🎯 New best moves!';
    const a = this.getAccuracy();
    return a >= 95
      ? '🏆 Perfect Memory!'
      : a >= 80
      ? '⭐ Excellent!'
      : a >= 60
      ? '👍 Great job!'
      : '💪 Keep practising!';
  }

  /** Is the current run faster than the saved best by at least 1 second? */
  improvedBySeconds(): number {
    const best = this.allStats[this.difficulty].bestTime;
    if (best === null || !this.lastScore) return 0;
    // best is ALREADY updated, so compare against previous best
    // We store the pre-update value in the score to show the delta
    return 0; // handled via isNewBestTime flag in template
  }

  trackByCardId(_: number, card: Card): string {
    return card.id;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onScroll(event: any): void {
    this.isScrolled = event.detail.scrollTop > 50;
    this.cdr.markForCheck();
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
