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

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private cds: CheckDesktopService
  ) { }

  ngOnInit() {
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

  goToAdd() {
    this.router.navigate(['./tabs/meeting-add']);
  }

  goDetailPage(meeting: Meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  edit(mid: number) {
    this.router.navigate(['./tabs/meeting-edit', mid])
  }

  reservate(mid: number) {
    this.router.navigate(['/tabs/host/reservation', mid]);
  }

  delete(mid: number) {
    const isDelete = confirm('정말로 삭제하시겠습니까?');
    if (isDelete) {
      this.meetingService.deleteMeeting(mid).subscribe(resp => {
        alert('모임을 삭제하였습니다.');
        this.setHostedMeetings();
      })
    }
  }

  noReady() {
    alert('서비스 준비중')
  }

  async presentActionSheet(mid: number) {
    const actionSheet = await this.actionSheetController.create({
      header: '모임',
      buttons: [{
        text: '수정 하기',
        icon: '',
        handler: () => {
          this.edit(mid);
        }
      }, {
        text: '예약 관리',
        icon: '',
        handler: () => {
          this.reservate(mid);
        }
      },
      {
        text: '후기 관리',
        icon: '',
        handler: () => {
          alert('서비스 준비중입니다.')
        }
      },
      {
        text: '문의 관리',
        icon: '',
        handler: () => {
          alert('서비스 준비중입니다.')
        }
      }, {
        text: '삭제',
        role: 'destructive',
        icon: '',
        handler: () => {
          this.delete(mid);
        }
      }, {
        text: '취소',
        icon: '',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
