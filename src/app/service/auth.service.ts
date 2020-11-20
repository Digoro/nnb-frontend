import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Gender } from '../model/gender';
import { Location } from '../model/location';
import { KakaoAccount, KakaoProfile, KakaoProperties, KakaoUser, User } from './../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  profile = new KakaoProperties('상훈이', '/assets/user.png', '/assets/user.png');
  account = new KakaoAccount(true, new KakaoProfile('상훈이', '/assets/user.png', '/assets/user.png'), true, true, true, true, 'lsh00124@naver.com', true, true, '20-30', true, true, '1992.01.24', 'birthday_type', true, true, 'male')
  kakaoUser = new KakaoUser(0, 0, "", this.profile, this.account)
  user = new User(1, 'lsh00124@naver.com', '이상훈', '이상훈', '1900.01.01', Gender.male, '', '/assets/user.png',
    new Location(0, 0, 'address'), 0, '', '', '', 'kakotalk', 1257467175, true);
  ADMIN_ID = 1;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
  ) { }

  getCurrentNonunbubUser(): Observable<User> {
    return this.http.get<User>(`/users/current`);
    // return of(this.user).pipe(delay(200))
  }

  logout() {
    return this.http.get(`/users/logout`, { responseType: 'text' });
  }

  async toastNeedLogin() {
    const toast = await this.toastController.create({
      header: '노는법',
      duration: 5000,
      message: '로그인이 필요합니다.',
      animated: true,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: '로그인 하러가기!',
          handler: () => {
            this.router.navigate(['/tabs/login']);
          }
        }, {
          side: 'end',
          icon: 'close',
        },
      ]
    });
    toast.present();
  }
}
