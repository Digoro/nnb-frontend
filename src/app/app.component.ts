import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, Platform } from '@ionic/angular';

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
    private metaService: Meta,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: '브라우저 경고!',
      message: '노는법은 구글 크롬 브라우저에 최적화 되어 있습니다.\n사용 중이신 브라우저에서는 오류가 발생할 수 있습니다.',
      buttons: [
        {
          text: '크롬 브라우저 다운받기',
          handler: (blah) => {
            window.location.href = 'https://www.google.com/intl/ko/chrome/';
          }
        }, {
          text: '닫기',
        }
      ]
    });

    await alert.present();
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
      const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)
      if (isIEOrEdge) this.presentAlertConfirm();
    });
  }
}
