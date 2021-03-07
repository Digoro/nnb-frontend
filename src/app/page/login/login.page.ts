import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { AuthService } from './../../service/auth.service';
import { CheckDesktopService } from './../../service/check-desktop.service';
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
  isDesktop: boolean;

  constructor(
    private formService: FormService,
    private utilService: UtilService,
    private cds: CheckDesktopService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.utilService.loadScript('https://developers.kakao.com/sdk/js/kakao.js');
    this.utilService.loadScript('https://apis.google.com/js/platform.js');
  }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
    this.loginForm = new FormGroup({
      email: new FormControl('', this.formService.getValidators(254, [Validators.email])),
      password: new FormControl('', this.formService.getValidators(20)),
    });
  }

  login(method: string) {
    switch (method) {
      case 'email': {
        const { email, password } = this.loginForm.value;
        this.authService.login(email, password).subscribe(resp => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          // window.location.href = `https://nonunbub.com${returnUrl}`;
          window.location.href = `http://localhost:8080${returnUrl}`;
        }, error => {
          alert('로그인에 실패하였습니다. 입력 정보를 확인해주세요.')
        })
        break;
      }
      case 'kakao': {
        if (!Kakao.isInitialized()) Kakao.init(environment.KAKAO_AUTH_KEY);
        Kakao.Auth.authorize({
          // redirectUri: 'http://localhost:8000/accounts/kakao/login/callback',
          redirectUri: 'http://nonunbub.com/accounts/kakao/login/callback/',
        });
        break;
      }
      case 'google': {
        gapi.load('auth2', () => {
          const gauth = gapi.auth2.init({
            client_id: '689970304688-lqer5piucseph9jlhjsf9k8qbhuinn6r.apps.googleusercontent.com'
          });
          gauth.then(() => {
            gauth.signIn({
              ux_mode: 'redirect',
              // redirect_uri: 'http://localhost:8000/accounts/google/login/callback',
              redirect_uri: 'https://nonunbub.com/accounts/google/login/callback/',
            })
            console.log('init success');
          }, () => {
            console.error('init fail');
          })
        });
        break;
      }
    }
  }

  signup() {
    this.router.navigate(['./tabs/signup']);
  }

  findPassword() {
    this.router.navigate(['./tabs/find-password']);
  }

  ionViewDidLeave() {
    this.loginForm.reset();
  }
}