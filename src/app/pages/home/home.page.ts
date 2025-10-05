import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AchievementsService } from 'src/app/services/achievements-service/achievements-service';
import { CategoryProgressService } from 'src/app/services/category-progress-service/category-progress-service';
import { PuzzleService } from 'src/app/services/puzzle-service/puzzle-service';
import { StorageService } from 'src/app/services/storage-service/storage-service';

interface PuzzleCategory {
  type: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
  accuracy: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  streakDays: number = 0;
  totalCompleted: number = 0;
  weeklyCompleted: number = 0;
  accuracy: number = 0;
  isCompletedToday: boolean = false;
  userLevel: number = 1;
  totalXP: number = 0;
  isScrolled = false;

  challenges = [
    {
      type: 'Math',
      icon: '🧮',
      completed: false,
      color: 'primary',
    },
    {
      type: 'Memory',
      icon: '🧠',
      completed: false,
      color: 'secondary',
    },
    {
      type: 'Logic',
      icon: '🎯',
      completed: false,
      color: 'tertiary',
    },
    {
      type: 'Riddle',
      icon: '💡',
      completed: false,
      color: 'warning',
    },
    {
      type: 'Pattern',
      icon: '🔷',
      completed: false,
      color: 'success',
    },
  ];

  puzzleCategories: PuzzleCategory[] = [
    {
      type: 'Math',
      icon: '🧮',
      title: 'Math Puzzles',
      description: 'Test your numerical and arithmetic skills',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accuracy: 0,
    },
    {
      type: 'Memory',
      icon: '🧠',
      title: 'Memory Challenge',
      description: 'Boost your recall and retention abilities',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #e09cd6ff 100%)',
      accuracy: 0,
    },
    {
      type: 'Logic',
      icon: '🎯',
      title: 'Logic Puzzles',
      description: 'Sharpen your reasoning and deduction',
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      accuracy: 0,
    },
    {
      type: 'Riddle',
      icon: '💡',
      title: 'Brain Riddles',
      description: 'Solve creative thinking challenges',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      accuracy: 0,
    },
    {
      type: 'Pattern',
      icon: '🔷',
      title: 'Pattern Recognition',
      description: 'Identify sequences and visual patterns',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      accuracy: 0,
    },
  ];
  username: string = 'Learner';
  constructor(
    private router: Router,
    private storageService: StorageService,
    private puzzleService: PuzzleService,
    private categoryProgressService: CategoryProgressService,
    private achievementsService: AchievementsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCategoryAccuracies();
    this.loadOverallAccuracy();
    this.loadProgress();
    this.checkAchievements();

    // Load username
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.username = savedUsername;
    }
  }

  // Load accuracy for all categories from localStorage
  loadCategoryAccuracies() {
    this.puzzleCategories.forEach((category) => {
      const progress = this.categoryProgressService.getCategoryProgress(
        category.type
      );
      if (progress) {
        category.accuracy = progress.accuracy;
      }
    });
  }

  // Load overall accuracy
  loadOverallAccuracy() {
    this.accuracy = this.categoryProgressService.getOverallAccuracy();
  }

  ionViewWillEnter() {
    this.loadCategoryAccuracies();
    this.loadOverallAccuracy();
    this.loadProgress();
    this.checkAchievements();
  }

  loadProgress() {
    const progress = this.storageService.getUserProgress();

    if (progress) {
      this.streakDays = progress.streak;
      this.totalCompleted = progress.totalCompleted;
      this.accuracy = progress.accuracy;
      this.userLevel = progress.level;
      this.totalXP = progress.totalXP;
    }

    const weeklyStats = this.storageService.getWeeklyStats();
    this.weeklyCompleted = weeklyStats.completed;

    this.isCompletedToday = this.storageService.isCompletedToday();

    this.updateChallengeStatus();
  }

  updateChallengeStatus() {
    if (this.isCompletedToday) {
      this.challenges.forEach((c) => (c.completed = true));
    } else {
      this.challenges.forEach((c) => (c.completed = false));
    }
  }

  getCompletedCount(): number {
    return this.challenges.filter((c) => c.completed).length;
  }

  startChallenge() {
    if (this.isCompletedToday) {
      this.showCompletedMessage();
      return;
    }

    const dailyPuzzles = this.puzzleService.getDailyPuzzles();

    this.router.navigate(['/challenge'], {
      state: {
        puzzles: dailyPuzzles,
        mode: 'daily',
      },
    });
  }

  startCategoryChallenge(category: PuzzleCategory) {
    // Get 5 puzzles of the selected type
    const categoryPuzzles = this.puzzleService.getPuzzlesByType(category.type);

    // Shuffle and take 5
    const shuffled = categoryPuzzles.sort(() => Math.random() - 0.5);
    const selectedPuzzles = shuffled.slice(0, 5);

    if (selectedPuzzles.length === 0) {
      alert(`No ${category.type} puzzles available yet!`);
      return;
    }

    // Navigate to challenge with category-specific puzzles
    this.router.navigate(['/challenge'], {
      state: {
        puzzles: selectedPuzzles,
        mode: 'category',
        categoryName: category.title,
        categoryIcon: category.icon,
      },
    });
  }

  async showCompletedMessage() {
    alert(
      "You've already completed today's challenges! Come back tomorrow for more! 🎉"
    );
  }

  openAchievements() {
    console.log('Opening achievements...');
    this.router.navigate(['/achievements']);
  }

  // Add this method to check and update achievements
  checkAchievements() {
    const newlyUnlocked = this.achievementsService.checkAndUpdateAchievements(
      this.streakDays,
      this.totalCompleted
    );

    // Show notification for newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach((achievementId) => {
        this.showAchievementUnlocked(achievementId);
      });
    }
  }

  // Show achievement unlocked notification
  async showAchievementUnlocked(achievementId: string) {
    const achievements = this.achievementsService.getAllAchievements();
    const achievement = achievements.find((a) => a.id === achievementId);

    if (!achievement) return;

    const toast = await this.toastController.create({
      message: `🎉 Achievement Unlocked: ${achievement.title}!`,
      duration: 3000,
      position: 'top',
      color: 'success',
      cssClass: 'achievement-toast',
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.router.navigate(['/achievements']);
          },
        },
      ],
    });

    await toast.present();
  }

  resetProgress() {
    if (
      confirm(
        'Are you sure you want to reset all progress? This cannot be undone.'
      )
    ) {
      this.storageService.resetAllData();
      this.loadProgress();
      this.categoryProgressService.resetAllProgress();
      this.loadCategoryAccuracies();
      this.loadOverallAccuracy();
      this.checkAchievements();
      alert('Progress reset successfully!');
    }
  }

  exportData() {
    const data = this.storageService.exportData();
    console.log('Exported data:', data);

    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick5-backup.json';
    a.click();
  }

  // Handle scroll event
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isScrolled = scrollTop > 50;
  }

  // Get accuracy color based on percentage
  getAccuracyColor(accuracy: number): string {
    if (accuracy >= 80) {
      return '#10b981'; // Green
    } else if (accuracy >= 60) {
      return '#06d6a0'; // Teal
    } else if (accuracy >= 40) {
      return '#fbbf24'; // Amber
    } else if (accuracy >= 20) {
      return '#f97316'; // Orange
    } else {
      return '#ef4444'; // Red
    }
  }

  // Calculate circle stroke offset for progress
  getCircleOffset(accuracy: number): number {
    const circumference = 2 * Math.PI * 20; // radius = 20
    const offset = circumference - (accuracy / 100) * circumference;
    return offset;
  }

  goToGames() {
    this.router.navigate(['/games']);
  }
}
