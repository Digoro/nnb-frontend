import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Coupon } from 'src/app/model/coupon';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: "my-info",
  templateUrl: './my-info.page.html',
  styleUrls: ['./my-info.page.scss'],
})
export class MyInfoPage {
  user: User;
  purchasedMeetings: PurchasedMeeting[];
  selectedMenu: string;
  Coupon: Coupon;

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    public actionSheetController: ActionSheetController,
  ) { }

  ionViewDidEnter() {
    this.setMyMeetings();
  }

  private setMyMeetings() {
    this.selectedMenu = 'join';
    this.authService.getCurrentNonunbubUser().subscribe(currentUser => {
      this.user = currentUser;
      this.meetingService.getPurchasedMeetings(this.user.uid).subscribe(meetings => {
        console.log(meetings);
        if (meetings.length === 0) {
          this.purchasedMeetings = undefined;
        }
        else {
          this.purchasedMeetings = meetings.reverse();
        }
      });
    });
  }

  segmentChanged(event) {
    this.selectedMenu = event.detail.value;
  }
}
