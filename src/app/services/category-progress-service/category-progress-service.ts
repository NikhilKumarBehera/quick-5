import { Injectable } from '@angular/core';

export interface CategoryProgress {
  categoryType: string;
  categoryName: string;
  totalAttempts: number;
  correctAnswers: number;
  accuracy: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryProgressService {
  private readonly STORAGE_KEY = 'puzzle_category_progress';

  constructor() {
    this.initializeDefaultCategories();
  }

  // Initialize default categories if not exists
  private initializeDefaultCategories() {
    const existing = this.getAllProgress();
    if (Object.keys(existing).length === 0) {
      const defaultCategories = [
        { id: 'logic', name: 'Logic Puzzles' },
        { id: 'math', name: 'Math Challenges' },
        { id: 'pattern', name: 'Pattern Recognition' },
        { id: 'memory', name: 'Memory Games' },
        { id: 'speed', name: 'Speed Rounds' }
      ];

      defaultCategories.forEach(cat => {
        this.initializeCategory(cat.id, cat.name);
      });
    }
  }

  // Initialize a new category
  private initializeCategory(categoryType: string, categoryName: string) {
    const progress: CategoryProgress = {
      categoryType,
      categoryName,
      totalAttempts: 0,
      correctAnswers: 0,
      accuracy: 0,
      lastUpdated: new Date().toISOString()
    };
    this.saveProgress(categoryType, progress);
  }

  // Get all category progress
  getAllProgress(): { [categoryType: string]: CategoryProgress } {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  // Get specific category progress
  getCategoryProgress(categoryType: string): CategoryProgress | null {
    const allProgress = this.getAllProgress();
    return allProgress[categoryType] || null;
  }

  // Get category accuracy
  getCategoryAccuracy(categoryType: string): number {
    const progress = this.getCategoryProgress(categoryType);
    return progress ? progress.accuracy : 0;
  }

  // Save progress for a category
  private saveProgress(categoryType: string, progress: CategoryProgress) {
    const allProgress = this.getAllProgress();
    allProgress[categoryType] = progress;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
  }

  // Update progress when user completes a puzzle
  updateCategoryProgress(categoryType: string, isCorrect: boolean) {
    let progress = this.getCategoryProgress(categoryType);
    
    if (!progress) {
      // If category doesn't exist, create it
      const categoryName = this.getCategoryNameById(categoryType);
      this.initializeCategory(categoryType, categoryName);
      progress = this.getCategoryProgress(categoryType)!;
    }

    progress.totalAttempts += 1;
    if (isCorrect) {
      progress.correctAnswers += 1;
    }
    
    // Calculate accuracy (avoid division by zero)
    progress.accuracy = progress.totalAttempts > 0 
      ? Math.round((progress.correctAnswers / progress.totalAttempts) * 100)
      : 0;
    
    progress.lastUpdated = new Date().toISOString();
    
    this.saveProgress(categoryType, progress);
    return progress;
  }

  // Batch update - useful when completing multiple puzzles
  updateMultipleCategories(results: { categoryType: string, isCorrect: boolean }[]) {
    results.forEach(result => {
      this.updateCategoryProgress(result.categoryType, result.isCorrect);
    });
  }

  // Get category name by ID (you can expand this based on your categories)
  private getCategoryNameById(categoryType: string): string {
    const categoryMap: { [key: string]: string } = {
      'Logic': 'Logic Puzzles',
      'Math': 'Math Challenges',
      'Pattern': 'Pattern Recognition',
      'Memory': 'Memory Games',
      'Riddle': 'Brain Riddles'
    };
    return categoryMap[categoryType] || 'Unknown Category';
  }

  // Reset specific category progress
  resetCategoryProgress(categoryType: string) {
    const progress = this.getCategoryProgress(categoryType);
    if (progress) {
      progress.totalAttempts = 0;
      progress.correctAnswers = 0;
      progress.accuracy = 0;
      progress.lastUpdated = new Date().toISOString();
      this.saveProgress(categoryType, progress);
    }
  }

  // Reset all progress
  resetAllProgress() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeDefaultCategories();
  }

  // Get overall accuracy across all categories
  getOverallAccuracy(): number {
    const allProgress = this.getAllProgress();
    const categories = Object.values(allProgress);
    
    if (categories.length === 0) return 0;
    
    const totalAttempts = categories.reduce((sum, cat) => sum + cat.totalAttempts, 0);
    const totalCorrect = categories.reduce((sum, cat) => sum + cat.correctAnswers, 0);
    
    return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  }

  // Get statistics for dashboard
  getStatistics() {
    const allProgress = this.getAllProgress();
    const categories = Object.values(allProgress);
    
    return {
      totalAttempts: categories.reduce((sum, cat) => sum + cat.totalAttempts, 0),
      totalCorrect: categories.reduce((sum, cat) => sum + cat.correctAnswers, 0),
      overallAccuracy: this.getOverallAccuracy(),
      categoriesCount: categories.length,
      bestCategory: this.getBestCategory(),
      worstCategory: this.getWorstCategory()
    };
  }

  // Get best performing category
  getBestCategory(): CategoryProgress | null {
    const allProgress = this.getAllProgress();
    const categories = Object.values(allProgress).filter(cat => cat.totalAttempts > 0);
    
    if (categories.length === 0) return null;
    
    return categories.reduce((best, current) => 
      current.accuracy > best.accuracy ? current : best
    );
  }

  // Get worst performing category
  getWorstCategory(): CategoryProgress | null {
    const allProgress = this.getAllProgress();
    const categories = Object.values(allProgress).filter(cat => cat.totalAttempts > 0);
    
    if (categories.length === 0) return null;
    
    return categories.reduce((worst, current) => 
      current.accuracy < worst.accuracy ? current : worst
    );
  }

  // Export progress data (for backup)
  exportProgress(): string {
    return JSON.stringify(this.getAllProgress(), null, 2);
  }

  // Import progress data (from backup)
  importProgress(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }
}