import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventClickArg, FullCalendarComponent } from '@fullcalendar/angular';
import * as CronConverter from 'cron-converter';
import * as moment from 'moment';
import 'moment/locale/ko';
import { BsDaterangepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxCronUiConfig } from 'ngx-cron-ui/lib/model/model';
import { QuillEditorComponent } from 'ngx-quill';
import { Meeting } from 'src/app/model/meeting';
import { FormService } from 'src/app/service/form.service';
import { environment } from 'src/environments/environment';
import { CheckDesktopService } from './../../service/check-desktop.service';
import { S3Service } from './../../service/s3.service';
declare var daum: any;

@Component({
  selector: 'meeting-control',
  templateUrl: './meeting-control.component.html',
  styleUrls: ['./meeting-control.component.scss'],
})
export class MeetingControlComponent implements OnInit, AfterViewInit {
  @Input() formGroup: FormGroup;
  @Input() quillStyle;
  @Input() categories;
  @Input() previewImage: string | ArrayBuffer;
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() zoom: number;
  @Input() previewMeeting: Meeting;
  @Input() submitMessage: string;

  @Output() onNextEvent = new EventEmitter();
  @Output() onPrevEvent = new EventEmitter();
  @Output() onLastCheckEvent = new EventEmitter();
  @Output() onFileChangeEvent = new EventEmitter();
  @Output() onCheckDiscountPriceEvent = new EventEmitter();
  @Output() onCheckRefundPolicy0Event = new EventEmitter();
  @Output() onChangeAddressEvent = new EventEmitter();
  @Output() onAddEvent = new EventEmitter();
  @Output() onQuillLoadEvent = new EventEmitter();

  isDesktop = false;
  isShowMenu = false;
  isLoad = false;

  @ViewChild('quill') quill: QuillEditorComponent;
  @ViewChild('quill2') quill2: QuillEditorComponent;

  ngxCronUiConfig: NgxCronUiConfig = {
    option: { minute: false, hour: false, year: false },
    isSetDefaultValue: true,
    isBaseFrequencyNewLine: true
  }

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    buttonText: {
      today: '오늘'
    },
    editable: false,
    selectable: true,
    height: 600
  };
  hours = [];
  minutes = [];

  optionAddFormGroup: FormGroup;
  optionDeleteFormGroup: FormGroup;
  searchedOptions: any[];
  options: FormArray;
  modalRef: BsModalRef;
  addModalRef: BsModalRef;
  deleteModalRef: BsModalRef;
  canFormRestModal: boolean;

  isInitialOptionLoad = true;
  @ViewChild(BsDaterangepickerDirective, { static: false }) datapickerDirective;
  noticeChcked = false;
  descriptions: { title: string, descList: string[], moreDescList?: string[], image?: string }[];
  inputDesc: { title: string, descList: string[] }
  daumUrl = "https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js?autoload=false";
  geoCoder: google.maps.Geocoder;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    private cds: CheckDesktopService,
    private formService: FormService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private localeService: BsLocaleService,
    private s3Service: S3Service,
    private el: ElementRef,
  ) { }

  loadDaumApi() {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      script.src = this.daumUrl;
      script.type = 'text/javascript';
      script.async = true;
      this.el.nativeElement.appendChild(script);
      resolve(true);
    });
  }

  loadPostCode() {
    new daum.postcode.load(() => {
      new daum.Postcode({
        oncomplete: (data) => {
          this.onChangeAddressEvent.emit(data);
        }
      }).open();
    });
  }

  ngOnInit() {
    this.loadDaumApi().then(() => {
      console.log('Daum api has been loaded.');
    });
    this.isLoad = false;
    this.descriptions = [
      {
        title: '상품을 잘 표현하는 직관적인 한 문장을 만들어 주세요',
        descList: [
          '제목은 노출되는 상품 목록에서 고객에게 어필할 수 있는 첫 문구입니다.',
          '상품 주제를 정확하고 간결하게 표현해 주세요.',
          '지역명, 일정 등의 정보가 포함된 제목은 전달에 더욱 효과적입니다.',
          '캐치프레이즈는 제목과 연결되는 매력 포인트를 적어 주세요.'],
        moreDescList: [
          '어떤 제목과 캐치프레이즈가 좋을지 여전히 고민이신가요?',
          '<a target="_blank"  href="https://www.notion.so/gdgdaejeon/22a178f222b743e09925324db6028677">제목 가이드</a>에서 다양한 사례와 팁을 참고해 보세요!']
      },
      {
        title: '고객의 클릭을 유도하는 대표 이미지를 등록해 주세요',
        descList: [
          '상품 목록에서 고객에게 제일 먼저 노출되는 대표 이미지입니다.',
          '상품의 특성이 잘 드러난 이미지가 좋습니다.',
          '텍스트가 포함된 이미지 사용은 되도록 지양해 주세요.',
          '이미지 사이즈는 1440 x 1080px 또는 4:3 비율로 만들어 주세요.'],
        moreDescList: [
          '대표 이미지가 상품의 첫 인상을 결정해요!',
          '<a target="_blank"  href="https://www.notion.so/gdgdaejeon/2654a665f54947cabfe835d7307116c8">대표 이미지 가이드</a>에서 다양한 사례와 팁을 참고해 보세요!']
      },
      {
        title: '상품이 속하는 카테고리를 하나 선택해 주세요',
        descList: [
          '한 개의 카테고리만 선택할 수 있습니다.',
          '상품의 성격과 맞지 않는 카테고리를 선택할 경우 임의로 수정될 수 있습니다.']
      },
      {
        title: '만남을 위한 구체적인 장소와 소요시간을 알려주세요.',
        descList: [
          "'장소'에는 도로명 주소를, '상세 장소'에는 구체적인 장소를 기입해 주세요.",
          "'소요 시간'에는 상품을 진행하는데 걸리는 총 소요 시간을 기입해 주세요"
        ]
      },
      {
        title: '상품에 참여하기 위한 가격을 설정해 주세요',
        descList: [
          "메인 화면에 노출되는 가격입니다.",
          "가격의 자릿수 구분을 위해 [,]이나 [.]을 사용하지 말고 숫자만 기입해 주세요.",
          "'가격'에는 상품의 원래 가격을 기입해 주세요. (무료 상품인 경우 '0'을 기입해 주세요)",
          "'할인된 가격'은 '0' 또는 할인된 가격을 기입해 주세요."
        ]
      },
      {
        title: '상품의 옵션을 설정해 주세요.',
        descList: [
          "상품의 구성(이름, 가격 등)이 여러 개인 경우 구매 옵션을 나누어 설정할 수 있습니다.",
          "모이는 장소가 다른 경우는 '구매 옵션'을 나누지 마시고 상품을 새로 등록해 주세요.",
          "'일괄 추가하기' 버튼을 누르고 등록할 상품의 옵션을 간편하게 추가하세요.",
          "'일괄 삭제하기' 버튼을 누르고 등록한 상품의 옵션을 간편하게 삭제할 수 있습니다."
        ],
        moreDescList: [
          "구매 옵션이 무엇인지 이해가 잘 안 되시나요?",
          '<a target="_blank"  href="https://www.notion.so/gdgdaejeon/74bcdc48ed7a427596e1e89fa8c2624a">구매 옵션 가이드</a>에서 다양한 사례와 팁을 참고해 보세요!'
        ]
      },
      {
        title: '상품을 소개하는 매력적인 글과 이미지를 기입해 주세요.',
        descList: [
          "맞춤법이 맞지 않거나 오타가 있을 경우 임의로 수정될 수 있으며, 검수 절차로 인해 상품 판매가 늦어질 수 있습니다. ",
          "너무 긴 글과 많은 사진 사용은 오히려 가독성을 떨어뜨려 쉽게 피로를 유발합니다.",
          "참여자들이 어떤 즐거운 경험을 할 수 있는지, 무엇을 얻어갈 수 있는지 상상해볼 수 있도록 작성해 주세요."
        ],
        moreDescList: [
          '어떻게 써야 할지 도저히 감이 잡히지 않는다면',
          '<a target="_blank"  href="https://www.notion.so/gdgdaejeon/feba97e2a6974efaaedbac4e4eaca40e">상품 소개 예시</a>에서 다양한 사례와 팁을 참고해 보세요!'
        ]
      },
      {
        title: '참여자가 직접 준비해야 할 것을 기입해 주세요.',
        descList: [
          "원활한 진행을 위해 참여자가 꼭 준비해야 할 것을 적어주세요.",
          "깜빡 잊은 바람에 못챙겨올 수 있는 물건을 세심하게 한 번 더 챙겨주셔도 좋아요."
        ]
      },
      {
        title: '참여자에게 당부하거나 중요하게 안내하고 싶은 사항에 관해 기입해 주세요.',
        descList: [
          "최소 인원 모객 미달 또는 천재 지변으로 인한 취소 등 안내사항에 관해 언급해 주세요.",
          "딱히 유의사항이 생각나지 않는다면 '노는법 정책을 따르겠습니다'를 체크해 주세요.",
          "노는법의 유의사항 기본 정책에 추가 또는 삭제 하셔도 괜찮습니다.",
          "유의사항은 추후 참여자와 문제 발생시 중요하게 다뤄지는 증빙자료이기 때문에 신중히 작성해 주세요."
        ]
      },
      {
        title: '상품 시작일을 기준으로 한 환불정책을 기입해 주세요.',
        descList: [
          "노는법의 기본 환불 정책은 상품 시작일 자정을 기준으로 합니다.",
          "노는법의 기본 환불 정책은 환불 불가 / 50% 환불 / 전액 환불을 기준으로 합니다.",
          "판매자님께서는 '환불 불가 일'과 '전액 환불 일'을 설정하실 수 있습니다.",
          "환불 불가 일과 전액 환불 일 사이의 날짜는 모두 50% 환불 일로 자동 설정됩니다."
        ],
        image: '/assets/refund-policy.jpg'
      },
      {
        title: '상품의 상세페이지 내용을 마지막으로 한 번 더 확인해 주세요',
        descList: [
          "최종 확인 페이지가 나오지 않는다면 아직 작성이 안 된 부분이 있는 것이니, 한 번 더 꼼꼼히 확인해 주세요.",
          "상품 최종 확인 페이지에 문제가 없다면 '모임 만들기 완료!' 버튼을 눌러주세요!",
          "상품 등록이 완료되면 승인을 위한 심사가 진행됩니다.",
        ]
      },
    ]
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
    this.modalService.onHidden.subscribe(() => {
      if (this.canFormRestModal) {
        this.optionAddFormGroup.reset();
        this.optionDeleteFormGroup.reset();
        this.searchedOptions = undefined;
      } else {
        this.canFormRestModal = true;
      }
    })
    this.calendarOptions.eventClick = (selectInfo: EventClickArg) => {
      const { optionTitle, optionDate, optionMaxParticipation, optionMinParticipation, optionPrice } = selectInfo.event._def.extendedProps;
      alert(`옵션: ${optionTitle}\n가격: ${optionPrice}원\n최소인원: ${optionMinParticipation}명\n최대인원: ${optionMaxParticipation}명`)
    }
    for (let i = 0; i < 24; i++) {
      this.hours.push(i)
    }
    for (let i = 0; i < 60; i += 15) {
      this.minutes.push(i)
    }
    this.optionAddFormGroup = new FormGroup({
      oid: new FormControl(''),
      optionTitle: new FormControl('', this.formService.getValidators(100)),
      optionPrice: new FormControl('', this.formService.getValidators(10, [Validators.min(0), Validators.max(10000000)])),
      optionMinParticipation: new FormControl('', this.formService.getValidators(10, [Validators.min(1), Validators.max(1000)])),
      optionMaxParticipation: new FormControl('', this.formService.getValidators(10, [Validators.min(1), Validators.max(1000)])),
      optionPeriod: new FormControl('', Validators.required),
      schedule: new FormControl('', Validators.required),
    })

    this.optionDeleteFormGroup = new FormGroup({
      oid: new FormControl(''),
      optionPeriod: new FormControl('', Validators.required),
      schedule: new FormControl('', Validators.required),
    })

    this.optionAddFormGroup.valueChanges.subscribe(value => {
      const min = this.optionAddFormGroup.controls.optionMinParticipation;
      const period = this.optionAddFormGroup.controls.optionPeriod;

      if (+value.optionMinParticipation && +value.optionMaxParticipation) {
        if (+value.optionMinParticipation > +value.optionMaxParticipation) {
          min.setErrors({ 'isUpper': true })
        } else {
          if (min.hasError('isUpper')) {
            const { isUpper, ...errors } = min.errors;
            min.setErrors(errors);
            min.updateValueAndValidity({ emitEvent: false })
          }
        }
      }

      if (value.optionPeriod) {
        const fromValue = value.optionPeriod[0];
        const toValue = value.optionPeriod[1];
        if (Math.abs(moment(toValue).diff(moment(fromValue), 'days')) > 365) {
          period.setErrors({ 'maxDurationDays': true })
        } else {
          if (period.hasError('maxDurationDays')) {
            const { maxDurationDays, ...errors } = period.errors;
            period.setErrors(errors);
            period.updateValueAndValidity({ emitEvent: false })
          }
        }
      }
    })

    this.localeService.use('ko');
  }

  openModal(template: TemplateRef<any>, key?: string) {
    const config = {
      class: 'modal-sm',
      animated: false,
      backdrop: false
    }
    this.canFormRestModal = false;
    switch (key) {
      case 'period': {
        this.inputDesc = {
          title: '스케줄 기간', descList: [
            '옵션을 언제부터 언제까지 판매할 건지 전체 기간을 설정해 주세요.',
            '(ex. 2021.05.01 - 2021.06.16)'
          ]
        }
        this.modalRef = this.modalService.show(template, config);
        break;
      };
      case 'schedule': {
        this.inputDesc = {
          title: '스케줄', descList: [
            '상품을 매월 / 매주 / 매일 중 어떤 일정으로 진행할 지 먼저 선택해 주세요. ',
            '요일 / 일 / 시간은 복수 선택이 가능합니다. (CTRL을 누른 채로 클릭하세요)',
            '(ex. 매월 5일 15일 25일 12:00시 / 매주 화, 수, 목 10:00시, 14:00시 / 매일 18:00시)'
          ]
        }
        this.modalRef = this.modalService.show(template, config);
        break;
      };
      case 'desc': {
        this.inputDesc = {
          title: '옵션 설명', descList: [
            '옵션을 구분할 수 있는 설명을 짧고 간결하게 작성해 주세요.',
            '(ex. 자전거 인문학 투어 60분 코스 / 훌라댄스 원데이클래스 1시간)'
          ]
        }
        this.modalRef = this.modalService.show(template, config);
        break;
      };
      case 'price': {
        this.inputDesc = {
          title: '가격', descList: [
            '고객이 결제할 실제 가격을 기입해 주세요.'
          ]
        }
        this.modalRef = this.modalService.show(template, config);
        break;
      };
      case 'period-delete': {
        this.inputDesc = {
          title: '스케줄 기간', descList: [
            '삭제하고자 하는 옵션의 전체 기간을 설정해 주세요.',
            '(ex. 10월 1일 ~ 12월 31일)'
          ]
        }
        this.modalRef = this.modalService.show(template, config);
        break;
      };
      case 'schedule-delete': {
        this.inputDesc = {
          title: '스케줄', descList: [
            '삭제하고자 하는 옵션의 스케줄을 시간/분 단위까지 입력한 후 조회하기를 누르세요.'
          ]
        }
        this.modalRef = this.modalService.show(template, config);
        break;
      };
      case 'add': {
        config.class = 'modal-lg';
        config.animated = true;
        config.backdrop = 'static' as any;
        this.canFormRestModal = true;
        this.addModalRef = this.modalService.show(template, config);
        break;
      };
      case 'delete': {
        config.class = 'modal-lg';
        config.animated = true;
        config.backdrop = 'static' as any;
        this.canFormRestModal = true;
        this.deleteModalRef = this.modalService.show(template, config);
        break;
      };
    }
  }

  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;
      if ((isHovered && !!navigator.platform && /iPad|iPhone|iPod|Apple/.test(navigator.platform)) && 'ontouchstart' in window) {
        (this.datapickerDirective as any)._datepickerRef.instance.daySelectHandler(cell);
      }
      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }

  checkAllowPolicy(event) {
    const isChecked = event.target.checked;
    this.noticeChcked = isChecked;
    const value = `✔ 최소 인원 모객 미달로 인해 모임 오픈이 취소되는 경우 참가비는 전액 환불됩니다.
✔ 노는법의 모든 모임은 다수의 인원이 참여하는 프로그램이므로, 발열/호흡기 관련 증상, 감기 등의 질병이 발생한 분들은 참여를 지양해주세요.
✔ 모임 참가 시에는 마스크 착용, 손 소독제 활용 등으로 안전에 특히 유의해주세요.
✔ 일정 변동 없이 진행되는 모임은 하단의 환불 규정을 따릅니다. 참여가 우려되시는 분들은 구매 시 신중한 선택 부탁드리며, 환불 규정을 숙지하여 기한 내 환불 신청 바랍니다.`
    if (isChecked) {
      if (this.formGroup.controls.notice.value !== '') {
        const result = confirm("기존 작성한 유의사항 내용이 사라집니다.");
        if (result) {
          this.formGroup.controls.notice.setValue(value);
        } else {
          setTimeout(() => this.noticeChcked = false)
        }
      } else {
        this.formGroup.controls.notice.setValue(value);
      }
    }
  }

  getEditorInstance(editorInstance: any, index: number) {
    const fileTypes = ["image/gif", "image/jpeg", "image/png"];
    let toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();
      input.onchange = () => {
        const editor = index === 1 ? this.quill.quillEditor : this.quill2.quillEditor;
        const range = editor.getSelection();
        editor.insertEmbed(range.index, 'image', '/assets/loading.gif');
        editor.formatText(range.index, 1, 'width', '25px');
        const file = input.files[0];

        if (fileTypes.find(t => t === file.type)) {
          this.s3Service.uploadFile(file, environment.folder.meeting).then(res => {
            this.s3Service.resizeImage(res.Key).subscribe(resp => {
              console.log(resp);
              const link = res.Location.replace("/meetings", "/meetings-resized");
              editor.deleteText(range.index, 1);
              editor.insertEmbed(range.index, 'text', `\n\n\n`, 'user');
              editor.insertEmbed(range.index, 'image', `${link}`, 'user');
            })
          })
        } else {
          alert(`이미지 형식만 가능합니다. (${fileTypes})`);
          editor.deleteText(range.index, 1);
        }
      };
    })
  }

  setCalendar() {
    setTimeout(() => {
      const api = this.calendarComponent.getApi();
      if (this.isInitialOptionLoad) {
        api.addEventSource(this.formGroup.controls.options.value.map(option => {
          return {
            id: option.oid,
            oid: option.oid,
            optionTitle: option.optionTitle,
            optionPrice: option.optionPrice,
            optionMinParticipation: option.optionMinParticipation,
            optionMaxParticipation: option.optionMaxParticipation,
            optionDate: option.optionDate,
            date: option.optionDate,
            title: option.optionTitle
          }
        }))
        this.isInitialOptionLoad = false;
      }
      api.setOption('locale', 'ko')
      api.updateSize();
    })
  }

  ngAfterViewInit(): void {
    this.onQuillLoadEvent.emit(this.quill);
  }

  showMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  next(isMeetingOptionView?: boolean) {
    if (isMeetingOptionView) this.setCalendar();
    this.onNextEvent.emit();
  }

  prev(isMeetingOptionView?: boolean) {
    if (isMeetingOptionView) this.setCalendar();
    this.onPrevEvent.emit();
  }

  lastCheck() {
    this.onLastCheckEvent.emit();
  }

  onFileChange(event) {
    this.onFileChangeEvent.emit(event);
    this.fileInput.nativeElement.value = '';
  }

  checkDiscountPrice() {
    this.onCheckDiscountPriceEvent.emit();
  }

  checkRefundPolicy0() {
    this.onCheckRefundPolicy0Event.emit();
  }

  changeSchedule(cron, isAdd: boolean) {
    if (cron === "* * * * *") {
      this.optionAddFormGroup.controls.schedule.setErrors({ 'required': true })
      this.optionDeleteFormGroup.controls.schedule.setErrors({ 'required': true })
      return;
    }

    if (isAdd) {
      this.optionAddFormGroup.controls.schedule.patchValue(cron)
    } else {
      this.optionDeleteFormGroup.controls.schedule.patchValue(cron)
    }
  }

  addSchedule() {
    const title = this.optionAddFormGroup.controls.optionTitle.value;
    const price = this.optionAddFormGroup.controls.optionPrice.value;
    const min = this.optionAddFormGroup.controls.optionMinParticipation.value;
    const max = this.optionAddFormGroup.controls.optionMaxParticipation.value;
    const period = this.optionAddFormGroup.controls.optionPeriod.value;
    const cron = this.optionAddFormGroup.controls.schedule.value;
    const start = moment(period[0]).format("YYYY-MM-DD");
    const end = moment(period[1]).format("YYYY-MM-DD");
    let newEvents = [];
    let cronInstance = new CronConverter();
    cronInstance.fromString(cron);
    let schedule = cronInstance.schedule();
    schedule = cronInstance.schedule(start);
    while (true) {
      const event = schedule.next();
      const date = event.format("YYYY-MM-DD");
      if (moment(date).isAfter(moment(end))) {
        break;
      }
      newEvents.push({
        oid: '',
        optionTitle: title,
        optionPrice: price,
        optionMinParticipation: min,
        optionMaxParticipation: max,
        optionDate: event.format(),
        date: event.format(),
        title: title
      })
    }
    const api = this.calendarComponent.getApi();
    // const originEvents = api.getEvents();
    // if (originEvents.length !== 0) {
    //   const filteredEvents = newEvents.filter(newEvent => {
    //     return !originEvents.find(origin => {
    //       return moment(origin.start).isSame(moment(newEvent.date))
    //     });
    //   })
    //   api.addEventSource(filteredEvents);
    //   this.addOptionForm(filteredEvents);
    //   if (filteredEvents.length !== newEvents.length) alert('요청하신 옵션 중 동일한 일시의 옵션을 제외하고 추가하였습니다.')
    //   else alert('스케줄이 등록되었습니다.')
    // } else {
    api.addEventSource(newEvents);
    this.addOptionForm(newEvents);
    alert('스케줄이 등록되었습니다.')
    // }
    this.optionAddFormGroup.reset();
    this.addModalRef.hide();
  }

  addOptionForm(events: any[]) {
    this.options = this.formGroup.get('options') as FormArray;
    events.forEach(event => {
      this.options.push(this.createOptionForm(event))
    })
  }

  createOptionForm(event: any) {
    return this.fb.group({
      oid: [''],
      optionTitle: [event.optionTitle, this.formService.getValidators(100)],
      optionPrice: [event.optionPrice, this.formService.getValidators(10, [Validators.max(10000000)])],
      optionMinParticipation: [event.optionMinParticipation, this.formService.getValidators(10, [Validators.max(1000)])],
      optionMaxParticipation: [event.optionMaxParticipation, this.formService.getValidators(10, [Validators.max(1000)])],
      optionDate: [event.date, Validators.required]
    });
  }

  searchSchedule() {
    const period = this.optionDeleteFormGroup.controls.optionPeriod.value;
    const cron = this.optionDeleteFormGroup.controls.schedule.value;
    const start = moment(period[0]).format("YYYY-MM-DD");
    const end = moment(period[1]).format("YYYY-MM-DD");
    let searchOptions = [];

    let cronInstance = new CronConverter();
    cronInstance.fromString(cron);
    let schedule = cronInstance.schedule();
    schedule = cronInstance.schedule(start);
    while (true) {
      const event = schedule.next();
      const date = event.format("YYYY-MM-DD");
      if (moment(date).isAfter(moment(end))) {
        break;
      }
      searchOptions.push(event.format())
    }
    const api = this.calendarComponent.getApi();
    const originEvents = api.getEvents();

    if (originEvents.length !== 0) {
      this.searchedOptions = originEvents.filter(origin => {
        return searchOptions.find(searchEvent => {
          return moment(origin.start).isSame(moment(searchEvent))
        });
      }).map(event => {
        return {
          id: event.id,
          oid: event._def.extendedProps.oid,
          optionTitle: event._def.extendedProps.optionTitle,
          optionPrice: event._def.extendedProps.optionPrice,
          optionMaxParticipation: event._def.extendedProps.optionMaxParticipation,
          optionMinParticipation: event._def.extendedProps.optionMinParticipation,
          optionDate: moment(event.start).locale('ko').format("YYYY-MM-DD HH:mm(ddd)")
        }
      })
    } else {
      alert('일치하는 구매옵션이 없습니다.😧😧')
    }
  }

  removeFromSearched(option) {
    if (confirm('정말로 삭제하시겠습니까?')) {
      this.removeOption(option);
      alert('삭제하였습니다.');
    }
  }

  deleteSchedule() {
    if (confirm('정말로 삭제하시겠습니까?')) {
      this.searchedOptions.forEach(option => {
        this.removeOption(option);
      });
      alert('삭제하였습니다.');
      this.searchedOptions = [];
    }
  }

  private removeOption(option: any) {
    this.options = this.formGroup.get('options') as FormArray;
    const api = this.calendarComponent.getApi();

    const date = option.optionDate.split("(")[0];
    api.getEvents().find(event => {
      return moment(event._def.extendedProps.optionDate).isSame(moment(date));
    }).remove();
    const value = this.options.value.find(o => {
      return moment(o.optionDate).isSame(moment(date));
    });
    const index = this.options.value.indexOf(value);
    this.options.removeAt(index);
    this.searchedOptions = this.searchedOptions.filter(o => o.oid !== option.oid);
  }

  add() {
    this.onAddEvent.emit();
    this.isLoad = true;
  }
}