import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  eventMeetings: Meeting[];

  bannerSliderConfig = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 5000
    }
  }
  banners: { image: string, link: Promise<any> }[];
  mainMeetings: { title: string, subTitle: string, onShowKey: string, onShowTitle: string, meetings: Meeting[] }[]

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
    this.s3Service.getList(environment.folder.banner).then(resp => {
      this.banners = resp;
    })
  }

  clickBanner(link: Promise<string>) {
    link.then(resp => {
      window.open(resp);
    })
  }

  private getMeetings() {
    const now = moment();
    const weekEnd = now.clone().add(7, 'days');
    this.toWeek = now.format('MM.DD');
    this.fromWeek = weekEnd.format('MM.DD');
    this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
      this.meetings = meetings.filter(meeting => !meeting.subTitle.includes('숲찾사') && !meeting.subTitle.includes('제주'))
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
      this.eventMeetings = meetings.filter(meeting => meeting.subTitle.includes('이벤트'))

      this.mainMeetings = [
        {
          title: '노는법 가을 여행 프로모션', subTitle: `이벤트`,
          onShowKey: 'event', onShowTitle: `노는법 가을 여행 프로모션`, meetings: this.eventMeetings
        },
        {
          title: '일주일 이내 열리는 모임', subTitle: `가장 빨리 만나 볼 수 있는 기회!(${this.toWeek} ~ ${this.fromWeek})`,
          onShowKey: 'week', onShowTitle: `일주일 이내 열리는 모임`, meetings: this.fastMeetings
        },
        {
          title: '인기 있는 모임 👍👍', subTitle: "지금 노는법에서 가장 인기있는 모임!",
          onShowKey: 'all', onShowTitle: '인기 있는 모임 👍👍', meetings: this.meetings
        },
        {
          title: '제주여가마을 🏝️🏝️', subTitle: "제주여가마을",
          onShowKey: 'jeju', onShowTitle: '제주여가마을 🏝️🏝️', meetings: this.jejuMeetings
        },
        {
          title: '숲을 찾는 사람들 🌲🌲', subTitle: "길여행가와 떠나는 힐링 여행~",
          onShowKey: 'forest', onShowTitle: '숲을 찾는 사람들 🌲🌲', meetings: this.forestMeetings
        },
      ]
    });
  }

  search(event) {
    const search = event.target.value;
    alert('서비스 준비중입니다 ^^');
  }

  onClick(meeting: Meeting) {
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  onShowAll(key: string, title: string) {
    this.router.navigate(['./tabs/meetings'], { queryParams: { key, title } });
  }
}
