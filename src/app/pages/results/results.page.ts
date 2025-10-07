import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Puzzle } from 'src/app/services/puzzle-service/puzzle-service';
import { SoundService } from 'src/app/services/sound-service/sound-service';
import { StorageService } from 'src/app/services/storage-service/storage-service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: false,
})
export class ResultsPage implements OnInit {
  correct: number = 0;
  total: number = 5;
  time: string = '0:00';
  xp: number = 0;
  newStreak: number = 0;
  accuracy: number = 0;
  challenges: Puzzle[] = [];
  totalXP: number = 0;
  userLevel: number = 1;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private soundService: SoundService
  ) {
    // Get results from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state;
      this.correct = state['correct'] || 0;
      this.total = state['total'] || 5;
      this.time = state['time'] || '0:00';
      this.xp = state['xp'] || 0;
      this.challenges = state['challenges'] || [];
    }
  }

  async ngOnInit() {
    await this.soundService.playChallengeCompleteSound();
    this.loadResults();
    this.calculateAccuracy();
  }

  loadResults() {
    // Get updated user progress from storage
    const progress = this.storageService.getUserProgress();
    if (progress) {
      this.newStreak = progress.streak;
      this.totalXP = progress.totalXP;
      this.userLevel = progress.level;
    }
    console.log('User progress after completion:', progress);
  }

  calculateAccuracy() {
    this.accuracy = Math.round((this.correct / this.total) * 100);
  }

  getResultTitle(): string {
    if (this.accuracy === 100) return 'Perfect Score! 🎉';
    if (this.accuracy >= 80) return 'Excellent Work! 🌟';
    if (this.accuracy >= 60) return 'Good Job! 👍';
    return 'Keep Practicing! 💪';
  }

  getResultMessage(): string {
    if (this.accuracy === 100) return 'You aced every challenge!';
    if (this.accuracy >= 80) return 'You completed today\'s challenge';
    if (this.accuracy >= 60) return 'You\'re making progress';
    return 'Every challenge makes you stronger';
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async shareResults() {
    const text = `I completed my Quick 5 brain challenge! 🧠\n${this.correct}/${this.total} correct in ${this.time}\nStreak: ${this.newStreak} days 🔥\nTotal XP: ${this.totalXP}`;
    
    // Try native share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quick 5 Results',
          text: text
        });
        console.log('Shared successfully');
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      this.copyToClipboard(text);
      alert('Results copied to clipboard! 📋');
    }
  }

  private copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  // View detailed results (optional feature)
  viewDetailedResults() {
    console.log('Challenge details:', this.challenges);
    // You can implement a modal or new page to show detailed results
  }

  // Check if new level reached
  isNewLevelReached(): boolean {
    const previousXP = this.totalXP - this.xp;
    const previousLevel = Math.floor(previousXP / 100) + 1;
    return this.userLevel > previousLevel;
  }
}