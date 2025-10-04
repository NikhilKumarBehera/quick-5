import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Achievement,
  AchievementsService,
} from 'src/app/services/achievements-service/achievements-service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
  standalone: false,
})
export class AchievementsPage implements OnInit {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;

  selectedCategory: string = 'all';
  allAchievements: Achievement[] = [];
  isScrolled = false;
  private scrollThreshold = 180;
  progress = {
    total: 0,
    unlocked: 0,
    percentage: 0,
  };

  constructor(
    private router: Router,
    private achievementsService: AchievementsService
  ) {}

  ngOnInit() {
    this.loadAchievements();
  }

  ngAfterViewInit() {
    // Initial scroll position
    setTimeout(() => {
      this.scrollToActiveButton();
    }, 100);
  }

  ionViewWillEnter() {
    this.loadAchievements();
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;

    // Use threshold with buffer zone to prevent flickering
    if (scrollTop > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
    } else if (scrollTop < this.scrollThreshold - 30 && this.isScrolled) {
      // 30px buffer zone prevents rapid toggling
      this.isScrolled = false;
    }
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    setTimeout(() => {
      this.scrollToActiveButton();
    }, 50);
  }

  scrollToActiveButton() {
    if (!this.tabsContainer) return;

    const container = this.tabsContainer.nativeElement;
    const activeButton = container.querySelector('.segment-button-checked');

    if (activeButton) {
      const containerWidth = container.offsetWidth;
      const buttonLeft = (activeButton as HTMLElement).offsetLeft;
      const buttonWidth = (activeButton as HTMLElement).offsetWidth;

      // Calculate scroll position to center the active button
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }

  loadAchievements() {
    this.allAchievements = this.achievementsService.getAllAchievements();
    this.progress = this.achievementsService.getAchievementProgress();
  }

  getFilteredUnlocked(): Achievement[] {
    const unlocked = this.achievementsService.getUnlockedAchievements();
    if (this.selectedCategory === 'all') {
      return unlocked;
    }
    return unlocked.filter((a) => a.category === this.selectedCategory);
  }

  getFilteredLocked(): Achievement[] {
    const locked = this.achievementsService.getLockedAchievements();
    if (this.selectedCategory === 'all') {
      return locked;
    }
    return locked.filter((a) => a.category === this.selectedCategory);
  }

  getProgressPercentage(achievement: Achievement): number {
    if (achievement.requirement === 0) return 0;
    const percentage =
      (achievement.currentProgress / achievement.requirement) * 100;
    return Math.min(percentage, 100);
  }

  getProgressOffset(): number {
    const circumference = 2 * Math.PI * 40;
    const offset =
      circumference - (this.progress.percentage / 100) * circumference;
    return offset;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Unlocked today';
    } else if (diffDays === 1) {
      return 'Unlocked yesterday';
    } else if (diffDays < 7) {
      return `Unlocked ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Unlocked ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Unlocked ${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
