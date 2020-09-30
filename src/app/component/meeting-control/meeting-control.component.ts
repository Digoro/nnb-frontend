import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventClickArg, FullCalendarComponent } from '@fullcalendar/angular';
import * as CronParser from 'cron-parser';
import * as moment from 'moment';
import { NgxCronUiConfig } from 'ngx-cron-ui/lib/model/model';
import { QuillEditorComponent } from 'ngx-quill';
import { FormService } from 'src/app/service/form.service';
import { Meeting } from '../../model/meeting';
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
  @Output() onAddItemEvent = new EventEmitter();
  @Output() onMinusItemEvent = new EventEmitter();
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
    editable: false,
    selectable: true,
    eventClick: (selectInfo: EventClickArg) => {
      console.log(selectInfo);
    }
  };
  hours = [];
  minutes = [];

  optionFormGroup: FormGroup;
  min = moment().format('YYYY-MM-DD')
  max = moment().add(100, 'year').format('YYYY-MM-DD')

  constructor(
    private cds: CheckDesktopService,
    private formService: FormService
  ) { }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
    for (let i = 1; i < 24; i++) {
      this.hours.push(i)
    }
    for (let i = 1; i < 60; i++) {
      this.minutes.push(i)
    }
    this.optionFormGroup = new FormGroup({
      oid: new FormControl(''),
      optionTitle: new FormControl('', this.formService.getValidators(100)),
      optionPrice: new FormControl('', this.formService.getValidators(10, [Validators.min(0), Validators.max(10000000)])),
      optionMinParticipation: new FormControl('', this.formService.getValidators(10, [Validators.min(1), Validators.max(1000)])),
      optionMaxParticipation: new FormControl('', this.formService.getValidators(10, [Validators.min(1), Validators.max(1000)])),
      optionTo: new FormControl('', Validators.required),
      optionFrom: new FormControl('', Validators.required),
      schedule: new FormControl('', Validators.required),
    })

    this.optionFormGroup.valueChanges.subscribe(value => {
      const min = this.optionFormGroup.controls.optionMinParticipation;
      const to = this.optionFormGroup.controls.optionTo;
      const from = this.optionFormGroup.controls.optionFrom;

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

      if (value.optionTo && value.optionFrom) {
        if (moment(value.optionTo).isSameOrAfter(moment(value.optionFrom))) {
          to.setErrors({ 'isAfter': true })
        } else {
          if (to.hasError('isAfter')) {
            const { isAfter, ...errors } = to.errors;
            to.setErrors(errors);
            to.updateValueAndValidity({ emitEvent: false })
          }

          if (moment(value.optionFrom).diff(moment(value.optionTo), 'days') > 365) {
            from.setErrors({ 'maxDurationDays': true })
          } else {
            if (from.hasError('maxDurationDays')) {
              const { maxDurationDays, ...errors } = from.errors;
              from.setErrors(errors);
              from.updateValueAndValidity({ emitEvent: false })
            }
          }
        }
      }
    })
  }

  updateCalendarSize() {
    setTimeout(() => {
      const api = this.calendarComponent.getApi();
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
    if (isMeetingOptionView) this.updateCalendarSize();
    this.onNextEvent.emit();
  }

  prev(isMeetingOptionView?: boolean) {
    if (isMeetingOptionView) this.updateCalendarSize();
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

  addSchedule() {
    const to = moment(this.optionFormGroup.controls.optionTo.value).format('YYYY-MM-DD');
    const from = moment(this.optionFormGroup.controls.optionFrom.value).format('YYYY-MM-DD');
    const cron = this.optionFormGroup.controls.schedule.value;
    const options = {
      currentDate: to,
      endDate: from,
      iterator: true
    };
    let newEvents = [];
    const interval = CronParser.parseExpression(cron, options);
    while (interval.hasNext()) {
      const date = moment(interval.next()['value'].toString()).toDate();
      newEvents.push({ date });
    }
    const api = this.calendarComponent.getApi();
    const originEvents = api.getEvents();
    if (originEvents.length !== 0) {
      const filteredEvents = newEvents.filter(newEvent => {
        return !originEvents.find(origin => {
          return moment(origin.start).isSame(moment(newEvent.date))
        });
      })
      if (filteredEvents.length !== newEvents.length) alert('요청하신 옵션 중 동일한 일시의 옵션을 제외하고 추가하였습니다.')
      api.addEventSource(filteredEvents)
    } else {
      api.addEventSource(newEvents);
    }
  }

  changeHours(event) {
    const selectedMinutes = event.detail.value * 60;
    const oldValue = this.formGroup.controls.runningMinutes.value;
    const oldHours = Math.floor(oldValue / 60);
    const oldMinutes = oldValue - (oldHours * 60);
    const result = oldMinutes + selectedMinutes;
    this.formGroup.controls.runningMinutes.patchValue(result)
  }

  changeMinutes(event) {
    const selectedMinutes = event.detail.value;
    const oldValue = this.formGroup.controls.runningMinutes.value;
    const oldHours = Math.floor(oldValue / 60);
    const oldMinutes = oldValue - (oldHours * 60);
    const result = oldValue - oldMinutes + selectedMinutes;
    this.formGroup.controls.runningMinutes.patchValue(result)
  }

  addItem() {
    this.onAddItemEvent.emit();
  }

  minusItem(index: number) {
    this.onMinusItemEvent.emit(index);
  }

  getEditorInstance(editorInstance: any) {
    this.onGetEditorInstanceEvent.emit(editorInstance);
  }

  add() {
    this.onAddEvent.emit();
  }

  changeSchedule(event) {
    console.log(event);

    this.optionFormGroup.controls.schedule.patchValue(event);
  }
}