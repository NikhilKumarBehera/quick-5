import { Injectable } from '@angular/core';
import { MathPuzzles } from './constants/math-puzzles';
import { MemoryPuzzles } from './constants/memory-puzzles';
import { LogicPuzzles } from './constants/logic-puzzles';
import { RiddlePuzzles } from './constants/riddle-puzzles';
import { PatternPuzzles } from './constants/pattern-puzzles';

export interface Puzzle {
  id: string;
  type: 'Math' | 'Memory' | 'Logic' | 'Riddle' | 'Pattern';
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PuzzleService {
  // Define the Puzzle interface (assuming this is already defined in your project)
  private puzzleBank: Puzzle[] = [
    ...MathPuzzles,
    ...MemoryPuzzles,
    ...LogicPuzzles,
    ...RiddlePuzzles,
    ...PatternPuzzles,
  ];

  constructor() {}

  /**
   * Get daily set of 5 puzzles (one from each category)
   */
  getDailyPuzzles(): Puzzle[] {
    const categories = ['Math', 'Memory', 'Logic', 'Riddle', 'Pattern'];
    const dailyPuzzles: Puzzle[] = [];

    categories.forEach((category) => {
      const categoryPuzzles = this.puzzleBank.filter(
        (p) => p.type === category
      );
      const randomPuzzle =
        categoryPuzzles[Math.floor(Math.random() * categoryPuzzles.length)];
      dailyPuzzles.push(randomPuzzle);
    });

    return dailyPuzzles;
  }

  /**
   * Get puzzles by difficulty
   */
  getPuzzlesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Puzzle[] {
    return this.puzzleBank.filter((p) => p.difficulty === difficulty);
  }

  /**
   * Get puzzles by type
   */
  getPuzzlesByType(type: string): Puzzle[] {
    return this.puzzleBank.filter((p) => p.type === type);
  }

  /**
   * Get random puzzle
   */
  getRandomPuzzle(): Puzzle {
    return this.puzzleBank[Math.floor(Math.random() * this.puzzleBank.length)];
  }

  /**
   * Get all puzzles
   */
  getAllPuzzles(): Puzzle[] {
    return this.puzzleBank;
  }

  /**
   * Add custom puzzle
   */
  addPuzzle(puzzle: Puzzle): void {
    this.puzzleBank.push(puzzle);
  }
}
