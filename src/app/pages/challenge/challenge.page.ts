import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CategoryProgressService } from 'src/app/services/category-progress-service/category-progress-service';
import {
  Puzzle,
  PuzzleService,
} from 'src/app/services/puzzle-service/puzzle-service';
import { SoundService } from 'src/app/services/sound-service/sound-service';
import { StorageService } from 'src/app/services/storage-service/storage-service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.page.html',
  styleUrls: ['./challenge.page.scss'],
  standalone: false,
})
export class ChallengePage implements OnInit {
  challenges: Puzzle[] = [];
  currentIndex: number = 0;
  selectedAnswer: number | null = null;
  correctAnswers: number = 0;
  userAnswers: number[] = [];
  startTime: number = 0;
  mode: string = 'daily';
  categoryName: string = '';
  categoryIcon: string = '';
  userResults: { categoryType: string; isCorrect: boolean }[] = [];

  // New properties for enhanced UI
  hasAnswered: boolean = false;
  isCorrectAnswer: boolean = false;
  showExplanationCard: boolean = false;
  autoNavigateTimeout: any = null;
  countdownSeconds: number = 3;
  countdownInterval: any = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private puzzleService: PuzzleService,
    private storageService: StorageService,
    private categoryProgressService: CategoryProgressService,
    private soundService: SoundService
  ) {
    // Get puzzles from navigation state or load new ones
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state;
      this.challenges = state['puzzles'] || [];
      this.mode = state['mode'] || 'daily';
      this.categoryName = state['categoryName'] || '';
      this.categoryIcon = state['categoryIcon'] || '';
    }
  }

  ngOnInit() {
    this.startTime = Date.now();

    // If no puzzles were passed, get daily puzzles
    if (this.challenges.length === 0) {
      this.challenges = this.puzzleService.getDailyPuzzles();
    }

    console.log('Loaded challenges:', this.challenges);
  }

  ngOnDestroy() {
    // Clear timeout if component is destroyed
    if (this.autoNavigateTimeout) {
      clearTimeout(this.autoNavigateTimeout);
    }
    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  get currentChallenge(): Puzzle {
    return this.challenges[this.currentIndex];
  }

  get progress(): number {
    return ((this.currentIndex + 1) / this.challenges.length) * 100;
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'medium':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '⭐';
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  async selectAnswer(index: number) {
    if (this.hasAnswered) return; // Prevent multiple selections

    this.selectedAnswer = index;
    this.hasAnswered = true;

    // Check if answer is correct
    const isCorrect = index === this.currentChallenge.correctAnswer;
    this.isCorrectAnswer = isCorrect;

    // Record answer
    this.userAnswers.push(index);

    // Store result
    this.userResults.push({
      categoryType: this.currentChallenge.type,
      isCorrect: isCorrect,
    });

    // Update score
    if (isCorrect) {
      this.correctAnswers++;
      console.log('✅ Correct answer!');
      // Play success sound and haptic
      await this.soundService.playSuccess();
    } else {
      console.log(
        '❌ Wrong answer. Correct was:',
        this.currentChallenge.correctAnswer
      );
      // Play error sound and haptic
      await this.soundService.playError();
    }

    // Show explanation after a brief delay
    setTimeout(() => {
      this.showExplanationCard = true;
      // Start countdown
      this.startCountdown();
    }, 300);

    // Auto-navigate after 3 seconds
    this.autoNavigateTimeout = setTimeout(() => {
      this.nextChallenge();
    }, 3000);
  }

  startCountdown() {
    this.countdownSeconds = 3;
    this.countdownInterval = setInterval(() => {
      this.countdownSeconds--;
      if (this.countdownSeconds <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  isOptionCorrect(index: number): boolean {
    return this.hasAnswered && index === this.currentChallenge.correctAnswer;
  }

  isOptionWrong(index: number): boolean {
    return (
      this.hasAnswered && index === this.selectedAnswer && !this.isCorrectAnswer
    );
  }

  isOptionDisabled(index: number): boolean {
    return (
      this.hasAnswered &&
      index !== this.currentChallenge.correctAnswer &&
      index !== this.selectedAnswer
    );
  }

  async nextChallenge() {
    // Clear auto-navigate timeout
    if (this.autoNavigateTimeout) {
      clearTimeout(this.autoNavigateTimeout);
      this.autoNavigateTimeout = null;
    }

    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // Move to next or finish
    if (this.currentIndex < this.challenges.length - 1) {
      this.currentIndex++;
      this.selectedAnswer = null;
      this.hasAnswered = false;
      this.isCorrectAnswer = false;
      this.showExplanationCard = false;
      this.countdownSeconds = 3;
    } else {
      await this.finishChallenges();
    }
  }

  async finishChallenges() {
    // Calculate time taken
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate XP (10 XP per correct answer)
    const xpEarned = this.correctAnswers * 10;

    // Only save to storage if it's daily mode
    if (this.mode === 'daily') {
      const result = {
        date: new Date().toISOString(),
        correct: this.correctAnswers,
        total: this.challenges.length,
        time: timeString,
        xp: xpEarned,
        challenges: this.challenges.map((c) => c.id),
      };

      this.storageService.saveDailyResult(result);
      console.log('Challenge completed:', result);
    }

    console.log('New progress:', this.storageService.getUserProgress());

    // Update progress for all categories at once
    this.categoryProgressService.updateMultipleCategories(this.userResults);

    // Save results for chart
    this.saveResults();

    // Navigate to results with data
    this.router.navigate(['/results'], {
      state: {
        correct: this.correctAnswers,
        total: this.challenges.length,
        time: timeString,
        xp: xpEarned,
        challenges: this.challenges,
        mode: this.mode,
        categoryName: this.categoryName,
      },
    });
  }

  // Call this when challenge completes
  saveResults() {
    const score = this.correctAnswers;
    const total = this.challenges.length;
    const accuracy = Math.round((score / total) * 100);

    // Save daily accuracy
    this.categoryProgressService.saveDailyAccuracy(accuracy);

    // Save to localStorage for chart
    this.saveToDailyChart(accuracy);
  }

  saveToDailyChart(accuracy: number) {
    const today = new Date().toISOString().split('T')[0];
    const dailyData = JSON.parse(localStorage.getItem('dailyAccuracy') || '{}');
    dailyData[today] = accuracy;
    localStorage.setItem('dailyAccuracy', JSON.stringify(dailyData));
  }

  async exitChallenge() {
    const alert = await this.alertController.create({
      header: 'Exit Challenge?',
      message: 'Your progress will be lost. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Exit',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/home']);
          },
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  }

  getProgressBarClass(index: number): string {
    if (index < this.currentIndex) return 'completed';
    if (index === this.currentIndex) return 'active';
    return 'pending';
  }

  getHeaderTitle(): string {
    if (this.mode === 'category' && this.categoryName) {
      return this.categoryName;
    }
    return 'Daily Challenge';
  }

  getHeaderIcon(): string {
    if (this.mode === 'category' && this.categoryIcon) {
      return this.categoryIcon;
    }
    return '';
  }
}
