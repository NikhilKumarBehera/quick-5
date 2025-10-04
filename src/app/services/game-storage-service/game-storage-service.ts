// Create this file: src/app/services/game-storage.service.ts
import { Injectable } from '@angular/core';

export interface GameStats {
  easyBestTime: number | null;
  mediumBestTime: number | null;
  hardBestTime: number | null;
  totalGamesPlayed: number;
  easyGamesPlayed: number;
  mediumGamesPlayed: number;
  hardGamesPlayed: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameStorageService {
  private storageKey = 'numberTapGameStats';

  constructor() {
    this.initializeStats();
  }

  private initializeStats() {
    const stats = this.getStats();
    if (!stats.totalGamesPlayed) {
      const initialStats: GameStats = {
        easyBestTime: null,
        mediumBestTime: null,
        hardBestTime: null,
        totalGamesPlayed: 0,
        easyGamesPlayed: 0,
        mediumGamesPlayed: 0,
        hardGamesPlayed: 0
      };
      this.saveStats(initialStats);
    }
  }

  getStats(): GameStats {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return JSON.parse(data);
    }
    return {
      easyBestTime: null,
      mediumBestTime: null,
      hardBestTime: null,
      totalGamesPlayed: 0,
      easyGamesPlayed: 0,
      mediumGamesPlayed: 0,
      hardGamesPlayed: 0
    };
  }

  private saveStats(stats: GameStats) {
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
  }

  saveGameResult(difficulty: 'easy' | 'medium' | 'hard', time: number) {
    const stats = this.getStats();
    
    // Update total games played
    stats.totalGamesPlayed++;
    
    // Update difficulty-specific games played
    if (difficulty === 'easy') {
      stats.easyGamesPlayed++;
      if (stats.easyBestTime === null || time < stats.easyBestTime) {
        stats.easyBestTime = time;
      }
    } else if (difficulty === 'medium') {
      stats.mediumGamesPlayed++;
      if (stats.mediumBestTime === null || time < stats.mediumBestTime) {
        stats.mediumBestTime = time;
      }
    } else if (difficulty === 'hard') {
      stats.hardGamesPlayed++;
      if (stats.hardBestTime === null || time < stats.hardBestTime) {
        stats.hardBestTime = time;
      }
    }
    
    this.saveStats(stats);
  }

  getBestTime(difficulty: 'easy' | 'medium' | 'hard'): number | null {
    const stats = this.getStats();
    if (difficulty === 'easy') return stats.easyBestTime;
    if (difficulty === 'medium') return stats.mediumBestTime;
    if (difficulty === 'hard') return stats.hardBestTime;
    return null;
  }

  getTotalGamesPlayed(): number {
    return this.getStats().totalGamesPlayed;
  }

  getGamesPlayedByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): number {
    const stats = this.getStats();
    if (difficulty === 'easy') return stats.easyGamesPlayed;
    if (difficulty === 'medium') return stats.mediumGamesPlayed;
    if (difficulty === 'hard') return stats.hardGamesPlayed;
    return 0;
  }

  resetStats() {
    const initialStats: GameStats = {
      easyBestTime: null,
      mediumBestTime: null,
      hardBestTime: null,
      totalGamesPlayed: 0,
      easyGamesPlayed: 0,
      mediumGamesPlayed: 0,
      hardGamesPlayed: 0
    };
    this.saveStats(initialStats);
  }
}