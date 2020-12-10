import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonReorderGroup } from '@ionic/angular';
import { S3 } from 'aws-sdk';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Meeting, MeetingStatus } from 'src/app/model/meeting';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from './../../../environments/environment';
import { Configuration } from './../../model/configuration';
import { RequestMeeting } from './../../model/meeting';
import { ConfigurationService } from './../../service/configuration.service';
import { FormService } from './../../service/form.service';
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

  payColumns: Columns[];
  payData;
  payConfiguration: Config;

  requestColumns: Columns[];
  requestData: RequestMeeting[];
  requestConfiguration: Config;

  sigupEvent: Configuration;
  isShow = false;
  banners: { image: string, metadata: S3.Metadata }[];
  selectedFiles: FileList;
  isUploading = false;
  bannerFormGroup: FormGroup;

  isDesktop: boolean;

  constructor(
    private meetingService: MeetingService,
    private paymentService: PaymentService,
    private router: Router,
    private configService: ConfigurationService,
    private s3Service: S3Service,
    private formService: FormService,
    private cds: CheckDesktopService
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
    this.s3Service.getList(environment.folder.banner).subscribe(resp => {
      this.banners = resp;
    })
  }

  setPay() {
    this.paymentService.getPurchasedInfoAll(undefined).subscribe(resp => {
      this.payData = resp.reverse();
      this.payConfiguration = { ...DefaultConfig };
      this.payConfiguration.searchEnabled = true;
      this.payConfiguration.horizontalScroll = true;
      this.payColumns = [
        { key: 'index', title: '번호' },
        { key: 'image', title: '이미지' },
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
  }

  setRequests() {
    this.meetingService.getRequestMeetingAll().subscribe(resp => {
      this.requestData = resp;
      this.requestConfiguration = { ...DefaultConfig };
      this.requestConfiguration.searchEnabled = true;
      this.requestConfiguration.horizontalScroll = true;
      this.requestConfiguration.groupRows = true;
      this.requestColumns = [
        { key: 'index', title: '번호' },
        { key: 'meeting.title', title: '상품' },
        { key: 'user.nickName', title: '신청자' },
        { key: 'phone', title: '연락처' },
        { key: 'peopleNumber', title: '신청인원' },
        { key: 'desc', title: '문의 내용' },
        { key: 'isOld', title: '확인여부' },
        { key: 'action', title: '버튼' },
      ];
    })
  }

  initForm() {
    this.bannerFormGroup = new FormGroup({
      link: new FormControl('', this.formService.getValidators(500)),
      isDesktop: new FormControl(false),
    })
  }

  onFileChange(event) {
    const fileTypes = ["image/gif", "image/jpeg", "image/png"];
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (fileTypes.find(t => t === file.type)) {
        this.selectedFiles = event.target.files;
      } else {
        alert(`이미지 형식만 가능합니다. (${fileTypes})`);
      }
    } else {
      alert(`파일이 선택되지 않았습니다.`);
    }
  }

  check(row: RequestMeeting) {
    row.isOld = true;
    this.meetingService.checkRequestMeeting(row).subscribe(resp => {
      this.setRequests();
    })
  }

  ionViewDidLeave() {
    this.isShow = false;
  }

  ionViewDidEnter() {
    this.cds.isDesktop.subscribe(v => this.isDesktop = v);
    this.configService.getAll().subscribe(resp => {
      const config = resp.find(c => c.key === ConfigurationService.ADMIN_PW_KEY)
      const result = prompt("비밀번호를 입력해주세요");
      if (result === config.value) {
        this.isShow = true
        this.setMeetings();
        this.setConfigurations();
        this.setBanners();
        this.setPay();
        this.setRequests();
        this.initForm();
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
    this.meetingService.updateMeetingStatus(meeting.mid, status).subscribe(resp => {
      this.setMeetings();
    }, err => this.setMeetings())
  }

  toggleConfiguration(event, configuration: Configuration) {
    configuration.value = `${event.detail.checked}`;
    this.configService.update(configuration).subscribe(resp => {
      this.setConfigurations();
    }, err => this.setConfigurations())
  }

  addBanner() {
    this.isUploading = true;
    const image = this.selectedFiles.item(0);
    const { link, isDesktop } = this.bannerFormGroup.value;
    this.s3Service.uploadFile(image, environment.folder.banner, { link, isdesktop: `${isDesktop}` }).then(resp => {
      this.setBanners();
      alert('배너 파일을 업로드 하였습니다.');
      this.resetBannerInput()
    }, err => this.resetBannerInput())
  }

  resetBannerInput() {
    this.bannerFormGroup.reset();
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
