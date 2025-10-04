import { Component, OnDestroy } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { GameStorageService } from 'src/app/services/game-storage-service/game-storage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-number-tap',
  templateUrl: './number-tap.page.html',
  styleUrls: ['./number-tap.page.scss'],
  standalone: false,
  animations: [
    trigger('comboSlide', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(-50%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class NumberTapPage implements OnDestroy {
  isScrolled = false;
  private scrollThreshold = 180;

  // Game state
  size = 3;
  numbers: number[] = [];
  tapped: number[] = [];
  nextNumber = 1;
  gameStarted = false;
  gameOver = false;

  // Timer
  startTime: number | null = null;
  currentTime = 0;
  timerInterval: any;
  finalTime = '0.00';
  avgSpeed = '0.00';

  // Animations
  correctTap: number | null = null;
  combo = 0;
  showCombo = false;
  comboTimeout: any;

  // Best scores
  easyBest: string | null = null;
  mediumBest: string | null = null;
  hardBest: string | null = null;
  previousBest: string | null = null;
  isNewRecord = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private gameStorage: GameStorageService
  ) {}

  ngOnDestroy() {
    this.stopTimer();
    if (this.comboTimeout) clearTimeout(this.comboTimeout);
  }

  ionViewWillEnter() {
    this.gameStarted = false;
    this.gameOver = false;
    this.loadBestScores();
  }

  // ============================================
  // SCROLL HANDLING
  // ============================================
  onScroll(event: any) {
    // if (!this.gameStarted) return;
    const scrollTop = event.detail.scrollTop;

    // Buffer zone to prevent flickering
    if (scrollTop > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
    } else if (scrollTop < this.scrollThreshold - 30 && this.isScrolled) {
      this.isScrolled = false;
    }
  }

  // ============================================
  // BEST SCORES
  // ============================================
  loadBestScores() {
    const easyTime = this.gameStorage.getBestTime('easy');
    const mediumTime = this.gameStorage.getBestTime('medium');
    const hardTime = this.gameStorage.getBestTime('hard');

    this.easyBest = easyTime ? easyTime.toFixed(2) : null;
    this.mediumBest = mediumTime ? mediumTime.toFixed(2) : null;
    this.hardBest = hardTime ? hardTime.toFixed(2) : null;
  }

  hasBestScores(): boolean {
    return (
      this.easyBest !== null ||
      this.mediumBest !== null ||
      this.hardBest !== null
    );
  }

  getCurrentDifficulty(): 'easy' | 'medium' | 'hard' {
    if (this.size === 3) return 'easy';
    if (this.size === 4) return 'medium';
    return 'hard';
  }

  // ============================================
  // DIFFICULTY SELECTION
  // ============================================
  setDifficulty(size: number) {
    this.size = size;
  }

  // ============================================
  // START GAME
  // ============================================
  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.numbers = Array.from(
      { length: this.size * this.size },
      (_, i) => i + 1
    ).sort(() => Math.random() - 0.5);
    this.tapped = [];
    this.nextNumber = 1;
    this.currentTime = 0;
    this.combo = 0;
    this.showCombo = false;

    // Get previous best for comparison
    const difficulty = this.getCurrentDifficulty();
    const bestTime = this.gameStorage.getBestTime(difficulty);
    this.previousBest = bestTime ? bestTime.toFixed(2) : null;

    // Timer will start on first tap
    this.startTime = null;
  }

  // ============================================
  // TIMER FUNCTIONS
  // ============================================
  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (this.startTime) {
        this.currentTime = (Date.now() - this.startTime) / 1000;
      }
    }, 10);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    return seconds.toFixed(2);
  }

  // ============================================
  // GAME LOGIC
  // ============================================
  tapNumber(num: number) {
    if (this.gameOver || this.tapped.includes(num)) return;

    // Start timer on first tap
    if (this.nextNumber === 1) {
      this.startTimer();
    }

    if (num === this.nextNumber) {
      // Correct tap
      this.tapped.push(num);
      this.nextNumber++;
      this.combo++;

      // Trigger correct animation
      this.correctTap = num;
      setTimeout(() => {
        this.correctTap = null;
      }, 300);

      // Show combo notification (non-blocking)
      if (this.combo >= 3) {
        this.showCombo = true;

        if (this.comboTimeout) clearTimeout(this.comboTimeout);
        this.comboTimeout = setTimeout(() => {
          this.showCombo = false;
        }, 1500);
      }

      // Check if game is complete
      if (this.nextNumber > this.size * this.size) {
        this.endGame();
      }
    } else {
      // Wrong tap
      this.combo = 0;
      this.showCombo = false;
      this.showToast(`Tap ${this.nextNumber} next!`, 'warning');
    }
  }

  // ============================================
  // END GAME
  // ============================================
  endGame() {
    this.stopTimer();
    this.gameOver = true;
    this.showCombo = false;

    if (this.startTime) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      this.finalTime = elapsed.toFixed(2);
      this.avgSpeed = (elapsed / (this.size * this.size)).toFixed(2);

      // Check if new record
      const difficulty = this.getCurrentDifficulty();
      const currentBest = this.gameStorage.getBestTime(difficulty);
      this.isNewRecord = currentBest === null || elapsed < currentBest;

      // Save result
      this.gameStorage.saveGameResult(difficulty, elapsed);

      // Reload best scores
      this.loadBestScores();
    }
  }

  // ============================================
  // PROGRESS
  // ============================================
  getProgress(): number {
    return (this.tapped.length / (this.size * this.size)) * 100;
  }

  // ============================================
  // RATING & MESSAGES
  // ============================================
  getRating(): string {
    const time = parseFloat(this.finalTime);

    if (this.size === 3) {
      if (time < 5) return '⭐⭐⭐';
      if (time < 8) return '⭐⭐';
      return '⭐';
    } else if (this.size === 4) {
      if (time < 12) return '⭐⭐⭐';
      if (time < 18) return '⭐⭐';
      return '⭐';
    } else {
      if (time < 25) return '⭐⭐⭐';
      if (time < 35) return '⭐⭐';
      return '⭐';
    }
  }

  getVictoryMessage(): string {
    if (this.isNewRecord) {
      return 'New Record! 🎉';
    }
    const rating = this.getRating();
    if (rating === '⭐⭐⭐') return 'Outstanding! 🌟';
    if (rating === '⭐⭐') return 'Great Job! 👏';
    return 'Well Done! 👍';
  }

  getTimeDifference(): string {
    if (!this.previousBest) return '0.00';
    const diff = Math.abs(
      parseFloat(this.finalTime) - parseFloat(this.previousBest)
    );
    return (this.isNewRecord ? '-' : '+') + diff.toFixed(2);
  }

  // ============================================
  // ACTIONS
  // ============================================
  playAgain() {
    this.gameOver = false;
    this.gameStarted = false;
    setTimeout(() => {
      this.startGame();
    }, 100);
  }

  changeDifficulty() {
    this.gameOver = false;
    this.gameStarted = false;
  }

  async shareResult() {
    const difficulty = this.getCurrentDifficulty().toUpperCase();
    const shareText =
      `🎮 Number Tap Challenge\n\n` +
      `⏱️ Time: ${this.finalTime}s\n` +
      `📊 Difficulty: ${difficulty} (${this.size}×${this.size})\n` +
      `⭐ Rating: ${this.getRating()}\n` +
      `${this.isNewRecord ? '🏆 NEW RECORD!\n' : ''}` +
      `\nCan you beat my score? 🔥`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Number Tap Challenge',
          text: shareText,
        });
      } catch (err) {
        this.copyToClipboard(shareText);
      }
    } else {
      this.copyToClipboard(shareText);
    }
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Result copied to clipboard! 📋', 'success');
    } catch (err) {
      this.showToast('Unable to share result', 'danger');
    }
  }

  // ============================================
  // TOAST HELPER
  // ============================================
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    toast.present();
  }

  // ============================================
  // NAVIGATION
  // ============================================
  goBack() {
    if(this.gameStarted) {
      this.changeDifficulty();
    } else {
      this.router.navigate(['/games']);
    }
  }
}
