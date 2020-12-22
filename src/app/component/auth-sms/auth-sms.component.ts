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
  @Input() phone: string;
  @Input() user: User;
  @Output() phoneAddEvent = new EventEmitter();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      phone: new FormControl(this.phone, [Validators.required, Validators.pattern("[0-9 ]{11}")]),
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
    this.authService.requestAuthSMS(this.form.controls.phone.value).subscribe(resp => {
      if (resp.result) {
        this.isRequestAuth = true;
        this.interval = this.startTimer(60 * 5);
      } else {
        this.isRequestAuth = false;
      }
    })
  }

  authSMS() {
    const phone = this.form.controls.phone.value;
    this.authService.authSMS(phone, this.authNumber.nativeElement.value).subscribe(resp => {
      if (resp.result) {
        this.isSMSAuth = true;
        alert('휴대폰 인증에 성공하였습니다.');
        this.phoneAddEvent.emit(phone);
        this.userService.edit(this.user.uid, undefined, undefined, undefined, undefined, phone).subscribe(resp => {
          console.log(resp);
        })
      } else {
        this.isSMSAuth = false;
        alert('휴대폰 인증에 실패하였습니다. 다시 시도해주세요.')
      }
    })
  }
}
