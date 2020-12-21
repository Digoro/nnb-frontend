import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'payment-fail',
  templateUrl: './payment-fail.page.html',
  styleUrls: ['./payment-fail.page.scss'],
})
export class PaymentFailPage implements OnInit {
  errorCode: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(resp => {
      if (resp.errorCode) this.errorCode = resp.errorCode;
    });
  }

  question() {
    window.open('https://nonunbub.channel.io');
  }
}
