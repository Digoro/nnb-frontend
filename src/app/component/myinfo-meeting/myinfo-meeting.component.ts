import { Component, Input, OnInit } from '@angular/core';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: 'myinfo-meeting',
  templateUrl: './myinfo-meeting.component.html',
  styleUrls: ['./myinfo-meeting.component.scss'],
})
export class MyinfoMeetingComponent implements OnInit {
  @Input() meeting: PurchasedMeeting;

  constructor(
  ) { }

  ngOnInit() {
  }
}
