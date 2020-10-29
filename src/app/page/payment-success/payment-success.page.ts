import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from 'src/app/service/meeting.service';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: 'payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {
  pid: number;
  meeting: PurchasedMeeting;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(resp => {
      this.pid = resp.id;
      this.meetingService.getPurchasedMeeting(this.pid).subscribe(resp => {
        this.meeting = resp;
      })
    })
  }
}
