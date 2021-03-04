import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonReorderGroup } from '@ionic/angular';
import { S3 } from 'aws-sdk';
import { CalendarComponentOptions, CalendarDay } from 'ion2-calendar';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Payment } from 'src/app/model/payment';
import { Product, ProductStatus } from 'src/app/model/product';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';
import { ProductService } from 'src/app/service/meeting.service';
import { ProductOption, ProductRequest } from '../../model/product';
import { environment } from './../../../environments/environment';
import { Configuration } from './../../model/configuration';
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
  configs: Configuration[];
  sigupEvent: Configuration;

  requestColumns: Columns[];
  requests: ProductRequest[];
  requestConfig: Config;
  requestPagination = {
    offset: 1,
    limit: 10,
    count: -1
  };

  products: Product[];
  ProductStatus = ProductStatus;
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  payColumns: Columns[];
  payments: Payment[];
  paymentConfig: Config;
  paymentPagination = {
    offset: 1,
    limit: 10,
    count: -1
  };
  paymentAddFormGroup: FormGroup;
  calendarOptions: CalendarComponentOptions;
  selectedOptionsFromCalendar: ProductOption[];
  selectedMeeting: Product;
  options: FormArray = new FormArray([]);
  price = 0;
  modalRef: BsModalRef;

  banners: { image: string, metadata: S3.Metadata }[];
  selectedFiles: FileList;
  isUploading = false;
  bannerFormGroup: FormGroup;

  isDesktop: boolean;

  constructor(
    private productService: ProductService,
    private paymentService: PaymentService,
    private configService: ConfigurationService,
    private s3Service: S3Service,
    private formService: FormService,
    private cds: CheckDesktopService,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) { }

  ionViewDidEnter() {
    this.initFormGroup();
    this.cds.isDesktop.subscribe(v => this.isDesktop = v);
    this.requestConfig = { ...DefaultConfig };
    this.requestConfig.searchEnabled = true;
    this.requestConfig.horizontalScroll = true;
    this.requestConfig.groupRows = true;
    this.requestColumns = [
      { key: 'index', title: '번호' },
      { key: 'image', title: '이미지' },
      { key: 'meeting.title', title: '상품' },
      { key: 'user.nickname', title: '신청자' },
      { key: 'phoneNumber', title: '연락처' },
      { key: 'peopleNumber', title: '신청인원' },
      { key: 'desc', title: '문의 내용' },
      { key: 'isOld', title: '신청확인 여부' },
      { key: 'action', title: '버튼' },
    ];
    this.setRequests(1, 10);
    this.setConfigurations();
    this.setProducts();
    this.paymentConfig = { ...DefaultConfig };
    this.paymentConfig.searchEnabled = true;
    this.paymentConfig.horizontalScroll = true;
    this.payColumns = [
      { key: 'index', title: '번호' },
      { key: 'representationPhoto', title: '이미지' },
      { key: 'payAt', title: '결제 일시' },
      { key: 'title', title: '모임명' },
      { key: 'name', title: '결제자' },
      { key: 'nickname', title: '닉네임' },
      { key: 'phoneNumber', title: '휴대폰' },
      { key: 'orderItems', title: '구매옵션' },
      { key: 'coupon', title: '쿠폰' },
      { key: 'pgName', title: 'PG사' },
      { key: 'payPrice', title: '결제금액' },
      { key: 'id', title: '주문번호' },
      { key: 'resultMessage', title: '결제메시지' },
      { key: 'payMethod', title: '결제유형' },
      { key: 'result', title: '결제결과' }
    ];
    this.setPayments(1, 10);
    this.setBanners();
  }

  // event
  setConfigurations() {
    this.configService.getAll().subscribe(resp => {
      this.configs = resp;
      const config = resp.find(c => c.key === ConfigurationService.SIGNUP_EVENT_KEY)
      this.sigupEvent = config;
    })
  }

  toggleConfiguration(event, configuration: Configuration) {
    configuration.value = `${event.detail.checked}`;
    this.configService.update(configuration).subscribe(resp => {
      this.setConfigurations();
    }, err => this.setConfigurations())
  }

  // produt
  setProducts() {
    this.productService.search({ page: 1, limit: 99999, status: ProductStatus.ALL }).subscribe(resp => {
      this.products = resp.items;
    })
  }

  reorderProduct(event) {
    let draggedItem = this.products.splice(event.detail.from, 1)[0];
    this.products.splice(event.detail.to, 0, draggedItem)
    const data = this.products.map((meeting, index) => {
      return { id: meeting.id, dto: { sortOrder: index } }
    })
    this.productService.updateProductSortOrder(data).subscribe(resp => {
      event.detail.complete();
    });
    event.detail.complete();
  }

  toggleProduct(event, meeting: Product) {
    const status = event.detail.checked ? ProductStatus.ENTERED : ProductStatus.CREATED
    this.productService.manageProduct(meeting.id, { status }).subscribe(resp => {
      this.setProducts();
    }, err => this.setProducts())
  }

  // payment
  setPayments(page: number, limit: number) {
    this.paymentService.getPaymentsAll({ page, limit }).subscribe(resp => {
      this.payments = resp.items;
      this.paymentPagination = { limit: resp.meta.itemsPerPage, offset: resp.meta.currentPage, count: resp.meta.totalItems };
    })
  }

  onPaymentTableEvent(event: any): void {
    if (event.event === 'onPagination') {
      this.setPayments(event.value.page, event.value.limit);
    }
  }

  initFormGroup() {
    this.paymentAddFormGroup = new FormGroup({
      meeting: new FormControl('', Validators.required),
      optionsForCount: new FormControl(''),
      options: this.fb.array([], Validators.required),
      PCD_PAYER_NAME: new FormControl('', this.formService.getValidators(500)),
      phoneNumber: new FormControl('', this.formService.getValidators(11, [Validators.pattern("[0-9 ]{11}")])),
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

  onSelectProduct(meeting: Product) {
    this.calendarOptions = {
      color: 'primary',
      to: null,
      monthFormat: 'YYYY.MM',
      weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      monthPickerFormat: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      daysConfig: meeting.options.map(option => {
        return {
          date: moment(option.date).toDate(),
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
      const optionMonth = +moment(option.date).format('M');
      const optionDay = +moment(option.date).format('D');
      return month === optionMonth && day === optionDay;
    })
    this.selectedOptionsFromCalendar = selectedOptions;
  }

  changeCount(flag: boolean, option: ProductOption) {
    const optionArray = this.options.controls.find(o => o.value.id === option.id);
    const count = flag ? +document.getElementById('count' + option.id)['value'] + 1 : +document.getElementById('count' + option.id)['value'] - 1;
    if (count > option.maxParticipants) {
      alert(`최대 신청인원은 ${option.maxParticipants}명 입니다.`);
      return;
    }
    document.getElementById('count' + option.id)['value'] = count;

    if (count > 0 && !optionArray) {
      this.addItem(option);
    } else if (count <= 0 && optionArray) {
      this.minusItem(option);
      document.getElementById('count' + option.id)['value'] = 0;
    } else if (count <= 0 && !optionArray) {
      document.getElementById('count' + option.id)['value'] = 0;
    } else if (count > 0 && optionArray) {
      optionArray.value.count = count;
    }

    this.setPrice()
    this.options.controls = this.sortSelectedOptions(this.options.controls)
  }

  sortSelectedOptions(controls: AbstractControl[]) {
    return controls.sort((a, b) => {
      if (moment(a.value.date).isBefore(b.value.date)) return -1;
      else if (moment(a.value.date).isSame(b.value.date)) return 0;
      else return 1;
    })
  }

  setPrice() {
    if (this.options.value.length > 0) {
      this.price = this.options.value.map(option => option.price * +option.count).reduce((a, b) => a + b);
    }
  }

  createItem(option: ProductOption) {
    return this.fb.group({
      id: [option.id, Validators.required],
      name: [option.name, Validators.required],
      description: [option.name, Validators.required],
      price: [option.price, Validators.required],
      count: [1, this.formService.getValidators(10, [Validators.min(1), Validators.max(999)])],
      date: [option.date]
    });
  }

  addItem(option: ProductOption): void {
    this.options = this.paymentAddFormGroup.get('options') as FormArray;
    this.options.push(this.createItem(option));
  }

  minusItem(option: ProductOption): void {
    this.options = this.paymentAddFormGroup.get('options') as FormArray;
    const value = this.options.value.find(o => o.id === option.id)
    const index = this.options.value.indexOf(value)
    this.options.removeAt(index);
  }

  addPayment() {
    const { meeting, options, PCD_PAYER_NAME, phoneNumber, PCD_PAY_TOTAL, PCD_PAY_OID, PCD_PAY_TIME, PCD_PAY_TYPE,
      PCD_PAY_BANKNAME, PCD_PAY_BANKNUM, PCD_PAY_CARDNAME, PCD_PAY_CARDNUM, PCD_PAY_CARDRECEIPT } = this.paymentAddFormGroup.value;

    const result = new PaymentResult(0, meeting.id, undefined, phoneNumber, undefined, '수기 결제 입력', undefined,
      undefined, undefined, PCD_PAY_OID, PCD_PAY_TYPE, undefined, undefined, undefined, undefined, undefined,
      undefined, meeting.title, PCD_PAY_TOTAL, undefined, undefined, undefined, PCD_PAY_BANKNAME, PCD_PAY_BANKNUM,
      PCD_PAY_TIME, undefined, undefined, undefined, PCD_PAYER_NAME, undefined, undefined, PCD_PAY_CARDNAME,
      PCD_PAY_CARDNUM, undefined, undefined, PCD_PAY_CARDRECEIPT, undefined, undefined, undefined);
    this.paymentService.writeDirectPayment(result, options, phoneNumber, undefined).then(resp => {
      this.paymentAddFormGroup.reset();
      this.options = new FormArray([]);
      this.selectedOptionsFromCalendar = undefined;
      this.selectedMeeting = undefined;
      this.price = 0;
    })
  }

  // request
  setRequests(page: number, limit: number) {
    this.productService.getProductRequests({ page, limit }).subscribe(resp => {
      this.requests = resp.items;
      this.requestPagination = { limit: resp.meta.itemsPerPage, offset: resp.meta.currentPage, count: resp.meta.totalItems };
    });
  }

  check(id: number) {
    this.productService.checkRequestProduct(id, true).subscribe(resp => {
      this.setRequests(this.requestPagination.offset, this.requestPagination.limit);
    })
  }

  onRequestTableEvent(event: any): void {
    if (event.event === 'onPagination') {
      this.setRequests(event.value.page, event.value.limit);
    }
  }

  // banner
  setBanners() {
    this.s3Service.getList(environment.folder.banner).subscribe(resp => {
      this.banners = resp;
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
