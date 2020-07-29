import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from 'src/app/model/comment';
import { Meeting } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';
import { KakaoUser } from './../../model/user';
import { AuthService } from './../../service/auth.service';
import { CommentService } from './../../service/comment.service';
import { MeetingService } from './../../service/meeting.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  user: User;
  kakaoUser: KakaoUser;
  comments: Comment[];
  meetings: Meeting[];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private meetingService: MeetingService,
    private router: Router,
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id
      this.userService.get(id).subscribe(user => {
        this.user = user;
        // this.userService.getKaKaoUser(user.sid).subscribe(kakaoUser => {
        //   this.kakaoUser = kakaoUser
        // })
        this.commentService.getCommentsByUser(user.uid).subscribe(comments => {
          this.comments = comments
        });
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
