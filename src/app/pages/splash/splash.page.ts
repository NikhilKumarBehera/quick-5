import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Auto-navigate after delay (optional)
    // setTimeout(() => this.goToHome(), 3000);
  }

  getStarted() {
    this.router.navigate(['/home']);
  }

  signIn() {
    // Implement sign in logic
    this.router.navigate(['/home']);
  }
}