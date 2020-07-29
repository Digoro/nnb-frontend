import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Meeting } from 'src/app/model/meeting';

@Component({
  selector: 'horizontal-slider',
  templateUrl: './horizontal-slider.component.html',
  styleUrls: ['./horizontal-slider.component.scss'],
})
export class HorizontalSliderComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() meetings: Meeting[];
  @Input() isTitleMargin = true;
  @Output() clickEvent = new EventEmitter();
  @Output() showAllEvent = new EventEmitter();
  isLoaded = false;

  sliderConfig = {
    observer: true,
    initialSlide: 0,
    slidesPerView: 4.1,
    breakpoints: {
      922: {
        slidesPerView: 2.2
      }
    }
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.meetings) {
      if (changes.meetings.firstChange) {
        this.isLoaded = false;
      }
      if (!changes.meetings.firstChange && changes.meetings.currentValue) {
        this.isLoaded = true;
        const size = changes.meetings.currentValue.length;
        switch (size) {
          case 1: this.setSlideConfig(1, 1); break;
          case 2: this.setSlideConfig(2, 2); break;
          case 3: this.setSlideConfig(3, 2.2); break;
          case 4: this.setSlideConfig(4, 2.2); break;
          default: this.setSlideConfig(4, 2.2); break;
        }
      }
    }
  }

  private setSlideConfig(view: number, breakepoint: number) {
    this.sliderConfig.slidesPerView = view;
    this.sliderConfig.breakpoints = { 922: { slidesPerView: breakepoint } };
  }

  ngOnInit() { }

  goDetailPage(meeting) {
    this.clickEvent.emit(meeting);
  }

  showAll() {
    this.showAllEvent.emit();
  }
}
