import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: 'myinfo-meeting',
  templateUrl: './myinfo-meeting.component.html',
  styleUrls: ['./myinfo-meeting.component.scss'],
})
export class MyinfoMeetingComponent implements OnInit {
  @Input() meeting: PurchasedMeeting;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goMeetingPage(mid: number) {
    this.router.navigate(['./tabs/meeting-detail', mid]);
  }

  goDetailPage(pid: number) {
    this.router.navigate(['./tabs/my-info-detail', pid]);
  }
}
