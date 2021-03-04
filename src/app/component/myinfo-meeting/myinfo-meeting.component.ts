import { Component, Input, OnInit } from '@angular/core';
import { Payment } from 'src/app/model/payment';

@Component({
  selector: 'myinfo-meeting',
  templateUrl: './myinfo-meeting.component.html',
  styleUrls: ['./myinfo-meeting.component.scss'],
})
export class MyinfoMeetingComponent implements OnInit {
  @Input() payment: Payment;
  @Input() lines = '';

  constructor(
  ) { }

  ngOnInit() {
  }
}
