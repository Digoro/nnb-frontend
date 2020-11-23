import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/model/comment';
import { Meeting } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';
import { CommentService } from '../../service/comment.service';
import { MeetingService } from '../../service/meeting.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;
  comments: Comment[] = [];
  hostedMeetings: Meeting[];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private meetingService: MeetingService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.comments = [];
      const id = params.id;
      this.userService.get(id).subscribe(user => {
        this.user = user;
        this.meetingService.getHostedMeetings(user.uid).subscribe(meetings => {
          const temp = meetings.filter(m => m.status === 3)
          this.hostedMeetings = temp
          temp.forEach(meeting => {
            this.commentService.getCommentsByMeeting(meeting.mid).subscribe(comments => {
              comments.forEach(comment => this.comments.push(comment))
            });
          })
        })
      })
    })
  }

  back() {
    this.location.back();
  }
}
