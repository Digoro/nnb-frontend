import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from 'src/app/service/form.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  phoneNumber: string;
  method: string;
  sexs = ['남', '여', 'Other'];
  checkAllFlag = false;
  termsOfService = 'https://www.notion.so/gdgdaejeon/43b16b117aa840d397a71350a8d08412';
  collectPersonal = 'https://www.notion.so/gdgdaejeon/5ad28ab509bb461090e2bca00af5ac59';

  constructor(
    private formService: FormService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl('', this.formService.getValidators(254, [Validators.email])),
      name: new FormControl('', this.formService.getValidators(50)),
      nickname: new FormControl('', this.formService.getValidators(50)),
      password: new FormControl('', this.formService.getValidators(20)),
      checkPassword: new FormControl('', this.formService.getValidators(20, [this.checkPassword('password')])),
      phoneNumber: new FormControl('', this.formService.getValidators(15)),
      service: new FormControl(false, Validators.requiredTrue),
      personal: new FormControl(false, Validators.requiredTrue),
      marketing: new FormControl(false),
    });
  }

  checkPassword(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const checkPassword = control.value;
      const password = control.root.value[controlName];
      const isNotSame = password !== checkPassword;
      return isNotSame ? { 'isNotSame': { isNotSame } } : null;
    };
  }

  isMathPassword() {
    const password = this.signupForm.controls.password;
    const checkPassword = this.signupForm.controls.checkPassword;
    if (password.value !== checkPassword.value) {
      checkPassword.setErrors({ 'isNotSame': true })
    } else {
      checkPassword.setErrors({ 'isNotSame': null });
    }
    checkPassword.updateValueAndValidity();
  }

  onAddPhone(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  signup() {
    const { password, nickname, name, email, phoneNumber } = this.signupForm.value;
    this.userService.signup({ nickname, email, name, password, phoneNumber }).subscribe(resp => {
      alert('가입에 성공하였습니다. 로그인해주세요.');
      this.router.navigate(['/tabs/login']);
    });
  }

  checkAll() {
    this.checkAllFlag = !this.checkAllFlag;
    this.signupForm.controls.service.setValue(this.checkAllFlag);
    this.signupForm.controls.personal.setValue(this.checkAllFlag);
    this.signupForm.controls.marketing.setValue(this.checkAllFlag);
  }

  login() {
    window.open('https://nonunbub.com/accounts/kakao/login/?process=login');
  }

  back() {
    this.router.navigate(['/tabs/login']);
  }
}
