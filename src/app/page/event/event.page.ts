import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick(link: string) {
    window.open(link, '_blank');
  }
}
