import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit, OnChanges {
  @Input() price: number;
  @Input() discountPrice: number;
  discountRation: number;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const temp = (this.price - this.discountPrice) / this.price * 100
    const ratio = Math.round(temp);
    if (temp > 0 && temp <= 1) this.discountRation = 1;
    else if (temp > 99 && temp < 100) this.discountRation = 99;
    else this.discountRation = ratio;
  }

  ngOnInit() { }
}