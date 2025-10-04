import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

 async initializeApp() {
    await this.platform.ready();
    
    if (this.platform.is('capacitor')) {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Light });
      
      // Set status bar background color (your gradient purple)
      await StatusBar.setBackgroundColor({ color: '#667eea' });
      
      // Make sure status bar is visible
      await StatusBar.show();
    }
  }
}
