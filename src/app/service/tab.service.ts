import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  hideTabBarPages: string[] = [
    'admin',
    'meetings',
    'payment-management',
    'magazine',
    'magazine-add',
    'hosted-meetings',
    'meeting-add',
    'reservation',
    'coupon-list',
  ];
  routeParamPages: string[] = [
    'meeting-detail',
    'payment',
    'meeting-edit',
    'magazine-detail',
    'magazine-edit',
    'my-info-detail',
    'payment-success',
    'payment-fail',
    'meeting-request',
    'static'
  ];

  constructor(private router: Router, private platform: Platform) {
    this.platform.ready().then(() => {
      this.navEvents();
    });
  }

  navEvents() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showHideTabs(e);
      });
  }

  showHideTabs(e: NavigationEnd) {
    const urlArray = e.url.split('/');
    const pageUrl = urlArray[urlArray.length - 1];
    const pageUrlParent = urlArray[urlArray.length - 2];
    const page = pageUrl.split('?')[0];
    const hideParamPage = this.routeParamPages.indexOf(pageUrlParent) > -1 && !isNaN(Number(page));
    const shouldHide = this.hideTabBarPages.indexOf(page) > -1 || hideParamPage;

    try {
      setTimeout(() => shouldHide ? this.hideTabs() : this.showTabs());
    } catch (err) { }
  }

  hideTabs() {
    const tabBar = document.getElementById('tabBar');
    if (tabBar !== null && tabBar.style.display !== 'none') tabBar.style.display = 'none';
  }

  showTabs() {
    const tabBar = document.getElementById('tabBar');
    if (tabBar !== null && tabBar.style.display !== 'flex') tabBar.style.display = 'flex';
  }
}
