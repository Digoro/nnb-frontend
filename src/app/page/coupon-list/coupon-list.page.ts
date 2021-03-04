import { Component, OnInit } from '@angular/core';
import { Coupon } from 'src/app/model/coupon';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { CouponService } from './../../service/coupon.service';

@Component({
  selector: 'coupon-list',
  templateUrl: './coupon-list.page.html',
  styleUrls: ['./coupon-list.page.scss'],
})
export class CouponListPage implements OnInit {
  user: User;
  selectedMenu = 'canUse';

  coupons: Coupon[];
  total: number;
  currentPage: number;
  nextPage: number;

  usedCoupons: Coupon[];
  usedCouponsTotal: number;
  usedCouponCurrentPage: number;
  usedCouponNextPage: number;

  constructor(
    private authService: AuthService,
    private couponService: CouponService
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.couponService.search({ page: 1, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed: false }).subscribe(coupons => {
        this.total = coupons.meta.totalItems;
        this.coupons = coupons.items;
        this.setCoupons(false);
      })
      this.couponService.search({ page: 1, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed: true }).subscribe(usedCoupons => {
        this.usedCouponsTotal = usedCoupons.meta.totalItems;
        this.usedCoupons = usedCoupons.items;
        this.setCoupons(true);
      })
    })
  }

  segmentChanged(event) {
    this.selectedMenu = event.detail.value;
  }

  setCoupons(isUsed: boolean) {
    if (!isUsed) {
      this.couponService.search({ page: 1, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed }).subscribe(coupons => {
        this.coupons = coupons.items;
        this.setPagination(coupons.meta, false);
      })
    } else {
      this.couponService.search({ page: 1, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed }).subscribe(usedCoupons => {
        this.usedCoupons = usedCoupons.items;
        this.setPagination(usedCoupons.meta, true);
      })
    }
  }

  private setPagination(meta, isUsed: boolean) {
    if (!isUsed) {
      this.currentPage = +meta.currentPage;
      const lastPage = +meta.totalPages;
      if (this.currentPage + 1 <= lastPage) {
        this.nextPage = this.currentPage + 1;
      }
    } else {
      this.usedCouponCurrentPage = +meta.currentPage;
      const lastPage = +meta.totalPages;
      if (this.usedCouponCurrentPage + 1 <= lastPage) {
        this.usedCouponNextPage = this.usedCouponCurrentPage + 1;
      }
    }
  }

  loadData(event, isUsed: boolean) {
    if (!isUsed) {
      if (this.currentPage < this.nextPage) {
        this.couponService.search({ page: this.nextPage, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed }).subscribe(resp => {
          this.coupons = [...this.coupons, ...resp.items];
          this.setPagination(resp.meta, true);
          event.target.complete();
        })
      } else event.target.disabled = true;
    } else {
      if (this.usedCouponCurrentPage < this.usedCouponNextPage) {
        this.couponService.search({ page: this.usedCouponNextPage, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed }).subscribe(resp => {
          this.usedCoupons = [...this.usedCoupons, ...resp.items];
          this.setPagination(resp.meta, true);
          event.target.complete();
        })
      } else event.target.disabled = true;
    }
  }
}
