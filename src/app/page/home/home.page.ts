import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { S3 } from 'aws-sdk';
import * as moment from 'moment';
import { Category } from 'src/app/model/category';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from 'src/environments/environment';
import { Meeting, MeetingStatus } from './../../model/meeting';
import { CheckDesktopService } from './../../service/check-desktop.service';
import { S3Service } from './../../service/s3.service';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  isDesktop = true;
  meetings: Meeting[];
  fastMeetings: Meeting[];
  toWeek: string;
  fromWeek: string;
  forestMeetings: Meeting[];
  jejuMeetings: Meeting[];

  bannerSliderConfig = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 5000
    }
  }
  banners: { image: string, metadata: S3.Metadata }[];
  mainMeetings: { title: string, subTitle: string, onShowKey: string, onShowTitle: string, meetings: Meeting[], emoji?: string, }[]

  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private cds: CheckDesktopService,
    private s3Service: S3Service
  ) {
    console.log('Home constructor');
  }

  ionViewWillEnter() {
    console.log('Home ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Home ionViewDidEnter');
    this.getMeetings();
  }

  ionViewWillLeave() {
    console.log('Home ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Home ionViewDidLeave');
  }

  ngOnDestroy() {
    console.log('Home ngOnDestroy');
  }

  click(key: string) {
    const category = Category[key]
    this.router.navigate(['./tabs/meetings'], { queryParams: { key: category } });
  }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
    this.s3Service.getList(environment.folder.banner).subscribe(resp => {
      this.banners = resp;
    })
  }

  clickBanner(metadata: S3.Metadata) {
    window.open(metadata.link);
  }

  private getMeetings() {
    const now = moment();
    const weekEnd = now.clone().add(7, 'days');
    this.toWeek = now.format('MM.DD');
    this.fromWeek = weekEnd.format('MM.DD');
    this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
      this.meetings = meetings.filter(meeting =>
        !meeting.subTitle.includes('숲찾사') &&
        !meeting.subTitle.includes('제주')
      )
      this.fastMeetings = meetings.filter(meeting => {
        if (meeting.options) {
          return meeting.options.find(option => {
            const start = moment(option.optionDate);
            return start.isSameOrAfter(now) && start.isSameOrBefore(weekEnd)
          });
        } else return false;
      })
      this.forestMeetings = meetings.filter(meeting => meeting.subTitle.includes('숲찾사'))
      this.jejuMeetings = meetings.filter(meeting => meeting.subTitle.includes('제주'))

      this.mainMeetings = [
        {
          title: '노는법 X 길 위에 여행', emoji: '🚶🏻🚶🏻‍♂️🚶🏻‍♀️', subTitle: "길여행가와 떠나는 힐링 여행~",
          onShowKey: 'forest', onShowTitle: '노는법 X 길 위에 여행 🚶🏻🚶🏻‍♂️🚶🏻‍♀️', meetings: this.forestMeetings
        },
        {
          title: '일주일 이내 열리는 모임', subTitle: `가장 빨리 만나 볼 수 있는 기회!(${this.toWeek} ~ ${this.fromWeek})`,
          onShowKey: 'week', onShowTitle: `일주일 이내 열리는 모임`, meetings: this.fastMeetings
        },
        {
          title: '인기 있는 모임', emoji: '👍👍', subTitle: "지금 노는법에서 가장 인기있는 모임!",
          onShowKey: 'all', onShowTitle: '인기 있는 모임 👍👍', meetings: this.meetings
        },
        {
          title: '제주여가마을', emoji: '🏝️🏝️', subTitle: "제주여가마을",
          onShowKey: 'jeju', onShowTitle: '제주여가마을 🏝️🏝️', meetings: this.jejuMeetings
        },
      ]
    });
  }

  search(event) {
    const search = event.target.value;
    alert('서비스 준비중입니다 ^^');
  }
}
