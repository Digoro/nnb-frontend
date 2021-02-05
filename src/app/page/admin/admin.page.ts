import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonReorderGroup } from '@ionic/angular';
import { S3 } from 'aws-sdk';
import { CalendarComponentOptions, CalendarDay } from 'ion2-calendar';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Meeting, MeetingStatus } from 'src/app/model/meeting';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from './../../../environments/environment';
import { Configuration } from './../../model/configuration';
import { MeetingOption, RequestMeeting } from './../../model/meeting';
import { PaymentResult } from './../../model/payment';
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

  paymentAddFormGroup: FormGroup;
  calendarOptions: CalendarComponentOptions;
  selectedOptionsFromCalendar: MeetingOption[];
  selectedMeeting: Meeting;
  options: FormArray = new FormArray([]);
  price = 0;
  modalRef: BsModalRef;

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
    private cds: CheckDesktopService,
    private fb: FormBuilder,
    private modalService: BsModalService
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
        { key: 'uid.name', title: '결제자 이름' },
        { key: 'uid.nickname', title: '결제자 닉네임' },
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
        { key: 'cancel', title: '결제취소' },
      ];
    })
  }

  cancle(payment: PaymentResult) {
    alert('실제로 결제가 취소되지는 않습니다.');
    payment.isCanceled = true;
    this.paymentService.cancle(payment).subscribe(resp => {
      alert('취소 표시가 완료되었습니다.');
      this.setPay();
    })
  }

  cancleRollback(payment: PaymentResult) {
    alert('실제로 결제 취소가 되돌려지지는 않습니다.');
    payment.isCanceled = false;
    this.paymentService.cancle(payment).subscribe(resp => {
      alert('결제 취소를 되돌렸습니다.');
      this.setPay();
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
        { key: 'image', title: '이미지' },
        { key: 'meeting.title', title: '상품' },
        { key: 'user.nickName', title: '신청자' },
        { key: 'phone', title: '연락처' },
        { key: 'peopleNumber', title: '신청인원' },
        { key: 'desc', title: '문의 내용' },
        { key: 'isOld', title: '신청확인 여부' },
        { key: 'action', title: '버튼' },
      ];
    })
  }

  initForm() {
    this.paymentAddFormGroup = new FormGroup({
      meeting: new FormControl('', Validators.required),
      optionsForCount: new FormControl(''),
      options: this.fb.array([], Validators.required),
      PCD_PAYER_NAME: new FormControl('', this.formService.getValidators(500)),
      phone: new FormControl('', this.formService.getValidators(11, [Validators.pattern("[0-9 ]{11}")])),
      PCD_PAY_TOTAL: new FormControl('', [Validators.required, Validators.max(10000000)]),
      PCD_PAY_OID: new FormControl('', this.formService.getValidators(500)),
      PCD_PAY_TIME: new FormControl('', this.formService.getValidators(500)),
      PCD_PAY_TYPE: new FormControl('', Validators.required),
      PCD_PAY_BANKNAME: new FormControl('', Validators.maxLength(500)),
      PCD_PAY_BANKNUM: new FormControl('', Validators.maxLength(500)),
      PCD_PAY_CARDNAME: new FormControl('', Validators.maxLength(500)),
      PCD_PAY_CARDNUM: new FormControl('', Validators.maxLength(500)),
      PCD_PAY_CARDRECEIPT: new FormControl('', Validators.maxLength(2000)),
    })
    this.bannerFormGroup = new FormGroup({
      link: new FormControl('', this.formService.getValidators(500)),
      isDesktop: new FormControl(false),
    })
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      ignoreBackdropClick: true
    })
  }

  onSelectMeeting(meeting: Meeting) {
    this.calendarOptions = {
      color: 'primary',
      to: null,
      monthFormat: 'YYYY.MM',
      weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      monthPickerFormat: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      daysConfig: meeting.options.map(option => {
        return {
          date: moment(option.optionDate).toDate(),
          marked: true,
          disable: false,
          cssClass: '',
        }
      })
    }
    this.selectedOptionsFromCalendar = undefined;
    this.selectedMeeting = meeting;
    this.options.controls = [];
    this.options.reset();
    this.price = 0;
  }

  selectCalendar(event: CalendarDay) {
    this.options.controls = [];
    this.options.reset();
    const month = +moment(event.time).format('M')
    const day = +moment(event.time).get('D')

    const selectedOptions = this.selectedMeeting.options.filter(option => {
      const optionMonth = +moment(option.optionDate).format('M');
      const optionDay = +moment(option.optionDate).format('D');
      return month === optionMonth && day === optionDay;
    })
    this.selectedOptionsFromCalendar = selectedOptions;
  }

  changeCount(flag: boolean, option: MeetingOption) {
    const optionArray = this.options.controls.find(o => o.value.oid === option.oid);
    const count = flag ? +document.getElementById('optionCount' + option.oid)['value'] + 1 : +document.getElementById('optionCount' + option.oid)['value'] - 1;
    if (count > option.optionMaxParticipation) {
      alert(`최대 신청인원은 ${option.optionMaxParticipation}명 입니다.`);
      return;
    }
    document.getElementById('optionCount' + option.oid)['value'] = count;

    if (count > 0 && !optionArray) {
      this.addItem(option);
    } else if (count <= 0 && optionArray) {
      this.minusItem(option);
      document.getElementById('optionCount' + option.oid)['value'] = 0;
    } else if (count <= 0 && !optionArray) {
      document.getElementById('optionCount' + option.oid)['value'] = 0;
    } else if (count > 0 && optionArray) {
      optionArray.value.optionCount = count;
    }

    this.setPrice()
    this.options.controls = this.sortSelectedOptions(this.options.controls)
  }

  setPrice() {
    if (this.options.value.length > 0) {
      this.price = this.options.value.map(option => option.optionPrice * +option.optionCount).reduce((a, b) => a + b);
    }
  }

  createItem(option: MeetingOption) {
    return this.fb.group({
      oid: [option.oid, Validators.required],
      optionTitle: [option.optionTitle, Validators.required],
      optionPrice: [option.optionPrice, Validators.required],
      optionCount: [1, this.formService.getValidators(10, [Validators.min(1), Validators.max(999)])],
      optionDate: [option.optionDate]
    });
  }

  addItem(option: MeetingOption): void {
    this.options = this.paymentAddFormGroup.get('options') as FormArray;
    this.options.push(this.createItem(option));
  }

  minusItem(option: MeetingOption): void {
    this.options = this.paymentAddFormGroup.get('options') as FormArray;
    const value = this.options.value.find(o => o.oid === option.oid)
    const index = this.options.value.indexOf(value)
    this.options.removeAt(index);
  }

  sortSelectedOptions(controls: AbstractControl[]) {
    return controls.sort((a, b) => {
      if (moment(a.value.optionDate).isBefore(b.value.optionDate)) return -1;
      else if (moment(a.value.optionDate).isSame(b.value.optionDate)) return 0;
      else return 1;
    })
  }

  addPayment() {
    const { meeting, options, PCD_PAYER_NAME, phone, PCD_PAY_TOTAL, PCD_PAY_OID, PCD_PAY_TIME, PCD_PAY_TYPE,
      PCD_PAY_BANKNAME, PCD_PAY_BANKNUM, PCD_PAY_CARDNAME, PCD_PAY_CARDNUM, PCD_PAY_CARDRECEIPT } = this.paymentAddFormGroup.value;

    const result = new PaymentResult(0, meeting.mid, undefined, phone, undefined, '수기 결제 입력', undefined,
      undefined, undefined, PCD_PAY_OID, PCD_PAY_TYPE, undefined, undefined, undefined, undefined, undefined,
      undefined, meeting.title, PCD_PAY_TOTAL, undefined, undefined, undefined, PCD_PAY_BANKNAME, PCD_PAY_BANKNUM,
      PCD_PAY_TIME, undefined, undefined, undefined, PCD_PAYER_NAME, undefined, undefined, PCD_PAY_CARDNAME,
      PCD_PAY_CARDNUM, undefined, undefined, PCD_PAY_CARDRECEIPT, undefined, undefined, undefined);
    this.paymentService.writeDirectPayment(result, options, phone, undefined).then(resp => {
      this.paymentAddFormGroup.reset();
      this.options = new FormArray([]);
      this.selectedOptionsFromCalendar = undefined;
      this.selectedMeeting = undefined;
      this.price = 0;
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
