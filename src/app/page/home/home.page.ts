import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { S3 } from 'aws-sdk';
import * as moment from 'moment';
import { Category } from 'src/app/model/category';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from 'src/environments/environment';
import { BandPost } from './../../model/band';
import { Magazine } from './../../model/magazine';
import { Meeting, MeetingStatus } from './../../model/meeting';
import { BandService } from './../../service/band.service';
import { CheckDesktopService } from './../../service/check-desktop.service';
import { MagazineService } from './../../service/magazine.service';
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
  sliderConfig = {
    observer: true,
    initialSlide: 0,
    slidesPerView: 4.1,
    breakpoints: {
      922: {
        slidesPerView: 2.2
      }
    },
    spaceBetween: 10
  };
  superHostList: any[] = [];
  @ViewChild('superHostTpl') superHostTpl: TemplateRef<any>;
  magazineList: Magazine[];
  @ViewChild('magazineTpl') magazineTpl: TemplateRef<any>;
  feedList: BandPost[];
  @ViewChild('feedTpl') feedTpl: TemplateRef<any>;

  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private cds: CheckDesktopService,
    private s3Service: S3Service,
    private magazineServie: MagazineService,
    private bandService: BandService
  ) {
    console.log('Home constructor');
  }

  ionViewWillEnter() {
    console.log('Home ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Home ionViewDidEnter');
    this.getMeetings();
    this.magazineServie.getList().subscribe(resp => {
      this.magazineList = resp.map(magazine => {
        magazine['template'] = this.magazineTpl;
        return magazine;
      });
    })
    this.bandService.getList().subscribe(resp => {
      this.feedList = resp.items.map(item => {
        item['template'] = this.feedTpl;
        return item;
      });
    })
    this.superHostList = [
      {
        uid: '326',
        name: '이진숙',
        image: 'https://nonunbub.s3.ap-northeast-2.amazonaws.com/meetings-resized/%EC%9D%B4%EC%A7%84%EC%88%99%20%EA%B0%80%EB%82%98%20%EC%95%84%ED%8A%B8%20%EC%A7%84%ED%96%89%28%EC%82%AC%EC%9D%B4%EC%A6%88%EC%88%98%EC%A0%95%29.jpg',
        tags: ['도슨트', '미술'],
        locale: '서울',
      },
      {
        uid: '341',
        name: '배연하',
        image: 'https://nonunbub.s3.ap-northeast-2.amazonaws.com/meetings-resized/%EB%B0%B0%EC%97%B0%ED%95%98%EB%8B%98%20%ED%98%B8%EC%8A%A4%ED%8A%B8%EC%86%8C%EA%B0%9C%20%EC%82%AC%EC%A7%84%28%EC%82%AC%EC%9D%B4%EC%A6%88%EC%88%98%EC%A0%95%29.jpg',
        tags: ['연홍도여행', '힐링'],
        locale: '전남 고흥',
      },
      {
        uid: '331',
        name: '김성학',
        image: 'https://nonunbub.s3.ap-northeast-2.amazonaws.com/meetings-resized/%EA%B9%80%EC%84%B1%ED%95%99%ED%98%B8%EC%8A%A4%ED%8A%B8%EC%86%8C%EA%B0%9C%EC%82%AC%EC%A7%84.jpg',
        tags: ['남한산성', '둘레길'],
        locale: '경기 성남',
      },
      {
        uid: '325',
        name: '변종원',
        image: 'https://nonunbub.s3.ap-northeast-2.amazonaws.com/meetings-resized/%E1%84%87%E1%85%A7%E1%86%AB%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%8B%E1%85%AF%E1%86%AB%E1%84%92%E1%85%A9%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3%E1%84%82%E1%85%B5%E1%86%B7.jpg',
        tags: ['목공예', '우든펜'],
        locale: '서울',
      },
      // {
      //   uid: '0',
      //   name: '고광자',
      //   image: 'https://nonunbub.s3.ap-northeast-2.amazonaws.com/meetings/%EA%B3%A0%EA%B4%91%EC%9E%90%20%EB%A9%94%EC%9D%B8%20%EC%82%AC%EC%9D%B4%EC%A6%88%20%EC%88%98%EC%A0%95%20121.jpg',
      //   tags: ['팜파티', '전통장'],
      //   locale: '전북 남원',
      // }
    ].map(host => {
      host['template'] = this.superHostTpl
      return host;
    })
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
      if (this.isDesktop) {
        this.banners = resp.filter(banner => banner.metadata.isdesktop === 'true');
      } else {
        this.banners = resp.filter(banner => banner.metadata.isdesktop !== 'true');
      }
    })
  }

  clickBanner(metadata: S3.Metadata) {
    window.open(metadata.link);
  }

  showAllMagazine() {
    this.router.navigate(['/tabs/magazine'])
  }

  showAllBand() {
    this.router.navigate(['/tabs/feed'])
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
      );
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
          title: '일주일 이내 열리는 모임', subTitle: `가장 빨리 만나 볼 수 있는 기회!(${this.toWeek} ~ ${this.fromWeek})`,
          onShowKey: 'week', onShowTitle: `일주일 이내 열리는 모임`, meetings: this.fastMeetings
        },
        {
          title: '노는법 X 길 위에 여행', emoji: '🚶🏻🚶🏻‍♂️🚶🏻‍♀️', subTitle: "길여행가와 떠나는 힐링 여행~",
          onShowKey: 'forest', onShowTitle: '노는법 X 길 위에 여행 🚶🏻🚶🏻‍♂️🚶🏻‍♀️', meetings: this.forestMeetings
        },
        {
          title: '인기 있는 모임', emoji: '👍👍', subTitle: "지금 노는법에서 가장 인기있는 모임!",
          onShowKey: 'all', onShowTitle: '인기 있는 모임 👍👍', meetings: this.meetings
        }
      ]
    });
  }

  search(event) {
    const search = event.target.value;
    alert('서비스 준비중입니다 ^^');
  }

  goDetailPage(meeting) {
    console.log(meeting);
  }
}
