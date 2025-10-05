import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform, Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private animationCtrl: AnimationController
  ) {
    this.setupCustomAnimations();
  }

  private setupCustomAnimations() {
    this.platform.ready().then(() => {
      const element = document.querySelector('ion-router-outlet');
      if (element) {
        const animation = this.animationCtrl
          .create()
          .addElement(element)
          .duration(300)
          .fromTo('transform', 'translateY(100%)', 'translateY(0)')
          .fromTo('opacity', '0', '1')
          .easing('cubic-bezier(0.4, 0, 0.2, 1)');
        
        animation.play();
      }
    });
  }
}
