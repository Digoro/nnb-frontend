import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[debounceClick]'
})
export class DebounceClickDirective implements OnInit {
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject();

  constructor() { }

  ngOnInit() {
    this.clicks.pipe(
      throttleTime(1500)
    ).subscribe(e => this.debounceClick.emit(e));
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

}
