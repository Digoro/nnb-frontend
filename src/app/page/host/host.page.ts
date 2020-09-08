import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Meeting } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { CheckDesktopService } from './../../service/check-desktop.service';

@Component({
  selector: 'host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  hostedMeetings: Meeting[];
  isDesktop = false;
  isOpenSidebar = false;

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private cds: CheckDesktopService
  ) { }

  ngOnInit() {
    this.cds.setIsDesktop(window.innerWidth);
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp)
    this.authService.getCurrentUser().subscribe(currentUser => {
      this.setHostedMeetings();
    });
  }

  private setHostedMeetings() {
    this.meetingService.getHostedMeetings().subscribe(meetings => {
      this.hostedMeetings = meetings;
    });
  }

  openSidebar() {
    this.isOpenSidebar = !this.isOpenSidebar;
  }

  goDetailPage(meeting: Meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  noReady() {
    alert('서비스 준비중입니다.')
  }
}
