import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meeting } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormService } from 'src/app/service/form.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { RequestMeeting } from './../../model/meeting';

@Component({
  selector: 'meeting-request',
  templateUrl: './meeting-request.page.html',
  styleUrls: ['./meeting-request.page.scss'],
})
export class MeetingRequestPage implements OnInit {
  user: User;
  mid: number;
  meeting: Meeting;
  form: FormGroup;
  isRequestedMeeting: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private meetingService: MeetingService
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.route.params.subscribe(params => {
        this.mid = params.id;
        this.meetingService.getMeeting(this.mid).subscribe(meeting => {
          this.meeting = meeting;
          this.user = user;
          this.meetingService.getRequestMeeting(this.mid).subscribe(requestMeetings => {
            this.isRequestedMeeting = !!requestMeetings.find(m => m.user['uid'] === this.user.uid);
            if (!this.isRequestedMeeting) {
              this.form = new FormGroup({
                peopleNumber: new FormControl('', this.formService.getValidators(2, [Validators.min(1), Validators.max(99)])),
                phone: new FormControl('', this.formService.getValidators(30, [Validators.pattern("[0-9 ]{11}")])),
                desc: new FormControl('', this.formService.getValidators(500)),
              });
            }
          })
        })
      })
    });
  }

  request() {
    const { peopleNumber, phone, desc } = this.form.value;
    const requestMeeting = new RequestMeeting(0, this.mid, this.user.uid, peopleNumber, phone, desc, false)
    this.meetingService.requestMeeting(requestMeeting).subscribe(resp => {
      alert('신청되었습니다. 신청인원이 확보되면 작성하신 휴대폰 번호로 안내드릴게요!');
      this.router.navigate(['/tabs/meeting-detail', this.mid]);
    })
  }
}
