import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Payment } from 'src/app/model/payment';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {
  paymentId: number;
  payment: Payment;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(resp => {
      this.paymentId = resp.id;
      this.paymentService.getPurchasedProduct(+this.paymentId).subscribe(resp => {
        this.payment = resp;
      })
    })
  }
}
