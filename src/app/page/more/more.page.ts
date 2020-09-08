import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { CouponService } from 'src/app/service/coupon.service';
import { PaymentService } from 'src/app/service/payment.service';
import { UtilService } from 'src/app/service/util.service';
import { environment } from './../../../environments/environment';
import { MoreMenuGroup, MoreMenuItem } from './../../model/more-menu';
import { KakaoUser } from './../../model/user';
declare var Kakao;

@Component({
  selector: 'more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  user: User;
  kakaoUser: KakaoUser;
  menus: MoreMenuGroup[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilService: UtilService,
    private paymentService: PaymentService,
    private couponService: CouponService
  ) {
    this.utilService.loadScript('https://developers.kakao.com/sdk/js/kakao.js')
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(resp => {
      this.user = resp.user;
      this.kakaoUser = resp.kakaoUser;
      this.couponService.getCoupons(resp.user.uid, false).subscribe(coupons => {
        this.paymentService.getUserPaymentAccounts(this.user.uid).subscribe(accounts => {
          this.menus = [
            new MoreMenuGroup('계정 관리', [
              new MoreMenuItem('내 쿠폰', () => { this.router.navigate(['/tabs/coupon-list']) }, coupons.length, 'badge-danger', true),
              new MoreMenuItem('간편결제 관리', () => { this.router.navigate(['/tabs/payment-management']) }, accounts.length, 'badge-secondary', true),
            ]),
            new MoreMenuGroup('지원', [
              new MoreMenuItem('이벤트', () => this.router.navigate(['/tabs/event'])),
              new MoreMenuItem('문의하기', () => window.open('mailto:nonunbub@gmail.com')),
              new MoreMenuItem('공지사항', () => alert('서비스 준비중입니다 ^^')),
              new MoreMenuItem('로그아웃', () => this.logout(), 0, '', false, true),
            ]),
          ]
        })
      })
    });
  }

  editUser() {
    alert('서비스 준비중입니다 ^^')
    // this.router.navigate(['/tabs/edit-profile']);
  }

  goToHost() {
    // alert('서비스 준비중입니다 ^^')
    this.router.navigate(['/hosted-meetings']);
  }

  login(method: string) {
    if (method === 'kakao') {
      if (!Kakao.isInitialized()) {
        Kakao.init(environment.KAKAO_AUTH_KEY);
      }
      Kakao.Auth.authorize({
        redirectUri: 'http://nonunbub.com/accounts/kakao/login/callback/',
      });
    } else if (method === 'email') {
      alert('서비스 준비중입니다 ^^');
    }
  }

  logout() {
    this.authService.logout().subscribe(resp => {
      this.user = undefined;
      this.router.navigate(['/tabs/home']);
    }, error => {
      console.log(error);
    });
  }
}
