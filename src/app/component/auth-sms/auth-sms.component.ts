import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { User } from './../../model/user';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'auth-sms',
  templateUrl: './auth-sms.component.html',
  styleUrls: ['./auth-sms.component.scss'],
})
export class AuthSmsComponent implements OnInit {
  isRequestAuth = false;
  isSMSAuth = false;
  form: FormGroup;
  remainTime: string;
  interval: any;

  @ViewChild('authNumber') authNumber: ElementRef;
  @Input() phoneNumber: string;
  @Input() user: User;
  @Input() isDesc = true;
  @Output() phoneAddEvent = new EventEmitter();
  // reactive form
  @Input() formGroup: FormGroup;
  @Input() controlName: string;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      phoneNumber: new FormControl(this.phoneNumber, [Validators.required, Validators.pattern("[0-9 ]{11}")]),
    })
  }

  startTimer(duration) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
      minutes = parseInt(`${timer / 60}`, 10);
      seconds = parseInt(`${timer % 60}`, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.remainTime = minutes + ":" + seconds;
      if (--timer < 0) {
        clearInterval(this.interval);
        this.remainTime = '인증시간 만료, 다시 요청해주세요'
      }
    }, 1000);
    return interval;
  }

  requestAuthSMS() {
    clearInterval(this.interval);
    this.authService.requestAuthSms(this.form.controls.phoneNumber.value).subscribe(resp => {
      if (resp) {
        this.isRequestAuth = true;
        this.interval = this.startTimer(60 * 5);
      } else {
        this.isRequestAuth = false;
      }
    })
  }

  authSMS() {
    const phoneNumber = this.form.controls.phoneNumber.value;
    this.authService.checkAuthSms(phoneNumber, this.authNumber.nativeElement.value).subscribe(resp => {
      if (resp) {
        this.isSMSAuth = true;
        alert('휴대폰 인증에 성공하였습니다.');
        if (this.formGroup && this.controlName) {
          this.formGroup.controls[this.controlName].setValue(phoneNumber);
        }
        this.phoneAddEvent.emit(phoneNumber);
        if (this.user) {
          this.userService.edit(this.user.id, undefined, undefined, undefined, undefined, undefined, phoneNumber).subscribe(resp => {
            console.log(resp);
          })
        }
      } else {
        this.isSMSAuth = false;
        alert('휴대폰 인증에 실패하였습니다. 다시 시도해주세요.')
      }
    })
  }
}
