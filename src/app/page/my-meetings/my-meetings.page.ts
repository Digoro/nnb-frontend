import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Meeting } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';

@Component({
  selector: 'my-meetings',
  templateUrl: './my-meetings.page.html',
  styleUrls: ['./my-meetings.page.scss'],
})
export class MyMeetingsPage implements OnInit {
  myMeetings: any[];

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(currentUser => {
      this.setMyMeetings();
    });
  }

  private setMyMeetings() {
    this.meetingService.getMyMeetings().subscribe(meetings => {
      this.myMeetings = meetings;
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
              this.setMyMeetings();
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
