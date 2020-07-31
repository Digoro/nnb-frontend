import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import * as moment from 'moment';
import { Callable } from 'src/app/model/callable';
import { MeetingService } from 'src/app/service/meeting.service';
import { Meeting } from './../../model/meeting';
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
  cationMeetings: Meeting[];
  options: NativeTransitionOptions = {
    direction: 'left',
    duration: 500,
    slowdownfactor: 1,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
  };

  bannerSliderConfig = {
    initialSlide: 1,
    speed: 400,
    autoplay: {
      delay: 5000
    }
  }
  banners: { src: string, fn: Callable }[];

  constructor(
    private meetingService: MeetingService,
    private nativePageTransitions: NativePageTransitions,
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
      {
        src: 'assets/banner/banner06.jpg',
        fn: () => window.open('https://www.nonunbub.com/tabs/meetings?key=100cation&title=100%EC%BC%80%EC%9D%B4%EC%85%98%20%F0%9F%8E%A8%F0%9F%8E%A8')
      },
      {
        src: 'assets/banner/banner08.jpg',
        fn: () => window.open('https://www.notion.so/031ae74f97594bde85bb8580def7a253')
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
    this.meetingService.getAllMeetings().subscribe(meetings => {
      const temp = meetings.find(m => m.mid === 79);
      meetings = meetings.filter(m => m.mid === 79);
      meetings.unshift(temp);
      this.meetings = meetings.filter(meeting => !meeting.subTitle.includes('숲찾사') && !meeting.subTitle.includes('락앤롤'))
      this.fastMeetings = meetings.filter(meeting => {
        const start = moment(meeting._from);
        return start.isSameOrAfter(now) && start.isSameOrBefore(weekEnd)
      })
      this.forestMeetings = meetings.filter(meeting => meeting.subTitle.includes('숲찾사'))
      this.cationMeetings = meetings.filter(meeting => meeting.subTitle.includes('락앤롤'))
    });
  }

  search(event) {
    const search = event.target.value;
    alert('서비스 준비중입니다 ^^');
  }

  onClick(meeting: Meeting) {
    // this.nativePageTransitions.slide(this.options);
    this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
  }

  onShowAll(key: string, title: string) {
    this.router.navigate(['./tabs/meetings'], { queryParams: { key, title } });
  }
}
