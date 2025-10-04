import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GameStorageService } from 'src/app/services/game-storage-service/game-storage-service';

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
  
  easyBest: string | null = null;
  mediumBest: string | null = null;
  hardBest: string | null = null;

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
    
    const easyTime = this.gameStorage.getBestTime('easy');
    const mediumTime = this.gameStorage.getBestTime('medium');
    const hardTime = this.gameStorage.getBestTime('hard');
    
    this.easyBest = easyTime ? easyTime.toFixed(2) : null;
    this.mediumBest = mediumTime ? mediumTime.toFixed(2) : null;
    this.hardBest = hardTime ? hardTime.toFixed(2) : null;
  }

  hasBestScores(): boolean {
    return this.easyBest !== null || this.mediumBest !== null || this.hardBest !== null;
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

  startNumberTap() {
    this.router.navigate(['/games/number-tap']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
