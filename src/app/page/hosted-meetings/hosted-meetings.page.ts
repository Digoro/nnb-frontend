import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { MeetingStatus } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'hosted-meetings',
  templateUrl: './hosted-meetings.page.html',
  styleUrls: ['./hosted-meetings.page.scss'],
})
export class HostedMeetingsPage implements OnInit {
  hostedMeetings: any[];
  isDesktop = false;

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private cds: CheckDesktopService,
    private paymentService: PaymentService
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

  getStatusLabel(status) {
    return this.meetingService.getStatusLabel(status);
  }

  segmentChanged(event) {
    console.log(event);
  }

  edit(mid: number) {
    this.router.navigate(['/host/meeting-management/meeting-edit', mid])
  }

  disableMeeting(mid: number) {
    const isDelete = confirm('정말로 삭제하시겠습니까?');
    if (isDelete) {
      this.paymentService.getPaymentsFromMeeting(mid).subscribe(resp => {
        if (resp.length !== 0) {
          this.meetingService.updateMeetingStatus(mid, MeetingStatus.DISABLED).subscribe(resp => {
            alert('결제한 고객이 있어 모임을 삭제 하지않고 비활성하였습니다.');
            this.setHostedMeetings();
          })
        } else {
          this.meetingService.deleteMeeting(mid).subscribe(resp => {
            alert('모임을 삭제하였습니다.');
            this.setHostedMeetings();
          })
        }
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
        text: '삭제',
        role: 'destructive',
        icon: '',
        handler: () => {
          this.disableMeeting(mid);
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
