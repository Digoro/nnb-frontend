import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {
  @Input() name: string;
  @Input() type = 'text';
  @Input() group: FormGroup;
  @Input() controlName: string;
  @Input() errors: { key: string, message: string }[];
  @Input() maxLength: number;
  @Input() rows = 7;
  @Input() isRequired = true;
  @Input() value: any = '';
  @Input() isUnUseDirty = false;
  @Input() disabled = false;
  @Input() onlyDigit = false;
  @Output() valueChangeEvent = new EventEmitter();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  isValid(form: FormControl) {
    return form.valid && form.dirty;
  }

  isInValid(form: FormControl) {
    return form.invalid && form.dirty;
  }

  changeEvent(event) {
    this.valueChangeEvent.emit(event);
  }

  numberOnlyValidation(event: any) {
    if (this.onlyDigit) {
      const pattern = /^\d+$/;
      let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
}
