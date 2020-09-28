import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
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
  @Output() onChangeScheduleEvent = new EventEmitter();
  @Output() onAddItemEvent = new EventEmitter();
  @Output() onMinusItemEvent = new EventEmitter();
  @Output() onGetEditorInstanceEvent = new EventEmitter();
  @Output() onAddEvent = new EventEmitter();

  @Output() onQuillLoadEvent = new EventEmitter();

  isDesktop = false;
  isShowMenu = false;
  @ViewChild('quill') quill: QuillEditorComponent

  config = { option: { minute: false, year: false } }
  hours = [];
  minutes = [];

  constructor(
    private cds: CheckDesktopService
  ) { }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
    for (let i = 1; i < 24; i++) {
      this.hours.push(i)
    }
    for (let i = 1; i < 60; i++) {
      this.minutes.push(i)
    }
  }

  ngAfterViewInit(): void {
    this.onQuillLoadEvent.emit(this.quill);
  }

  showMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  next() {
    this.onNextEvent.emit();
  }

  prev() {
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
    this.onChangeScheduleEvent.emit(event);
  }
}
