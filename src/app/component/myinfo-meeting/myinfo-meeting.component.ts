import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PurchasedMeeting, PurchasedMeetingOption } from './../../model/meeting';

@Component({
  selector: 'myinfo-meeting',
  templateUrl: './myinfo-meeting.component.html',
  styleUrls: ['./myinfo-meeting.component.scss'],
})
export class MyinfoMeetingComponent implements OnInit {
  @Input() meeting: PurchasedMeeting;
  @Output() onGoDetailPage = new EventEmitter();
  @Output() onCancelEvent = new EventEmitter();
  isAllCanceled: boolean;

  constructor() { }

  ngOnInit() {
    this.isAllCanceled = !!this.meeting.options.find(option => !option.isRefund)
  }

  goDetailPage(mid: number) {
    this.onGoDetailPage.emit(mid);
  }

  cancel(meeting: PurchasedMeeting, option: PurchasedMeetingOption) {
    this.onCancelEvent.emit({ meeting, option });
  }

  question() {
    window.open('https://nonunbub.channel.io')
  }
}
