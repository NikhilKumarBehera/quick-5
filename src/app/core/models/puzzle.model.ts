/**
 * Puzzle Model
 * Core data model for puzzle/challenge items
 */
export interface Puzzle {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: PuzzleCategory;
  difficulty: DifficultyLevel;
  explanation?: string;
  timeLimit?: number; // in seconds
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PuzzleCategory {
  MATH = 'math',
  CODE_CRACKER = 'code-cracker',
  LOGIC = 'logic',
  RIDDLE = 'riddle',
  WORD = 'word',
  PATTERN = 'pattern'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface PuzzleCategoryConfig {
  type: PuzzleCategory;
  icon: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
  accuracy?: number;
}

export interface UserAnswerRecord {
  puzzleId: string;
  categoryType: PuzzleCategory;
  isCorrect: boolean;
  timestamp: number;
  timeSpent?: number; // in seconds
}

export interface ChallengeSession {
  id: string;
  category: PuzzleCategory;
  mode: 'daily' | 'practice' | 'timed';
  startTime: number;
  endTime?: number;
  puzzles: Puzzle[];
  currentIndex: number;
  correctAnswers: number;
  answers: UserAnswerRecord[];
  totalTime?: number;
}
