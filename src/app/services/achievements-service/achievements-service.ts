import { Injectable } from '@angular/core';
import { CategoryProgressService } from '../category-progress-service/category-progress-service';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  category: 'streak' | 'accuracy' | 'completion' | 'speed' | 'mastery';
  color: string;
  gradient: string;
}

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  private readonly STORAGE_KEY = 'puzzle_achievements';
  
  private achievementDefinitions: Omit<Achievement, 'currentProgress' | 'isUnlocked' | 'unlockedDate'>[] = [
    // Streak Achievements
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: 'Complete 3 days in a row',
      icon: '🔥',
      requirement: 3,
      category: 'streak',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⚡',
      requirement: 7,
      category: 'streak',
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
    },
    {
      id: 'streak_30',
      title: 'Monthly Master',
      description: 'Achieve a 30-day streak',
      icon: '🌟',
      requirement: 30,
      category: 'streak',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'streak_100',
      title: 'Century Champion',
      description: 'Reach an incredible 100-day streak',
      icon: '👑',
      requirement: 100,
      category: 'streak',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    },

    // Accuracy Achievements
    {
      id: 'accuracy_70',
      title: 'Sharp Mind',
      description: 'Achieve 70% overall accuracy',
      icon: '🎯',
      requirement: 70,
      category: 'accuracy',
      color: '#06d6a0',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      id: 'accuracy_85',
      title: 'Precision Pro',
      description: 'Reach 85% overall accuracy',
      icon: '💎',
      requirement: 85,
      category: 'accuracy',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      id: 'accuracy_95',
      title: 'Perfect Mind',
      description: 'Achieve 95% overall accuracy',
      icon: '🏆',
      requirement: 95,
      category: 'accuracy',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #06d6a0 0%, #1de9b6 100%)'
    },

    // Completion Achievements
    {
      id: 'complete_50',
      title: 'Half Century',
      description: 'Complete 50 puzzles',
      icon: '📚',
      requirement: 50,
      category: 'completion',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'complete_100',
      title: 'Centurion',
      description: 'Solve 100 puzzles',
      icon: '📖',
      requirement: 100,
      category: 'completion',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'complete_500',
      title: 'Puzzle Master',
      description: 'Complete 500 puzzles',
      icon: '🎓',
      requirement: 500,
      category: 'completion',
      color: '#764ba2',
      gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)'
    },
    {
      id: 'complete_1000',
      title: 'Grand Master',
      description: 'Reach 1000 puzzles solved',
      icon: '🌠',
      requirement: 1000,
      category: 'completion',
      color: '#9333ea',
      gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)'
    },

    // Category Mastery
    {
      id: 'master_logic',
      title: 'Logic Legend',
      description: 'Get 90% accuracy in Logic',
      icon: '🧩',
      requirement: 90,
      category: 'mastery',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'master_math',
      title: 'Math Wizard',
      description: 'Get 90% accuracy in Math',
      icon: '🔢',
      requirement: 90,
      category: 'mastery',
      color: '#f5576c',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'master_pattern',
      title: 'Pattern Expert',
      description: 'Get 90% accuracy in Pattern',
      icon: '🎯',
      requirement: 90,
      category: 'mastery',
      color: '#00f2fe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'master_memory',
      title: 'Memory Champion',
      description: 'Get 90% accuracy in Memory',
      icon: '🧠',
      requirement: 90,
      category: 'mastery',
      color: '#38f9d7',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      id: 'master_speed',
      title: 'Speed Demon',
      description: 'Get 90% accuracy in Speed',
      icon: '⚡',
      requirement: 90,
      category: 'mastery',
      color: '#fee140',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },

    // Special Achievements
    {
      id: 'perfect_day',
      title: 'Perfect Day',
      description: 'Complete daily 5 with 100% accuracy',
      icon: '✨',
      requirement: 1,
      category: 'speed',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    },
    {
      id: 'all_categories',
      title: 'Well Rounded',
      description: 'Complete puzzles in all categories',
      icon: '🌈',
      requirement: 5,
      category: 'completion',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ];

  constructor(private categoryProgressService: CategoryProgressService) {
    this.initializeAchievements();
  }

  private initializeAchievements() {
    const stored = this.getStoredAchievements();
    if (Object.keys(stored).length === 0) {
      const initial: { [key: string]: Achievement } = {};
      this.achievementDefinitions.forEach(def => {
        initial[def.id] = {
          ...def,
          currentProgress: 0,
          isUnlocked: false
        };
      });
      this.saveAchievements(initial);
    }
  }

  private getStoredAchievements(): { [key: string]: Achievement } {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveAchievements(achievements: { [key: string]: Achievement }) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(achievements));
  }

  getAllAchievements(): Achievement[] {
    return Object.values(this.getStoredAchievements());
  }

  getAchievementsByCategory(category: string): Achievement[] {
    return this.getAllAchievements().filter(a => a.category === category);
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.isUnlocked);
  }

  getLockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => !a.isUnlocked);
  }

  getAchievementProgress(): { total: number, unlocked: number, percentage: number } {
    const all = this.getAllAchievements();
    const unlocked = all.filter(a => a.isUnlocked).length;
    return {
      total: all.length,
      unlocked: unlocked,
      percentage: Math.round((unlocked / all.length) * 100)
    };
  }

  // Check and update achievements based on current stats
  checkAndUpdateAchievements(streak: number, totalCompleted: number): string[] {
    const achievements = this.getStoredAchievements();
    const stats = this.categoryProgressService.getStatistics();
    const newlyUnlocked: string[] = [];

    Object.keys(achievements).forEach(key => {
      const achievement = achievements[key];
      if (achievement.isUnlocked) return;

      let currentProgress = 0;
      let shouldUnlock = false;

      switch (achievement.category) {
        case 'streak':
          currentProgress = streak;
          shouldUnlock = streak >= achievement.requirement;
          break;

        case 'accuracy':
          currentProgress = stats.overallAccuracy;
          shouldUnlock = stats.overallAccuracy >= achievement.requirement;
          break;

        case 'completion':
          currentProgress = totalCompleted;
          shouldUnlock = totalCompleted >= achievement.requirement;
          break;

        case 'mastery':
          // Check category-specific accuracy
          const categoryType = achievement.id.split('_')[1]; // e.g., 'master_logic' -> 'logic'
          const categoryProgress = this.categoryProgressService.getCategoryProgress(categoryType);
          currentProgress = categoryProgress ? categoryProgress.accuracy : 0;
          shouldUnlock = currentProgress >= achievement.requirement;
          break;

        case 'speed':
          // Special achievements - handle separately
          if (achievement.id === 'all_categories') {
            const allProgress = this.categoryProgressService.getAllProgress();
            const categoriesWithAttempts = Object.values(allProgress).filter(p => p.totalAttempts > 0).length;
            currentProgress = categoriesWithAttempts;
            shouldUnlock = categoriesWithAttempts >= achievement.requirement;
          }
          break;
      }

      achievement.currentProgress = currentProgress;

      if (shouldUnlock && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        achievement.unlockedDate = new Date().toISOString();
        newlyUnlocked.push(achievement.id);
      }
    });

    this.saveAchievements(achievements);
    return newlyUnlocked;
  }

  // Mark special achievements
  unlockSpecialAchievement(achievementId: string) {
    const achievements = this.getStoredAchievements();
    if (achievements[achievementId] && !achievements[achievementId].isUnlocked) {
      achievements[achievementId].isUnlocked = true;
      achievements[achievementId].unlockedDate = new Date().toISOString();
      achievements[achievementId].currentProgress = achievements[achievementId].requirement;
      this.saveAchievements(achievements);
      return true;
    }
    return false;
  }

  resetAchievements() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeAchievements();
  }
}