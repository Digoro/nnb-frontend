import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'horizontal-slider',
  templateUrl: './horizontal-slider.component.html',
  styleUrls: ['./horizontal-slider.component.scss'],
})
export class HorizontalSliderComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() subTitle = '';
  @Input() data: any[];
  @Input() spaceBetween: number;
  @Input() isShowAll = true;
  @Input() slideStyle = '';
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
    }, spaceBetween: 0
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      if (changes.data.firstChange) {
        this.isLoaded = false;
      }
      if (!changes.data.firstChange && changes.data.currentValue) {
        this.isLoaded = true;
        const size = changes.data.currentValue.length;
        switch (size) {
          case 1: this.setSlideConfig(1, 1); break;
          case 2: this.setSlideConfig(2, 2); break;
          case 3: this.setSlideConfig(3, 2.2); break;
          case 4: this.setSlideConfig(4, 2.2); break;
          default: this.setSlideConfig(4, 2.2); break;
        }
      }
    }
    if (changes.spaceBetween) {
      this.sliderConfig.spaceBetween = this.spaceBetween;
    }
  }

  private setSlideConfig(view: number, breakepoint: number) {
    this.sliderConfig.slidesPerView = view;
    this.sliderConfig.breakpoints = { 922: { slidesPerView: breakepoint } };
  }

  ngOnInit() { }

  showAll() {
    this.showAllEvent.emit();
  }
}
