import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: 'myinfo-meeting',
  templateUrl: './myinfo-meeting.component.html',
  styleUrls: ['./myinfo-meeting.component.scss'],
})
export class MyinfoMeetingComponent implements OnInit {
  @Input() meeting: PurchasedMeeting;
  @Output() onGoDetailPage = new EventEmitter();
  @Output() onCancelEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  goDetailPage(mid: number) {
    this.onGoDetailPage.emit(mid);
  }

  cancel(meeting: PurchasedMeeting) {
    this.onCancelEvent.emit(meeting);
  }
}
