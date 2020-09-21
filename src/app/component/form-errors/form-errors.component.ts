import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
})
export class FormErrorsComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() errors: { key: string, meesage: string }[];
  @Input() isRequired = true;

  constructor() { }

  ngOnInit() { }

}
