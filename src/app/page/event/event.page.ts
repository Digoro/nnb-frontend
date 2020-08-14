import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';

@Component({
  selector: 'event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  isDesktop = true;

  constructor(
    private router: Router,
    private cds: CheckDesktopService
  ) { }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp)
  }

  onClick(info: any, isLink: boolean = false) {
    if (isLink) {
      window.open(info);
    } else {
      this.router.navigate(['/tabs/meeting-detail', info]);
    }
  }
}
