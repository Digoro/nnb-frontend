import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Coupon } from 'src/app/model/coupon';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/meeting.service';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from './../../model/payment';

@Component({
  selector: "my-info",
  templateUrl: './my-info.page.html',
  styleUrls: ['./my-info.page.scss'],
})
export class MyInfoPage {
  user: User;
  selectedMenu = 'join';
  Coupon: Coupon;

  payments: Payment[];
  paymentTotal: number;
  currentPage: number;
  nextPage: number;

  likeProducts: Product[];
  likeTotal: number;
  likeCurrentPage: number;
  likeNextPage: number;

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    public actionSheetController: ActionSheetController,
    private productService: ProductService
  ) { }

  ionViewDidEnter() {
    this.setMyMeetings();
  }

  private setMyMeetings() {
    this.authService.getCurrentNonunbubUser().subscribe(currentUser => {
      this.user = currentUser;
      this.paymentService.getPurchasedProducts({ page: 1, limit: 10 }).subscribe(payments => {
        this.payments = payments.items;
        this.paymentTotal = payments.meta.totalItems;
        this.setPagination(payments.meta);
      });
      this.productService.getLikeProducts({ page: 1, limit: 10 }).subscribe(resp => {
        this.likeProducts = resp.items;
        this.likeTotal = resp.meta.totalItems;
        this.setPaginationLikeProducts(resp.meta);
      })
    });
  }

  segmentChanged(event) {
    this.selectedMenu = event.detail.value;
  }

  loadData(event) {
    if (this.currentPage < this.nextPage) {
      this.paymentService.getPurchasedProducts({ page: +this.nextPage, limit: 10 }).subscribe(resp => {
        this.payments = [...this.payments, ...resp.items];
        this.setPagination(resp.meta);
        event.target.complete();
      })
    } else event.target.disabled = true;
  }

  private setPagination(meta) {
    this.currentPage = +meta.currentPage;
    const lastPage = +meta.totalPages;
    if (this.currentPage + 1 <= lastPage) {
      this.nextPage = this.currentPage + 1;
    }
  }

  loadDataLikeProducts(event) {
    if (this.likeCurrentPage < this.likeNextPage) {
      this.productService.getLikeProducts({ page: +this.likeNextPage, limit: 10 }).subscribe(resp => {
        this.likeProducts = [...this.likeProducts, ...resp.items];
        this.setPaginationLikeProducts(resp.meta);
        event.target.complete();
      })
    } else event.target.disabled = true;
  }

  private setPaginationLikeProducts(meta) {
    this.likeCurrentPage = +meta.currentPage;
    const lastPage = +meta.totalPages;
    if (this.likeCurrentPage + 1 <= lastPage) {
      this.likeNextPage = this.likeCurrentPage + 1;
    }
  }
}
