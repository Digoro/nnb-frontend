import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, PurchasedProduct, PurchasedProductOption } from 'src/app/model/product';
import { PaymentService } from 'src/app/service/payment.service';
import { Order, Payment, PayMethod } from './../../model/payment';

@Component({
  selector: 'my-info-detail',
  templateUrl: './my-info-detail.page.html',
  styleUrls: ['./my-info-detail.page.scss'],
})
export class MyInfoDetailPage implements OnInit {
  pid: number;
  payment: Payment;
  order: Order;
  product: Product;
  isAllCanceled: boolean;
  PayMethod = PayMethod;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(resp => {
      this.pid = resp.id;
      this.setMyMeetings();
    })
  }

  cancel(meeting: PurchasedProduct, option: PurchasedProductOption) {
    this.paymentService.refund(meeting, option).subscribe(resp => {
      alert("환불 되었습니다.");
      this.setMyMeetings();
    })
  }

  private setMyMeetings() {
    this.paymentService.getPurchasedProduct(this.pid).subscribe(resp => {
      this.payment = resp;
      this.order = resp.order;
      this.product = resp.order.product;
      //TODO add refund
      // this.isAllCanceled = !!this.payment.options.find(option => !option.isRefund)
    })
  }

  question() {
    window.open('https://nonunbub.channel.io')
  }
}
