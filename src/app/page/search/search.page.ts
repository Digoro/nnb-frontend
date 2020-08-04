import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MeetingService } from 'src/app/service/meeting.service';
import { Category } from './../../model/category';
import { Meeting, MeetingStatus } from './../../model/meeting';

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  meetings: Meeting[];
  title: string;
  isForest = false;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(prams => {
      const { key, title } = prams;
      if (title) {
        this.title = decodeURIComponent(title);
      }
      switch (key) {
        case 'forest': {
          this.isForest = true;
          this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
            this.meetings = meetings.filter(m => m.subTitle.includes('숲찾사'))
          }); break;
        }
        case '100cation': {
          this.isForest = false;
          this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
            this.meetings = meetings.filter(m => m.subTitle.includes('락앤롤'))
          }); break;
        }
        case 'week': {
          this.isForest = false;
          this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
            this.meetings = meetings.filter(meeting => !meeting.subTitle.includes('숲찾사') && !meeting.subTitle.includes('락앤롤'))
            const now = moment();
            const weekEnd = now.clone().add(7, 'days');
            this.meetings = meetings.filter(meeting => {
              const start = moment(meeting._from);
              return start.isSameOrAfter(now) && start.isSameOrBefore(weekEnd)
            })
          }); break;
        }
        case 'all': {
          this.isForest = false;
          this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
            this.meetings = meetings.filter(m => !m.subTitle.includes('숲찾사') && !m.subTitle.includes('락앤롤'))
          }); break;
        }
        default: {
          this.isForest = false;
          this.title = Category[key];
          this.meetingService.searchMeetings([`category=${key}`]).subscribe(meetings => {
            this.meetings = meetings;
            if (meetings.length === 0) {
              alert('아직 모임이 없습니다. 더 많은 컨텐츠를 기대해주세요~!');
              this.router.navigate(['/tabs/category'])
            }
          }); break;
        }
      }
    })
  }

  back() {
    this.location.back();
  }

  goDetailPage(meeting: Meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }
}
