import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { AuthService } from './auth.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlPrefix = UrlService.prefix;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  signup(user: { nickname: string, email: string, name: string, password: string, phoneNumber: string }) {
    return this.http.post(`/api/users`, user);
  }

  get(nid: number): Observable<User> {
    // return of(this.user).pipe(delay(500))
    return this.http.get<User>(`${this.urlPrefix}/users/${nid}`);
  }

  edit(userId, profilePhoto?: string, nickname?: string, name?: string, catchphrase?: string, introduction?: string, phoneNumber?: string) {
    return this.http.put(`/api/users/${userId}`, { profilePhoto, nickname, name, catchphrase, introduction, phoneNumber });
  }

  likeProduct(productId: number, isLike: boolean) {
    return this.http.post(`api/users/likes/product`, { id: productId, isLike });
  }

  likeUser(userId: number, isLike: boolean) {
    return this.http.post(`api/users/likes/product`, { id: userId, isLike });
  }

  findPassword(email: string): any {
    return this.http.post(`auth/find-password`, { email })
  }

  resetPassword(validationCode: string, password: string): any {
    return this.http.put(`auth/reset-password`, { validationCode, password });
  }
}
