import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GameStorageService } from 'src/app/services/game-storage-service/game-storage-service';

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  color: string;
  route: string;
  difficulties?: string[];
  isLocked?: boolean;
}

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit {
  isScrolled = false;
  private scrollThreshold = 180;
  totalGamesPlayed = 0;

  // Featured Game
  featuredGame: Game = {
    id: 'number-tap',
    name: 'Number Tap',
    icon: '🔢',
    description: 'Tap numbers 1 to N in order. Beat the clock!',
    badge: '⚡ Speed Challenge',
    color: '#8b5cf6',
    route: '/games/number-tap',
    difficulties: ['easy', 'medium', 'hard']
  };

  // Playable Games
  playableGames: Game[] = [
    {
      id: 'hangman',
      name: 'Hangman',
      icon: '🎯',
      description: 'Guess the word letter by letter',
      badge: '🧠 Word Game',
      color: '#8b5cf6',
      route: '/games/hangman',
      isLocked: false
    },
    {
      id: 'memory-game',
      name: 'Memory Game',
      icon: '🧠',
      description: 'Match pairs to win',
      badge: '✨ Reflex Challenge',
      color: '#667eea',
      route: '/games/memory-game',
      isLocked: false
    }
  ];

  // Upcoming Games
  upcomingGames: Game[] = [
    {
      id: 'memory-match',
      name: 'Memory Match',
      icon: '🧠',
      description: 'Match pairs to win',
      color: '#3b82f6',
      route: '',
      isLocked: true
    },
    {
      id: 'math-sprint',
      name: 'Math Sprint',
      icon: '➕',
      description: 'Quick calculations',
      color: '#10b981',
      route: '',
      isLocked: true
    },
    {
      id: 'word-puzzle',
      name: 'Word Puzzle',
      icon: '🔤',
      description: 'Find hidden words',
      color: '#f59e0b',
      route: '',
      isLocked: true
    },
    {
      id: 'color-match',
      name: 'Color Match',
      icon: '🎨',
      description: 'Match the colors',
      color: '#ec4899',
      route: '',
      isLocked: true
    }
  ];

  // Best scores for featured game
  bestScores: { [key: string]: string | null } = {
    easy: null,
    medium: null,
    hard: null
  };

  constructor(
    private router: Router,
    private gameStorage: GameStorageService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  ionViewWillEnter() {
    this.loadStats();
  }

  loadStats() {
    this.totalGamesPlayed = this.gameStorage.getTotalGamesPlayed();
    this.loadBestScores();
  }

  loadBestScores() {
    if (this.featuredGame.difficulties) {
      this.featuredGame.difficulties.forEach((difficulty) => {
        const typedDifficulty = difficulty as 'easy' | 'medium' | 'hard';
        const time = this.gameStorage.getBestTime(typedDifficulty);
        this.bestScores[difficulty] = time ? time.toFixed(2) : null;
      });
    }
  }

  hasBestScores(): boolean {
    return Object.values(this.bestScores).some(score => score !== null);
  }

  getBestScoreLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    
    // Buffer zone to prevent flickering
    if (scrollTop > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
    } else if (scrollTop < (this.scrollThreshold - 30) && this.isScrolled) {
      this.isScrolled = false;
    }
  }

  startFeaturedGame() {
    if (this.featuredGame.route) {
      this.router.navigate([this.featuredGame.route]);
    }
  }

  startGame(game: Game) {
    if (!game.isLocked && game.route) {
      this.router.navigate([game.route]);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}