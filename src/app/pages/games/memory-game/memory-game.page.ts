import { Component, OnInit } from '@angular/core';
import { GameScore } from 'src/app/shared/components/memory-game/memory-game.component';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.page.html',
  styleUrls: ['./memory-game.page.scss'],
  standalone: false,
})
export class MemoryGamePage implements OnInit {
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  lastScore: GameScore | null = null;

  difficultyOptions = [
    { label: 'Easy', value: 'easy' as const },
    { label: 'Medium', value: 'medium' as const },
    { label: 'Hard', value: 'hard' as const },
  ];

  showHints: boolean = false;
  enableSounds: boolean = true;

  constructor() {}

  ngOnInit(): void {
    console.log('Memory Game Page Loaded');
  }

  onGameComplete(score: GameScore): void {
    console.log('Game completed:', score);
    this.lastScore = score;
  }

  onScoreUpdate(score: GameScore): void {
    console.log('Score updated:', score);
  }

  changeDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
  }
}
