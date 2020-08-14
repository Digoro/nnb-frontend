import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClick(info: any, isLink: boolean = false) {
    if (isLink) {
      window.open(info);
    } else {
      this.router.navigate(['/tabs/meeting-detail', info]);
    }
  }
}
