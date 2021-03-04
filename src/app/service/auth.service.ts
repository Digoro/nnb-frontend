import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ADMIN_ID = 1;
  ACCESS_TOKEN = 'access_token';

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
  }

  getCurrentFromServer(): Observable<User> {
    return this.http.get<User>(`/api/users/user/current`)
  }

  getCurrentNonunbubUser(): Observable<User> {
    const user: User = this.jwtHelper.decodeToken(this.getToken());
    if (!user) return of(undefined);
    return of(user);
  }

  requestAuthSms(phoneNumber: string): Observable<boolean> {
    return this.http.post<boolean>(`/auth/sms`, { 'phoneNumber': phoneNumber })
  }

  checkAuthSms(phoneNumber: string, authNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`/auth/sms?phoneNumber=${phoneNumber}&authNumber=${authNumber}`)
  }

  login(email: string, password: string) {
    return this.http.post('/auth/login', { email, password }).pipe(
      map(accessToken => {
        this.setToken(accessToken['access_token']);
      })
    )
  }

  logout() {
    this.removeToken();
    return this.http.get(`/users/logout`, { responseType: 'text' });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  getToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
  }

  isTokenExpired(token: string) {
    return this.jwtHelper.isTokenExpired(token);
  }

  getUserid(): string {
    return this.jwtHelper.decodeToken(this.getToken()).userid;
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
