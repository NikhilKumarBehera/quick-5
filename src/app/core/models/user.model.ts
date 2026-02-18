/**
 * User Model
 * Core user profile and statistics
 */

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  level: number;
  totalXP: number;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserStatistics {
  userId: string;
  totalChallengesCompleted: number;
  weeklyCompleted: number;
  currentStreakDays: number;
  bestStreakDays: number;
  totalTimeSpent: number; // in seconds
  overallAccuracy: number; // 0-100
  categoryAccuracies: Map<string, number>;
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  totalPoints: number;
  lastUpdated: Date;
}

export interface Leaderboard {
  userId: string;
  username: string;
  level: number;
  totalXP: number;
  streak: number;
  accuracy: number;
  rank?: number;
}
