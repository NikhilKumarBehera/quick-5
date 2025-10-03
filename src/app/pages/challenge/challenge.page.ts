import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Puzzle, PuzzleService } from 'src/app/services/puzzle-service/puzzle-service';
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

  constructor(
    private router: Router,
    private alertController: AlertController,
    private puzzleService: PuzzleService,
    private storageService: StorageService
  ) {
    // Get puzzles from navigation state or load new ones
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['puzzles']) {
      this.challenges = navigation.extras.state['puzzles'];
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

  selectAnswer(index: number) {
    this.selectedAnswer = index;
  }

  async nextChallenge() {
    if (this.selectedAnswer === null) return;

    // Record answer
    this.userAnswers.push(this.selectedAnswer);
    
    // Check if correct
    if (this.selectedAnswer === this.currentChallenge.correctAnswer) {
      this.correctAnswers++;
      console.log('✅ Correct answer!');
    } else {
      console.log('❌ Wrong answer. Correct was:', this.currentChallenge.correctAnswer);
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

    // Save results to storage
    const result = {
      date: new Date().toISOString(),
      correct: this.correctAnswers,
      total: this.challenges.length,
      time: timeString,
      xp: xpEarned,
      challenges: this.challenges.map(c => c.id)
    };

    this.storageService.saveDailyResult(result);

    console.log('Challenge completed:', result);
    console.log('New progress:', this.storageService.getUserProgress());
    
    // Navigate to results with data
    this.router.navigate(['/results'], {
      state: {
        correct: this.correctAnswers,
        total: this.challenges.length,
        time: timeString,
        xp: xpEarned,
        challenges: this.challenges
      }
    });
  }

  async exitChallenge() {
    const alert = await this.alertController.create({
      header: 'Exit Challenge?',
      message: 'Your progress will be lost. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Exit',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
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
}