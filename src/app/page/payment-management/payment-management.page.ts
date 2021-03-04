import { Component, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserPaymentInfo } from './../../model/payment-user-info';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'payment-management',
  templateUrl: './payment-management.page.html',
  styleUrls: ['./payment-management.page.scss'],
})
export class PaymentManagementPage implements OnInit {
  user: User;
  accounts: UserPaymentInfo[];
  selectedMethod: string = 'card';
  private isAddedSource = new BehaviorSubject<boolean>(true);
  isAdded = this.isAddedSource.asObservable();

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.isAdded.subscribe(resp => {
        this.zone.run(() => {
          this.getList();
        });
      })
    });
  }

  getList() {
    this.paymentService.getUserPaymentAccounts(this.user.id).subscribe(accounts => {
      this.accounts = accounts;
    })
  }

  add() {
    this.paymentService.auth(this.user, this.selectedMethod, this.isAddedSource);
  }

  delete(account: UserPaymentInfo) {
    const answer = confirm('정말로 삭제하시겠습니까?');
    if (answer) {
      this.paymentService.delete(account.PCD_PAYER_ID).subscribe(resp => {
        alert('간편결제가 삭제되었습니다.')
        this.getList();
      })
    }
  }


  selectMethod(event) {
    this.selectedMethod = event.target.value;
  }
}
