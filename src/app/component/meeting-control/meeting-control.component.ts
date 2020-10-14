import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
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
import { CheckDesktopService } from './../../service/check-desktop.service';

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
  @Output() onMarkerDragEndEvent = new EventEmitter();
  @Output() onCheckDiscountPriceEvent = new EventEmitter();
  @Output() onGetEditorInstanceEvent = new EventEmitter();
  @Output() onAddEvent = new EventEmitter();

  @Output() onQuillLoadEvent = new EventEmitter();

  isDesktop = false;
  isShowMenu = false;
  @ViewChild('quill') quill: QuillEditorComponent

  ngxCronUiConfig: NgxCronUiConfig = {
    option: { minute: false, hour: false, year: false },
    isSetDefaultValue: true
  }

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    buttonText: {
      today: '오늘'
    },
    editable: false,
    selectable: true
  };
  hours = [];
  minutes = [];

  optionAddFormGroup: FormGroup;
  optionDeleteFormGroup: FormGroup;
  searchedOptions: any[];
  options: FormArray;
  modalRef: BsModalRef;
  isInitialOptionLoad = true;
  @ViewChild(BsDaterangepickerDirective, { static: false }) datapickerDirective;
  noticeChcked = false;

  constructor(
    private cds: CheckDesktopService,
    private formService: FormService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private localeService: BsLocaleService
  ) { }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
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

      if (value.optionMinParticipation && value.optionMaxParticipation) {
        if (value.optionMinParticipation > value.optionMaxParticipation) {
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

  openModal(template: TemplateRef<any>) {
    const config = {
      class: 'modal-lg',
      animated: true
    }
    this.modalRef = this.modalService.show(template, config);
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
  }

  markerDragEnd(event) {
    this.onMarkerDragEndEvent.emit(event);
  }

  checkDiscountPrice() {
    this.onCheckDiscountPriceEvent.emit();
  }

  changeSchedule(event, isAdd: boolean) {
    isAdd ? this.optionAddFormGroup.controls.schedule.patchValue(event) :
      this.optionDeleteFormGroup.controls.schedule.patchValue(event);
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
    const originEvents = api.getEvents();
    if (originEvents.length !== 0) {
      const filteredEvents = newEvents.filter(newEvent => {
        return !originEvents.find(origin => {
          return moment(origin.start).isSame(moment(newEvent.date))
        });
      })
      api.addEventSource(filteredEvents);
      this.addOptionForm(filteredEvents);
      if (filteredEvents.length !== newEvents.length) alert('요청하신 옵션 중 동일한 일시의 옵션을 제외하고 추가하였습니다.')
      else alert('스케줄이 등록되었습니다.')
    } else {
      api.addEventSource(newEvents);
      this.addOptionForm(newEvents);
      alert('스케줄이 등록되었습니다.')
    }
    this.optionAddFormGroup.reset();
    this.modalRef.hide();
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
      alert('이벤트가 없습니다.')
    }
  }

  changeHours(event) {
    const control = this.formGroup.controls.runningMinutes;
    const selectedMinutes = event.detail.value * 60;
    const oldValue = control.value;
    const oldHours = Math.floor(oldValue / 60);
    const oldMinutes = oldValue - (oldHours * 60);
    const result = oldMinutes + selectedMinutes;
    control.patchValue(result);
  }

  changeMinutes(event) {
    const control = this.formGroup.controls.runningMinutes;
    const selectedMinutes = event.detail.value;
    const oldValue = control.value;
    const oldHours = Math.floor(oldValue / 60);
    const oldMinutes = oldValue - (oldHours * 60);
    const result = oldValue - oldMinutes + selectedMinutes;
    control.patchValue(result);
  }

  deleteSchedule() {
    this.options = this.formGroup.get('options') as FormArray;
    const api = this.calendarComponent.getApi();

    this.searchedOptions.forEach(option => {
      const date = option.optionDate.split("(")[0];
      api.getEvents().find(event => {
        return moment(event._def.extendedProps.optionDate).isSame(moment(date))
      }).remove();
      const value = this.options.value.find(o => {
        return moment(o.optionDate).isSame(moment(date))
      })
      const index = this.options.value.indexOf(value);
      this.options.removeAt(index);
    });
    alert('삭제하였습니다')
    this.modalRef.hide();
    this.searchedOptions = undefined;
  }

  getEditorInstance(editorInstance: any) {
    this.onGetEditorInstanceEvent.emit(editorInstance);
  }

  add() {
    this.onAddEvent.emit();
  }
}