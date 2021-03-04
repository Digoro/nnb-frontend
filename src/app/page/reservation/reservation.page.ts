import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Payment } from './../../model/payment';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  configuration: Config;
  payments: Payment[];
  columns: Columns[];
  pagination = {
    offset: 1,
    limit: 10,
    count: -1
  };

  constructor(
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;
    this.configuration.horizontalScroll = true;
    this.columns = [
      { key: 'index', title: '번호' },
      { key: 'representationPhoto', title: '이미지' },
      { key: 'payAt', title: '결제 일시' },
      { key: 'title', title: '모임명' },
      { key: 'name', title: '결제자' },
      { key: 'nickname', title: '닉네임' },
      { key: 'phoneNumber', title: '휴대폰' },
      { key: 'orderItems', title: '구매옵션' },
      { key: 'coupon', title: '쿠폰' },
      { key: 'pgName', title: 'PG사' },
      { key: 'payPrice', title: '결제금액' },
      { key: 'id', title: '주문번호' },
      { key: 'resultMessage', title: '결제메시지' },
      { key: 'payMethod', title: '결제유형' },
      { key: 'result', title: '결제결과' }
    ];
    this.getReservations(1, 10);
  }

  getReservations(page: number, limit: number) {
    this.paymentService.getPaymentsByHost({ page, limit }).subscribe(resp => {
      this.payments = resp.items;
      this.pagination = { limit: resp.meta.itemsPerPage, offset: resp.meta.currentPage, count: resp.meta.totalItems };
    });
  }

  onTableEvent(event: any): void {
    if (event.event === 'onPagination') {
      this.getReservations(event.value.page, event.value.limit);
    }
  }
}