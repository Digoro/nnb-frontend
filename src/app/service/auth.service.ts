import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Gender } from '../model/gender';
import { Location } from '../model/location';
import { User } from './../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new User(1, 'lsh00124@naver.com', '이상훈', '이상훈', '1900.01.01', Gender.male, '', '/assets/user.png',
    new Location(0, 0, 'address'), 0, '안녕하세요 노는법 운영진 이상훈입니다!',
    '우리는 대한민국 신중년 간의 연결을 도와 활기차고 세련된 교류가 있는 신중년 사회를 만들어가고 있습니다. 신중년 종합 포털 서비스, 노는법!',
    '', 'kakotalk', 1257467175, true);
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

  requestAuthSMS(phone: string): Observable<{ result: boolean }> {
    return this.http.post<{ result: boolean }>(`/auth-sms`, { 'phone_number': phone })
  }

  authSMS(phone: string, authNumber: string): Observable<{ result: boolean }> {
    return this.http.get<{ result: boolean }>(`/auth-sms?phone_number=${phone}&auth_number=${authNumber}`)
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
