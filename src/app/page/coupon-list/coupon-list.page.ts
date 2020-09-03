import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { Coupon } from './../../model/coupon';
import { CouponService } from './../../service/coupon.service';

@Component({
  selector: 'coupon-list',
  templateUrl: './coupon-list.page.html',
  styleUrls: ['./coupon-list.page.scss'],
})
export class CouponListPage implements OnInit {
  user: User;
  coupons: Coupon[];
  usedCoupons: Coupon[];
  selectedMenu = 'canUse';

  constructor(
    private authService: AuthService,
    private couponService: CouponService
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.couponService.getCoupons(user.uid, false).subscribe(coupons => {
        this.coupons = coupons;
        this.couponService.getCoupons(user.uid, true).subscribe(usedCoupons => {
          this.usedCoupons = usedCoupons
        })
      })
    })
  }

  segmentChanged(event) {
    this.selectedMenu = event.detail.value;
  }
}
