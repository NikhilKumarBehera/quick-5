/**
 * Memory Game Example Page
 * Demonstrates the Memory Game component with integration patterns
 */

import { Component, OnInit } from '@angular/core';
import { GameScore } from '../../../shared/components/memory-game/memory-game.component';

@Component({
  selector: 'app-memory-game-example',
  templateUrl: './memory-game-example.page.html',
  styleUrls: ['./memory-game-example.page.scss'],
})
export class MemoryGameExamplePage implements OnInit {
  /**
   * Current difficulty level
   */
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';

  /**
   * Last game score
   */
  lastScore: GameScore | null = null;

  /**
   * Difficulty presets for selection
   */
  difficultyOptions = [
    { label: 'Easy', value: 'easy' as const },
    { label: 'Medium', value: 'medium' as const },
    { label: 'Hard', value: 'hard' as const },
  ];

  /**
   * Show hints during gameplay
   */
  showHints: boolean = false;

  /**
   * Enable sound effects
   */
  enableSounds: boolean = true;

  constructor() {}

  ngOnInit(): void {
    console.log('Memory Game Example Page Loaded');
  }

  /**
   * Handle game completion
   * @param score - Final game score
   */
  onGameComplete(score: GameScore): void {
    console.log('Game completed:', score);
    this.lastScore = score;

    // Could also emit to parent component or send to backend
    // this.gameService.submitScore(score).subscribe(...);
  }

  /**
   * Handle score updates during gameplay
   * @param score - Current game score
   */
  onScoreUpdate(score: GameScore): void {
    console.log('Score updated:', score);
    // Could track score progression
  }

  /**
   * Change difficulty level
   * @param level - New difficulty level
   */
  changeDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
  }
}
