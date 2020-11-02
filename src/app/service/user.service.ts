import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../model/location';
import { KakaoAccount, KakaoProfile, KakaoProperties, User } from '../model/user';
import { Gender } from './../model/gender';
import { KakaoUser } from './../model/user';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlPrefix = UrlService.prefix;
  user = new User(1, 'lsh00124@naver.com', '이상훈', 'digoro', '1992.01.24', Gender.male, '010-2999-5976', '/assets/user.png',
    new Location(0, 0, 'address'), 0, '안녕하세요, 일러스트레이터 이공입니다!', '저는 주로 일상 속 작고 어설프지만 반짝이는 일화들이 담긴 일기장에서 영감을 받아 그림을 그리고 있습니다. 많은 브랜드 업체들과 패션잡화, 리빙 상품 콜라보레이션을 작업해오면서 상품 위에 그림을 녹이는 작업에 매력을 느끼게 되었습니다. 그렇게 그려온 그림들을 굿즈화시켜 현재 일러스트 굿즈 브랜드 스탠다드러브댄스(STANDARD LOVE DANCE)를 운영하고 있습니다.', 'password', 'provider', 0, true);

  profile = new KakaoProperties('nickname', '/assets/banner/banner01.jpeg', '/assets/banner/banner01.jpeg');
  account = new KakaoAccount(true, new KakaoProfile('nickname', '/assets/banner/banner01.jpeg', '/assets/banner/banner01.jpeg'), true, true, true, true, 'email', true, true, 'age_range', true, true, 'birthday', 'birthday_type', true, true, 'gender')
  kakaoUser = new KakaoUser(0, 0, "", this.profile, this.account)

  constructor(
    private http: HttpClient
  ) { }

  mapKaKaoUser(user: any): KakaoUser {
    return user as KakaoUser
  }

  signup(user: User) {
    return this.http.post(`${this.urlPrefix}/users`, user);
  }

  get(nid: number): Observable<User> {
    // return of(this.user).pipe(delay(500))
    return this.http.get<User>(`${this.urlPrefix}/users/${nid}`);
  }

  edit(uid, nickname, catchphrase, introduction) {
    return this.http.put(`users/management?uid=${uid}`, { nickname, catchphrase, introduction })
  }
}
