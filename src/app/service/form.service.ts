import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getValidators(maxLength: number, validators?: ValidatorFn[]): Validators {
    const basic: ValidatorFn[] = [Validators.required, Validators.maxLength(maxLength)];
    if (!!validators) { return Validators.compose(basic.concat(validators)); }
    return basic;
  }

  getInvalidControls(form: FormGroup): string[] {
    const invalids = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalids.push(name);
      }
    }
    return invalids;
  }
}
