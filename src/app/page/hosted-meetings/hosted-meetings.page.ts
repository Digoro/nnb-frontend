import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Meeting } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';

@Component({
  selector: 'hosted-meetings',
  templateUrl: './hosted-meetings.page.html',
  styleUrls: ['./hosted-meetings.page.scss'],
})
export class HostedMeetingsPage implements OnInit {
  hostedMeetings: any[];

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(currentUser => {
      this.setHostedMeetings();
    });
  }

  private setHostedMeetings() {
    this.meetingService.getHostedMeetings().subscribe(meetings => {
      this.hostedMeetings = meetings;
    });
  }

  segmentChanged(event) {
    console.log(event);
  }

  goDetailPage(meeting: Meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  async presentActionSheet(mid: number) {
    const actionSheet = await this.actionSheetController.create({
      header: '모임',
      buttons: [{
        text: '수정',
        icon: '',
        handler: () => {
          this.router.navigate(['./tabs/meeting-edit', mid])
        }
      }, {
        text: '삭제',
        role: 'destructive',
        icon: '',
        handler: () => {
          const isDelete = confirm('정말로 삭제하시겠습니까?');
          if (isDelete) {
            this.meetingService.deleteMeeting(mid).subscribe(resp => {
              alert('모임을 삭제하였습니다.');
              this.setHostedMeetings();
            })
          }
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
