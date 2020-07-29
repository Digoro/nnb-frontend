import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { forkJoin, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Gender } from '../model/gender';
import { Location } from '../model/location';
import { KakaoAccount, KakaoProfile, KakaoProperties, KakaoUser, User } from './../model/user';
import { UserService } from './user.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  profile = new KakaoProperties('nickname', '/assets/banner/banner01.jpeg', '/assets/banner/banner01.jpeg');
  account = new KakaoAccount(true, new KakaoProfile('nickname', '/assets/banner/banner01.jpeg', '/assets/banner/banner01.jpeg'), true, true, true, true, 'email', true, true, 'age_range', true, true, 'birthday', 'birthday_type', true, true, 'gender')
  kakaoUser = new KakaoUser(0, 0, "", this.profile, this.account)
  user = new User(1, 'nonunbub@gmail.com', '노는법', '노는법', '2020.01.01', Gender.male, '010-9640-9225', '/assets/user.png',
    new Location(0, 0, 'address'), 0, '신중년 여가 활동 소셜 커뮤니티 플랫폼', '안녕하세요! 신중년을 위한 여가 활동 소셜 커뮤니티 플랫폼 노는법입니다.', '1234', 'nonunbub', 1257467175, true);
  ADMIN_ID = 1;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private utilService: UtilService,
    private userService: UserService
  ) { }

  getCurrentNonunbubUser(): Observable<User> {
    // return this.http.get<User>(`/users/current`);
    return of(this.user).pipe(delay(200))
  }

  getCurrentKaKaoUser() {
    // return this.http.get(`/users/social_current`, { responseType: 'text' }).pipe(
    //   map(user => this.utilService.convertJson(user)),
    //   map(user => this.userService.mapKaKaoUser(user))
    // )
    return of(this.kakaoUser).pipe(delay(200))
  }

  getCurrentUser() {
    return forkJoin(
      this.getCurrentNonunbubUser(),
      this.getCurrentKaKaoUser()).pipe(map(data => {
        const user = data[0];
        const kakaoUser = data[1];
        return { user, kakaoUser };
      }));
  }

  logout() {
    return this.http.get(`/users/logout`, { responseType: 'text' });
  }

  async toastNeedLogin() {
    const toast = await this.toastController.create({
      header: '노는법',
      color: 'dark',
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
