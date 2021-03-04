import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/model/product';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'meeting-preview',
  templateUrl: './meeting-preview.component.html',
  styleUrls: ['./meeting-preview.component.scss'],
})
export class MeetingPreviewComponent implements OnInit, OnChanges {
  @Input() product: Product;
  @Input() previewImage;
  quillStyle;
  runningHours;
  runningMinutes;

  constructor(
    private utilService: UtilService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.product) {
      if (!changes.product.firstChange && !!changes.product.currentValue) {
        this.runningHours = Math.floor(this.product.runningMinutes / 60);
        this.runningMinutes = this.product.runningMinutes % 60;
      }
    }
  }

  setPosition(id) {
    document.getElementById(`section-${id}`).scrollIntoView(true);
  }

  ngOnInit() {
    this.quillStyle = this.utilService.getQuillStyle();
  }
}
