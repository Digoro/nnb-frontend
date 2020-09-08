import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Meeting } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { User } from './../../model/user';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  user: User;
  meetings: Meeting[];
  configuration: Config;
  columns: Columns[];
  data;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.paymentService.getPurchasedInfoAll(user.uid).subscribe(resp => {
        this.data = resp;
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = true;
        this.configuration.horizontalScroll = true;
        this.columns = [
          { key: 'index', title: '번호' },
          { key: 'PCD_PAY_TIME', title: '결제 일시' },
          { key: 'uid', title: '결제자 닉네임' },
          // { key: 'uid.name', title: '결제자 이름' },
          { key: 'PCD_PAY_GOODS', title: '모임명' },
          { key: 'options', title: '구매 옵션' },
          { key: 'coupon', title: '쿠폰' },
          { key: 'phone', title: '휴대폰' },
          { key: 'PCD_PAY_TOTAL', title: '결제 금액' },
          { key: 'PCD_PAY_OID', title: '주문번호' },
          { key: 'PCD_PAY_MSG', title: '결제 메시지' },
          { key: 'PCD_PAY_TYPE', title: '결제 유형' },
          { key: 'PCD_PAY_RST', title: '결제 결과' },
          { key: 'mid', title: '모임 식별자' },
        ];
      });
    })
  }

  goToDetail(mid: number) {
    this.router.navigate(['/tabs/meeting-detail', mid])
  }
}
