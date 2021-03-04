import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss'],
})
export class MeetingCardComponent implements OnInit {
  @Input() product: Product;
  @Output() clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  goDetailPage(meeting: Product) {
    this.clickEvent.emit(meeting);
  }
}
