import { Injectable } from '@angular/core';

export interface UserProgress {
  streak: number;
  totalCompleted: number;
  lastCompleted: string;
  bestStreak: number;
  totalXP: number;
  level: number;
  accuracy: number;
  completedChallenges: string[];
}

export interface DailyResult {
  date: string;
  correct: number;
  total: number;
  time: string;
  xp: number;
  challenges: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    USER_PROGRESS: 'userProgress',
    DAILY_RESULTS: 'dailyResults',
    LAST_COMPLETED: 'lastCompleted',
    STREAK: 'streak',
    TOTAL_COMPLETED: 'totalCompleted'
  };

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage with default values
   */
  private initializeStorage(): void {
    if (!this.getUserProgress()) {
      const defaultProgress: UserProgress = {
        streak: 0,
        totalCompleted: 0,
        lastCompleted: '',
        bestStreak: 0,
        totalXP: 0,
        level: 1,
        accuracy: 0,
        completedChallenges: []
      };
      this.saveUserProgress(defaultProgress);
    }
  }

  /**
   * Get user progress
   */
  getUserProgress(): UserProgress | null {
    const data = localStorage.getItem(this.STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Save user progress
   */
  saveUserProgress(progress: UserProgress): void {
    localStorage.setItem(this.STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  }

  /**
   * Update streak
   */
  updateStreak(): void {
    const progress = this.getUserProgress();
    if (!progress) return;

    const today = new Date().toDateString();
    const lastCompleted = new Date(progress.lastCompleted).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastCompleted === today) {
      // Already completed today
      return;
    } else if (lastCompleted === yesterday) {
      // Continuing streak
      progress.streak++;
    } else {
      // Streak broken, start over
      progress.streak = 1;
    }

    // Update best streak
    if (progress.streak > progress.bestStreak) {
      progress.bestStreak = progress.streak;
    }

    progress.lastCompleted = today;
    this.saveUserProgress(progress);
  }

  /**
   * Save daily result
   */
  saveDailyResult(result: DailyResult): void {
    const results = this.getDailyResults();
    results.push(result);
    
    // Keep only last 30 days
    if (results.length > 30) {
      results.shift();
    }

    localStorage.setItem(this.STORAGE_KEYS.DAILY_RESULTS, JSON.stringify(results));

    // Update user progress
    this.updateProgress(result);
  }

  /**
   * Get all daily results
   */
  getDailyResults(): DailyResult[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.DAILY_RESULTS);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get today's result
   */
  getTodayResult(): DailyResult | null {
    const results = this.getDailyResults();
    const today = new Date().toDateString();
    return results.find(r => new Date(r.date).toDateString() === today) || null;
  }

  /**
   * Update user progress after completing challenges
   */
  private updateProgress(result: DailyResult): void {
    const progress = this.getUserProgress();
    if (!progress) return;

    progress.totalCompleted += result.correct;
    progress.totalXP += result.xp;
    progress.completedChallenges.push(...result.challenges);

    // Calculate overall accuracy
    const allResults = this.getDailyResults();
    const totalCorrect = allResults.reduce((sum, r) => sum + r.correct, 0);
    const totalQuestions = allResults.reduce((sum, r) => sum + r.total, 0);
    progress.accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Calculate level based on XP (100 XP per level)
    progress.level = Math.floor(progress.totalXP / 100) + 1;

    this.updateStreak();
    this.saveUserProgress(progress);
  }

  /**
   * Check if challenges completed today
   */
  isCompletedToday(): boolean {
    const progress = this.getUserProgress();
    if (!progress) return false;

    const today = new Date().toDateString();
    const lastCompleted = new Date(progress.lastCompleted).toDateString();
    
    return lastCompleted === today;
  }

  /**
   * Get current streak
   */
  getStreak(): number {
    const progress = this.getUserProgress();
    return progress ? progress.streak : 0;
  }

  /**
   * Get total XP
   */
  getTotalXP(): number {
    const progress = this.getUserProgress();
    return progress ? progress.totalXP : 0;
  }

  /**
   * Get user level
   */
  getLevel(): number {
    const progress = this.getUserProgress();
    return progress ? progress.level : 1;
  }

  /**
   * Get weekly stats
   */
  getWeeklyStats(): { completed: number; accuracy: number } {
    const results = this.getDailyResults();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const weekResults = results.filter(r => new Date(r.date).getTime() > oneWeekAgo);
    
    const completed = weekResults.length;
    const totalCorrect = weekResults.reduce((sum, r) => sum + r.correct, 0);
    const totalQuestions = weekResults.reduce((sum, r) => sum + r.total, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return { completed, accuracy };
  }

  /**
   * Reset all data (for testing or user request)
   */
  resetAllData(): void {
    localStorage.clear();
    this.initializeStorage();
  }

  /**
   * Export data as JSON (for backup)
   */
  exportData(): string {
    return JSON.stringify({
      progress: this.getUserProgress(),
      results: this.getDailyResults()
    });
  }

  /**
   * Import data from JSON (for restore)
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.progress) {
        this.saveUserProgress(data.progress);
      }
      if (data.results) {
        localStorage.setItem(this.STORAGE_KEYS.DAILY_RESULTS, JSON.stringify(data.results));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}