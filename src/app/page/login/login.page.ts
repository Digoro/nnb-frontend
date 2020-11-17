import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { FormService } from './../../service/form.service';
import { UtilService } from './../../service/util.service';
declare var Kakao;
declare var gapi;

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  gauth: any;

  constructor(
    private formService: FormService,
    private utilService: UtilService,
  ) {
    this.utilService.loadScript('https://developers.kakao.com/sdk/js/kakao.js');
    this.utilService.loadScript('https://apis.google.com/js/platform.js');
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
        Kakao.init(environment.KAKAO_AUTH_KEY);
      }
      Kakao.Auth.authorize({
        redirectUri: 'http://nonunbub.com/accounts/kakao/login/callback/',
      });
    } else if (method === 'email') {
      alert('서비스 준비중입니다 ^^');
    } else if (method === 'google') {
      gapi.load('auth2', () => {
        const gauth = gapi.auth2.init({
          client_id: '689970304688-lqer5piucseph9jlhjsf9k8qbhuinn6r.apps.googleusercontent.com'
        });
        gauth.then(() => {
          gauth.signIn({
            ux_mode: 'redirect',
            redirect_uri: 'http://nonunbub.com/accounts/google/login/callback/',
          })
          console.log('init success');
        }, () => {
          console.error('init fail');
        })
      });
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