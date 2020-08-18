import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Callable } from 'src/app/model/callable';
import { MeetingService } from 'src/app/service/meeting.service';
import { Meeting, MeetingStatus } from './../../model/meeting';
import { CheckDesktopService } from './../../service/check-desktop.service';

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
    initialSlide: 1,
    speed: 400,
    autoplay: {
      delay: 5000
    }
  }
  banners: { src: string, fn: Callable }[];
  mainMeetings: { title: string, subTitle: string, onShowKey: string, onShowTitle: string, meetings: Meeting[] }[]

  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private cds: CheckDesktopService
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

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp)
    this.banners = [
      {
        src: 'assets/banner/banner04.jpg',
        fn: () => window.open('https://www.notion.so/264c407f5c67446abc0cd4704a61ee97')
      },
      {
        src: 'assets/banner/banner05.jpg',
        fn: () => window.open('https://www.notion.so/PDF-ab9ceae93b4746c481ff0148ff234885')
      },
      // {
      //   src: 'assets/banner/banner06.jpg',
      //   fn: () => window.open('https://www.nonunbub.com/tabs/meetings?key=100cation&title=100%EC%BC%80%EC%9D%B4%EC%85%98%20%F0%9F%8E%A8%F0%9F%8E%A8', "_self")
      // },
      {
        src: 'assets/banner/banner08.jpg',
        fn: () => window.open('https://www.notion.so/031ae74f97594bde85bb8580def7a253')
      },
      {
        src: 'assets/banner/banner03.png',
        fn: () => window.open('https://www.nonunbub.com/tabs/meetings?key=forest&title=%EC%88%B2%EC%9D%84%20%EC%B0%BE%EB%8A%94%20%EC%82%AC%EB%9E%8C%EB%93%A4%20%F0%9F%8C%B2%F0%9F%8C%B2', "_self")
      },
      // {
      //   src: 'assets/banner/banner07.jpg',
      //   fn: () => {
      //     this.router.navigate(['/tabs/magazine-detail/1'])
      //   }
      // }
    ];
  }

  private getMeetings() {
    const now = moment();
    const weekEnd = now.clone().add(7, 'days');
    this.toWeek = now.format('MM.DD');
    this.fromWeek = weekEnd.format('MM.DD');
    this.meetingService.getAllMeetings(MeetingStatus.ENTERED).subscribe(meetings => {
      this.meetings = meetings.filter(meeting => !meeting.subTitle.includes('숲찾사') && !meeting.subTitle.includes('제주'))
      this.fastMeetings = meetings.filter(meeting => {
        const start = moment(meeting._from);
        return start.isSameOrAfter(now) && start.isSameOrBefore(weekEnd)
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
