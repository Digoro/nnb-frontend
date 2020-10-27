import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Meeting } from 'src/app/model/meeting';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'meeting-preview',
  templateUrl: './meeting-preview.component.html',
  styleUrls: ['./meeting-preview.component.scss'],
})
export class MeetingPreviewComponent implements OnInit, OnChanges {
  @Input() meeting: Meeting;
  @Input() previewImage;
  quillStyle;
  runningHours;
  runningMinutes;

  constructor(
    private utilService: UtilService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.meeting.firstChange && !!changes.meeting.currentValue) {
      this.runningHours = Math.floor(this.meeting.runningMinutes / 60);
      this.runningMinutes = this.meeting.runningMinutes % 60;
    }
  }


  ngOnInit() {
    this.quillStyle = this.utilService.getQuillStyle();
  }

}
