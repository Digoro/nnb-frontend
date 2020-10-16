import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Coupon } from 'src/app/model/coupon';
import { Meeting } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { PaymentService } from 'src/app/service/payment.service';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: "my-info",
  templateUrl: './my-info.page.html',
  styleUrls: ['./my-info.page.scss'],
})
export class MyInfoPage {
  user: User;
  purchasedMeetings: PurchasedMeeting[];
  refundMeetings: PurchasedMeeting[];
  selectedMenu: string;
  Coupon: Coupon;

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private paymentService: PaymentService
  ) { }

  ionViewDidEnter() {
    this.setMyMeetings();
  }

  private setMyMeetings() {
    this.selectedMenu = 'join';
    this.authService.getCurrentNonunbubUser().subscribe(currentUser => {
      this.user = currentUser;
      this.meetingService.getPurchasedMeetings(this.user.uid).subscribe(meetings => {
        if (meetings.length === 0) {
          this.purchasedMeetings = undefined;
          this.refundMeetings = undefined;
        }
        else {
          this.purchasedMeetings = meetings.filter(meeting => !meeting.payment.isRefund);
          this.refundMeetings = meetings.filter(meeting => meeting.payment.isRefund);
        }
      });
    });
  }

  segmentChanged(event) {
    this.selectedMenu = event.detail.value;
  }

  goDetailPage(meeting: Meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  cancel(meeting: PurchasedMeeting) {
    this.paymentService.refund(meeting).subscribe(resp => {
      alert("환불 되었습니다.");
      this.setMyMeetings();
    })
  }
}
