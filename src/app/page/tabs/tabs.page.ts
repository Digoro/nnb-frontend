import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Tab } from 'src/app/model/tab';
import { AuthService } from 'src/app/service/auth.service';
import { KakaoUser } from './../../model/user';
import { CheckDesktopService } from './../../service/check-desktop.service';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  isDesktop = true;
  isHome = true;
  tabs: Tab[] = [
    new Tab('home', 'home-sharp', '홈'),
    new Tab('category', 'apps-sharp', '카테고리'),
    new Tab('my-info', 'person-sharp', '내모임'),
    new Tab('more', 'reorder-four-sharp', '더보기')
  ];
  descktopMenus: Tab[] = [
    new Tab('category', 'search', '카테고리'),
    new Tab('my-info', 'apps', '내모임'),
  ];
  kakaoUser: KakaoUser;

  constructor(
    private cds: CheckDesktopService,
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cds.setIsDesktop(window.innerWidth);
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
  }

  ionViewWillEnter() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url === '/tabs/home';
      }
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.kakaoUser = user.kakaoUser;
    })
  }

  search(event) {
    const search = event.target.value;
    alert('서비스 준비중입니다 ^^');
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    // this.cds.setIsDesktop(event.target.innerWidth);
  }

  back() {
    this.location.back();
  }
}
