import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from './../../../environments/environment';
import { FormService } from './../../service/form.service';
import { UtilService } from './../../service/util.service';
declare var Kakao;

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formService: FormService,
    private router: Router,
    private utilService: UtilService,
    private cookieService: CookieService
  ) {
    this.utilService.loadScript('https://developers.kakao.com/sdk/js/kakao.js')
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      id: new FormControl('', this.formService.getValidators(30)),
      password: new FormControl('', this.formService.getValidators(30)),
    });
  }

  login(method: string) {
    if (method === 'kakao') {
      if (!Kakao.isInitialized()) {
        Kakao.init(environment.KAKAO_AUTH_KEY);      // 사용할 앱의 JavaScript 키를 설정
      }
      Kakao.Auth.authorize({
        redirectUri: 'http://nonunbub.com/accounts/kakao/login/callback/',
      });
    } else if (method === 'email') {
      alert('서비스 준비중입니다 ^^');
    }
  }

  signup() {
    alert('서비스 준비중입니다 ^^');
    // this.router.navigate(['./tabs/signup', 'email']);
  }

  findPassword() {
    alert('서비스 준비중입니다 ^^');
  }
}

