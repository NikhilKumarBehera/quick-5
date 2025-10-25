// src/app/pages/games/hangman/hangman.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SoundService } from 'src/app/services/sound-service/sound-service';
import { HangmanWord, wordDatabase } from './constants/hangman.constants';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.page.html',
  styleUrls: ['./hangman.page.scss'],
  standalone: false,
})
export class HangmanPage implements OnInit {
  // Word database
  private wordDatabase = wordDatabase;

  // QWERTY keyboard layout
  qwertyRow1: string[] = 'QWERTYUIOP'.split('');
  qwertyRow2: string[] = 'ASDFGHJKL'.split('');
  qwertyRow3: string[] = 'ZXCVBNM'.split('');

  // Game state
  currentWord!: HangmanWord;
  displayWord: string[] = [];
  guessedLetters: string[] = [];
  wrongGuesses: number = 0;
  maxWrongGuesses: number = 6;
  gameStatus: 'playing' | 'won' | 'lost' = 'playing';
  score: number = 0;
  hintsUsed: number = 0;
  totalGames: number = 0;
  
  // UI state
  showHint: boolean = false;
  animatingLetter: string = '';
  isScrolled: boolean = false;
  showCelebration: boolean = false;
  showFall: boolean = false;
  showGameOverModal: boolean = false;

  private scrollThreshold = 100;

  constructor(
    private router: Router,
    private soundService: SoundService
  ) {}

  ngOnInit() {
    this.startNewGame();
  }

  startNewGame() {
    // Select random word
    const randomIndex = Math.floor(Math.random() * this.wordDatabase.length);
    this.currentWord = this.wordDatabase[randomIndex];
    
    // Initialize display word with underscores
    this.displayWord = Array(this.currentWord.word.length).fill('_');
    
    // Reset game state
    this.guessedLetters = [];
    this.wrongGuesses = 0;
    this.gameStatus = 'playing';
    this.showHint = false;
    this.animatingLetter = '';
    this.showCelebration = false;
    this.showFall = false;
    this.showGameOverModal = false;
    
    console.log('Secret word:', this.currentWord.word); // For testing
  }

  async guessLetter(letter: string) {
    if (this.gameStatus !== 'playing' || this.guessedLetters.includes(letter)) {
      return;
    }

    this.animatingLetter = letter;
    this.guessedLetters.push(letter);
    await this.soundService.playClick();

    // Check if letter is in word
    const isCorrect = this.currentWord.word.includes(letter);

    if (isCorrect) {
      // Reveal all instances of the letter
      for (let i = 0; i < this.currentWord.word.length; i++) {
        if (this.currentWord.word[i] === letter) {
          this.displayWord[i] = letter;
        }
      }
      
      await this.soundService.playSuccess();
      
      // Check if won
      if (!this.displayWord.includes('_')) {
        await this.winGame();
      }
    } else {
      this.wrongGuesses++;
      await this.soundService.playError();
      
      // Check if lost
      if (this.wrongGuesses >= this.maxWrongGuesses) {
        await this.loseGame();
      }
    }

    // Clear animation after delay
    setTimeout(() => {
      this.animatingLetter = '';
    }, 500);
  }

  async winGame() {
    this.gameStatus = 'won';
    this.totalGames++;
    
    // Calculate score
    const points = 100 - (this.wrongGuesses * 10) - (this.hintsUsed * 20);
    this.score += Math.max(points, 10);
    
    // Show celebration animation
    this.showCelebration = true;
    await this.soundService.playChallengeComplete();
    
    // Wait for animation, then show modal
    setTimeout(() => {
      this.showGameOverModal = true;
    }, 2500);
  }

  async loseGame() {
    this.gameStatus = 'lost';
    this.totalGames++;
    
    // Reveal the word
    this.displayWord = this.currentWord.word.split('');
    
    // Show fall animation
    this.showFall = true;
    await this.soundService.playError();
    
    // Wait for animation, then show modal
    setTimeout(() => {
      this.showGameOverModal = true;
    }, 2500);
  }

  toggleHint() {
    if (!this.showHint && this.gameStatus === 'playing') {
      this.hintsUsed++;
      this.soundService.playClick();
    }
    this.showHint = !this.showHint;
  }

  isLetterGuessed(letter: string): boolean {
    return this.guessedLetters.includes(letter);
  }

  isLetterCorrect(letter: string): boolean {
    return this.guessedLetters.includes(letter) && this.currentWord.word.includes(letter);
  }

  isLetterWrong(letter: string): boolean {
    return this.guessedLetters.includes(letter) && !this.currentWord.word.includes(letter);
  }

  async playAgain() {
    await this.soundService.playClick();
    this.startNewGame();
  }

  goBack() {
    this.soundService.playClick();
    this.router.navigate(['/games']);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    
    if (scrollTop > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
    } else if (scrollTop < (this.scrollThreshold - 30) && this.isScrolled) {
      this.isScrolled = false;
    }
  }
}