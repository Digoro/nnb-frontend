import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { AuthService } from 'src/app/service/auth.service';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  configuration: Config;
  columns: Columns[];
  data;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      // if (user.uid !== this.authService.ADMIN_ID) {
      //   alert('권한이 없습니다.')
      //   this.router.navigate(['/tabs/home']);
      // } else {
      this.paymentService.getPurchasedInfoAll().subscribe(resp => {
        this.data = resp;
      })
      this.configuration = { ...DefaultConfig };
      this.configuration.searchEnabled = true;
      this.configuration.horizontalScroll = true;
      this.columns = [
        { key: 'PCD_PAY_TIME', title: '결제 일시' },
        { key: 'uid', title: '유저' },
        { key: 'PCD_PAY_GOODS', title: '모임명' },
        { key: 'phone', title: '휴대폰' },
        { key: 'PCD_PAY_TOTAL', title: '결제 금액' },
        { key: 'PCD_PAY_OID', title: '주문번호' },
        { key: 'PCD_PAY_MSG', title: '결제 메시지' },
        { key: 'PCD_PAY_TYPE', title: '결제 유형' },
        { key: 'PCD_PAY_RST', title: '결제 결과' },
        { key: 'mid', title: '모임 식별자' },
      ];
      // }
    })
  }
}
