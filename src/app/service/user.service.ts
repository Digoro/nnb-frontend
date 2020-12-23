import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlPrefix = UrlService.prefix;

  constructor(
    private http: HttpClient
  ) { }

  signup(user: User) {
    return this.http.post(`${this.urlPrefix}/users`, user);
  }

  get(nid: number): Observable<User> {
    // return of(this.user).pipe(delay(500))
    return this.http.get<User>(`${this.urlPrefix}/users/${nid}`);
  }

  edit(uid, image?: string, nickname?: string, name?: string, catchphrase?: string, introduction?: string, phone?: string) {
    return this.http.put(`users/management?uid=${uid}`, { image, nickname, name, catchphrase, introduction, phone })
  }
}
