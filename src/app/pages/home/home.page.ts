import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle-service/puzzle-service';
import { StorageService } from 'src/app/services/storage-service/storage-service';

interface PuzzleCategory {
  type: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  streakDays: number = 0;
  totalCompleted: number = 0;
  weeklyCompleted: number = 0;
  accuracy: number = 0;
  isCompletedToday: boolean = false;
  userLevel: number = 1;
  totalXP: number = 0;
  
  challenges = [
    { 
      type: 'Math', 
      icon: '🧮',
      completed: false,
      color: 'primary'
    },
    { 
      type: 'Memory', 
      icon: '🧠',
      completed: false,
      color: 'secondary'
    },
    { 
      type: 'Logic', 
      icon: '🎯',
      completed: false,
      color: 'tertiary'
    },
    { 
      type: 'Riddle', 
      icon: '💡',
      completed: false,
      color: 'warning'
    },
    { 
      type: 'Pattern', 
      icon: '🔷',
      completed: false,
      color: 'success'
    }
  ];

  puzzleCategories: PuzzleCategory[] = [
    {
      type: 'Math',
      icon: '🧮',
      title: 'Math Puzzles',
      description: 'Test your numerical and arithmetic skills',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
      type: 'Memory',
      icon: '🧠',
      title: 'Memory Challenge',
      description: 'Boost your recall and retention abilities',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
    },
    {
      type: 'Logic',
      icon: '🎯',
      title: 'Logic Puzzles',
      description: 'Sharpen your reasoning and deduction',
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)'
    },
    {
      type: 'Riddle',
      icon: '💡',
      title: 'Brain Riddles',
      description: 'Solve creative thinking challenges',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    },
    {
      type: 'Pattern',
      icon: '🔷',
      title: 'Pattern Recognition',
      description: 'Identify sequences and visual patterns',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    }
  ];

  constructor(
    private router: Router,
    private storageService: StorageService,
    private puzzleService: PuzzleService
  ) {}

  ngOnInit() {
    this.loadProgress();
  }

  ionViewWillEnter() {
    this.loadProgress();
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
      this.challenges.forEach(c => c.completed = true);
    } else {
      this.challenges.forEach(c => c.completed = false);
    }
  }

  getCompletedCount(): number {
    return this.challenges.filter(c => c.completed).length;
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
        mode: 'daily'
      }
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
        categoryIcon: category.icon
      }
    });
  }

  async showCompletedMessage() {
    alert('You\'ve already completed today\'s challenges! Come back tomorrow for more! 🎉');
  }

  openAchievements() {
    console.log('Opening achievements...');
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      this.storageService.resetAllData();
      this.loadProgress();
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
}