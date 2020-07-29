import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Meeting } from 'src/app/model/meeting';

@Component({
  selector: 'meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss'],
})
export class MeetingCardComponent implements OnInit {
  @Input() meeting: Meeting;
  @Output() clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  goDetailPage(meeting: Meeting) {
    this.clickEvent.emit(meeting);
  }
}
