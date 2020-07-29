import { Component, Input, OnInit } from '@angular/core';
import { Meeting } from 'src/app/model/meeting';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'meeting-preview',
  templateUrl: './meeting-preview.component.html',
  styleUrls: ['./meeting-preview.component.scss'],
})
export class MeetingPreviewComponent implements OnInit {
  @Input() meeting: Meeting;
  @Input() previewImage;
  quillStyle;

  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.quillStyle = this.utilService.getQuillStyle()
  }

}
