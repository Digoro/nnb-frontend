import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = "노는법";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'og:title', content: '노는법' },
      { name: 'og:description', content: '신중년을 위한 놀이터 플랫폼!' },
      { name: 'og:image', content: 'https://nonunbub.com/static//assets/nonunbub-logo-footer.png' }
    ], true);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
