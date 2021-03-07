import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormService } from 'src/app/service/form.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  code: string;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.code = params.validationCode;
      this.form = new FormGroup({
        password: new FormControl('', this.formService.getValidators(20)),
        checkPassword: new FormControl('', this.formService.getValidators(20, [this.checkPassword('password')])),
      });
    })
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
    const password = this.form.controls.password;
    const checkPassword = this.form.controls.checkPassword;
    if (password.value !== checkPassword.value) {
      checkPassword.setErrors({ 'isNotSame': true })
    } else {
      checkPassword.setErrors({ 'isNotSame': null });
    }
    checkPassword.updateValueAndValidity();
  }

  resetPassword() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      const password = this.form.controls.password.value;
      this.route.queryParams.subscribe(params => {
        this.userService.resetPassword(params.validationCode, password).subscribe(resp => {
          alert('비밀번호가 변경되었습니다.');
          this.router.navigate(['/tabs/login'])
        })
      })
    })
  }
}
