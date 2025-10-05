import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideUpFade', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class SplashPage implements OnInit {
  showUsernameModal = false;
  showWelcomeBack = false;
  username = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Don't auto-navigate, always show splash
  }

  getStarted() {
    const savedUsername = localStorage.getItem('username');
    
    if (savedUsername) {
      // Existing user - show personalized greeting
      this.username = savedUsername;
      this.showWelcomeBack = true;
      
      // Wait 2 seconds, then navigate with slide up transition
      setTimeout(() => {
        this.navigateToHome();
      }, 2000);
    } else {
      // New user - show username modal
      this.showUsernameModal = true;
    }
  }

  saveUsername() {
    if (!this.username || this.username.trim().length === 0) {
      return;
    }

    // Save username to localStorage
    localStorage.setItem('username', this.username.trim());
    localStorage.setItem('onboardingComplete', 'true');

    // Show welcome message briefly
    this.showUsernameModal = false;
    this.showWelcomeBack = true;

    // Navigate after 2 seconds
    setTimeout(() => {
      this.navigateToHome();
    }, 2000);
  }

  navigateToHome() {
    // Navigate with custom animation using Ionic's animation controller
    const animation = {
      animated: true,
      animationDirection: 'forward',
      mode: 'ios',
      animation: 'slide-up'
    };

    this.router.navigate(['/home'], {
      ...animation,
      state: {
        direction: 'forward',
        mode: 'ios',
        animation: 'slide-up'
      }
    });
  }
}