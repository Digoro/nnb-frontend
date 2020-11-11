import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from 'src/app/service/meeting.service';
import { PaymentService } from 'src/app/service/payment.service';
import { PurchasedMeeting, PurchasedMeetingOption } from './../../model/meeting';

@Component({
  selector: 'my-info-detail',
  templateUrl: './my-info-detail.page.html',
  styleUrls: ['./my-info-detail.page.scss'],
})
export class MyInfoDetailPage implements OnInit {
  pid: number;
  meeting: PurchasedMeeting;
  isAllCanceled: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private meetingService: MeetingService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(resp => {
      this.pid = resp.id;
      this.setMyMeetings();
    })
  }

  cancel(meeting: PurchasedMeeting, option: PurchasedMeetingOption) {
    this.paymentService.refund(meeting, option).subscribe(resp => {
      alert("환불 되었습니다.");
      this.setMyMeetings();
    })
  }

  private setMyMeetings() {
    this.meetingService.getPurchasedMeeting(this.pid).subscribe(resp => {
      this.meeting = resp;
      this.isAllCanceled = !!this.meeting.options.find(option => !option.isRefund)
    })
  }

  question() {
    window.open('https://nonunbub.channel.io')
  }
}
