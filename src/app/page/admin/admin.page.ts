import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonReorderGroup } from '@ionic/angular';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Meeting, MeetingStatus } from 'src/app/model/meeting';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from './../../../environments/environment';
import { Configuration } from './../../model/configuration';
import { ConfigurationService } from './../../service/configuration.service';
import { PaymentService } from './../../service/payment.service';
import { S3Service } from './../../service/s3.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  meetings: Meeting[];
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  configuration: Config;
  columns: Columns[];
  data;
  sigupEvent: Configuration;
  isShow = false;
  banners: { image: string, link: Promise<string> }[];
  selectedFiles: FileList;
  isUploading = false;
  @ViewChild('bannerImage') bannerImage: ElementRef;
  @ViewChild('bannerLink') bannerLink: ElementRef;
  link: string;

  constructor(
    private meetingService: MeetingService,
    private paymentService: PaymentService,
    private router: Router,
    private configService: ConfigurationService,
    private s3Service: S3Service
  ) { }

  setMeetings() {
    this.meetingService.getAllMeetings(MeetingStatus.ALL).subscribe(resp => {
      this.meetings = resp;
    })
  }

  setConfigurations() {
    this.configService.getAll().subscribe(resp => {
      const config = resp.find(c => c.key === ConfigurationService.SIGNUP_EVENT_KEY)
      this.sigupEvent = config;
    })
  }

  setBanners() {
    this.s3Service.getList(environment.folder.banner).then(resp => {
      this.banners = resp;
    })
  }

  ionViewDidLeave() {
    this.isShow = false;
  }

  ionViewDidEnter() {
    this.configService.getAll().subscribe(resp => {
      const config = resp.find(c => c.key === ConfigurationService.ADMIN_PW_KEY)
      const result = prompt("비밀번호를 입력해주세요");
      if (result === config.value) {
        this.isShow = true
        this.setMeetings();
        this.setConfigurations();
        this.setBanners();
        this.paymentService.getPurchasedInfoAll(undefined).subscribe(resp => {
          this.data = resp;
          this.configuration = { ...DefaultConfig };
          this.configuration.searchEnabled = true;
          this.configuration.horizontalScroll = true;
          this.columns = [
            { key: 'index', title: '번호' },
            { key: 'PCD_PAY_TIME', title: '결제 일시' },
            { key: 'uid', title: '결제자 닉네임' },
            // { key: 'uid.name', title: '결제자 이름' },
            { key: 'PCD_PAY_GOODS', title: '모임명' },
            { key: 'options', title: '구매 옵션' },
            { key: 'coupon', title: '쿠폰' },
            { key: 'phone', title: '휴대폰' },
            { key: 'PCD_PAY_TOTAL', title: '결제 금액' },
            { key: 'PCD_PAY_OID', title: '주문번호' },
            { key: 'PCD_PAY_MSG', title: '결제 메시지' },
            { key: 'PCD_PAY_TYPE', title: '결제 유형' },
            { key: 'PCD_PAY_RST', title: '결제 결과' },
            { key: 'mid', title: '모임 식별자' },
          ];
        })
      } else {
        alert('비밀번호가 틀렸습니다.');
        this.router.navigate(['/tabs/home']);
      }
    })
  }

  reorderMeeting(event) {
    let draggedItem = this.meetings.splice(event.detail.from, 1)[0];
    this.meetings.splice(event.detail.to, 0, draggedItem)
    const data = this.meetings.map((meeting, index) => {
      return { mid: meeting.mid, order: index }
    })
    this.meetingService.editMeetingOrders(data).subscribe(resp => {
      event.detail.complete();
    })
  }

  toggleMeeting(event, meeting: Meeting) {
    const status = event.detail.checked ? MeetingStatus.ENTERED : MeetingStatus.CREATED
    this.meetingService.editMeetingStatus(meeting.mid, status).subscribe(resp => {
      this.setMeetings();
    }, err => this.setMeetings())
  }

  toggleConfiguration(event, configuration: Configuration) {
    configuration.value = `${event.detail.checked}`;
    this.configService.update(configuration).subscribe(resp => {
      this.setConfigurations();
    }, err => this.setConfigurations())
  }

  goToDetail(mid: number) {
    this.router.navigate(['/tabs/meeting-detail', mid])
  }

  addBanner() {
    this.isUploading = true;
    const file = this.selectedFiles.item(0);
    this.s3Service.uploadFile(file, environment.folder.banner, this.link).then(resp => {
      this.setBanners();
      alert('배너 파일을 업로드 하였습니다.');
      this.resetBannerInput()
    }, err => this.resetBannerInput())
  }

  resetBannerInput() {
    this.bannerImage.nativeElement.value = '';
    this.bannerLink.nativeElement.value = '';
    this.isUploading = false;
    this.selectedFiles = undefined;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  deleteBanner(link: string) {
    this.s3Service.deleteFile(link, environment.folder.banner).then(resp => {
      alert('배너 파일을 삭제 하였습니다.')
      this.setBanners();
    })
  }
}
