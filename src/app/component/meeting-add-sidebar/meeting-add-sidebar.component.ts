import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'meeting-add-sidebar',
  templateUrl: './meeting-add-sidebar.component.html',
  styleUrls: ['./meeting-add-sidebar.component.scss'],
})
export class MeetingAddSidebarComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Output() onLastCheck = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  lastCheck() {
    this.onLastCheck.emit();
  }
}
