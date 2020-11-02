import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from 'src/app/model/comment';
import { Meeting } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';
import { KakaoUser } from '../../model/user';
import { CommentService } from '../../service/comment.service';
import { MeetingService } from '../../service/meeting.service';
import { UserService } from '../../service/user.service';
import { PurchasedMeeting } from './../../model/meeting';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;
  kakaoUser: KakaoUser;
  comments: Comment[] = [];
  joinedMeeting: PurchasedMeeting[];
  hostedMeetings: Meeting[];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private meetingService: MeetingService,
    private router: Router,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.userService.get(id).subscribe(user => {
        this.user = user;
        this.meetingService.getHostedMeetings(user.uid).subscribe(meetings => {
          this.hostedMeetings = meetings
          meetings.forEach(meeting => {
            this.commentService.getCommentsByMeeting(meeting.mid).subscribe(comments => {
              comments.forEach(comment => this.comments.push(comment))
            });
          })
        })
        this.meetingService.getPurchasedMeetings(user.uid).subscribe(meetings => {
          this.joinedMeeting = meetings.reduce((arr, item) => {
            let exists = !!arr.find(m => m.payment.mid.mid === item.payment.mid['mid']);
            if (!exists) {
              arr.push(item);
            }

            return arr;
          }, []);
        })
      })
    })
  }

  onClick(meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  back() {
    this.location.back();
  }
}
