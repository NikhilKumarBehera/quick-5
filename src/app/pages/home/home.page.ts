import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle-service/puzzle-service';
import { StorageService } from 'src/app/services/storage-service/storage-service';


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

  constructor(
    private router: Router,
    private storageService: StorageService,
    private puzzleService: PuzzleService 
  ) {}

  ngOnInit() {
    this.loadProgress();
  }

  ionViewWillEnter() {
    // Reload progress every time the page is entered
    this.loadProgress();
  }

  loadProgress() {
    // Get user progress from storage
    const progress = this.storageService.getUserProgress();
    
    if (progress) {
      this.streakDays = progress.streak;
      this.totalCompleted = progress.totalCompleted;
      this.accuracy = progress.accuracy;
      this.userLevel = progress.level;
      this.totalXP = progress.totalXP;
    }

    // Get weekly stats
    const weeklyStats = this.storageService.getWeeklyStats();
    this.weeklyCompleted = weeklyStats.completed;

    // Check if user completed challenges today
    this.isCompletedToday = this.storageService.isCompletedToday();

    // Update challenge completion status
    this.updateChallengeStatus();
  }

  updateChallengeStatus() {
    if (this.isCompletedToday) {
      // Mark all challenges as completed
      this.challenges.forEach(c => c.completed = true);
    } else {
      // Reset for new day
      this.challenges.forEach(c => c.completed = false);
    }
  }

  getCompletedCount(): number {
    return this.challenges.filter(c => c.completed).length;
  }

  startChallenge() {
    if (this.isCompletedToday) {
      // Show message that challenges are already completed
      this.showCompletedMessage();
      return;
    }

    // Get daily puzzles from puzzle service
    const dailyPuzzles = this.puzzleService.getDailyPuzzles();
    
    // Navigate to challenge page with puzzles
    this.router.navigate(['/challenge'], {
      state: {
        puzzles: dailyPuzzles
      }
    });
  }

  async showCompletedMessage() {
    // You can use AlertController or ToastController here
    alert('You\'ve already completed today\'s challenges! Come back tomorrow for more! 🎉');
  }

  openAchievements() {
    // Navigate to achievements page (to be implemented)
    console.log('Opening achievements...');
    // this.router.navigate(['/achievements']);
  }

  // Method to reset progress (for testing)
  resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      this.storageService.resetAllData();
      this.loadProgress();
      alert('Progress reset successfully!');
    }
  }

  // Method to export data
  exportData() {
    const data = this.storageService.exportData();
    console.log('Exported data:', data);
    
    // You can implement file download here
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick5-backup.json';
    a.click();
  }
}