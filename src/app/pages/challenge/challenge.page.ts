import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CategoryProgressService } from 'src/app/services/category-progress-service/category-progress-service';
import {
  Puzzle,
  PuzzleService,
} from 'src/app/services/puzzle-service/puzzle-service';
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

  constructor(
    private router: Router,
    private alertController: AlertController,
    private puzzleService: PuzzleService,
    private storageService: StorageService,
    private categoryProgressService: CategoryProgressService
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

  selectAnswer(index: number) {
    this.selectedAnswer = index;
  }

  async nextChallenge() {
    if (this.selectedAnswer === null) return;

    // Record answer
    this.userAnswers.push(this.selectedAnswer);

    // Store result
    this.userResults.push({
      categoryType: this.currentChallenge.type,
      isCorrect: this.selectedAnswer === this.currentChallenge.correctAnswer,
    });

    // Check if correct
    if (this.selectedAnswer === this.currentChallenge.correctAnswer) {
      this.correctAnswers++;
      console.log('✅ Correct answer!');
    } else {
      console.log(
        '❌ Wrong answer. Correct was:',
        this.currentChallenge.correctAnswer
      );
    }

    // Move to next or finish
    if (this.currentIndex < this.challenges.length - 1) {
      this.currentIndex++;
      this.selectedAnswer = null;
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

  // Show explanation after answering (optional feature)
  showExplanation() {
    if (this.currentChallenge.explanation) {
      alert(this.currentChallenge.explanation);
    }
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
