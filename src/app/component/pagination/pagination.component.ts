import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() paginationId: string;
  @Output() onChange = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  pageChanged(event) {
    this.onChange.emit(event)
  }
}
