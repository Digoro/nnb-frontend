import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { CouponService } from 'src/app/service/coupon.service';
import { MoreMenuGroup, MoreMenuItem } from './../../model/more-menu';

@Component({
  selector: 'more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  menus: MoreMenuGroup[];

  constructor(
    private authService: AuthService,
    private couponService: CouponService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.menus = [
      new MoreMenuGroup('계정 관리', [
        new MoreMenuItem('내 쿠폰', '/tabs/coupon-list', undefined, 0, 'badge-danger', true),
      ]),
      new MoreMenuGroup('지원', [
        new MoreMenuItem('호스트센터', '/host/meeting-management', undefined),
        new MoreMenuItem('매거진', '/tabs/magazine', undefined),
        new MoreMenuItem('이벤트', '/tabs/static/event', undefined),
        new MoreMenuItem('문의하기', 'https://nonunbub.channel.io', undefined),
        new MoreMenuItem('로그아웃', '', () => this.logout(), 0, '', false, true),
      ]),
    ]
    this.authService.getCurrentNonunbubUser().subscribe(resp => {
      this.couponService.search({ page: 1, limit: 1, userId: resp.id, expireDuration: new Date(), isUsed: false }).subscribe(coupons => {
        this.menus[0].items[0].badge = coupons.meta.totalItems;
      })
    })
  }

  logout() {
    this.authService.logout().subscribe(resp => {
      window.location.href = '/tabs/home'
    }, error => {
      console.log(error);
    });
  }
}
