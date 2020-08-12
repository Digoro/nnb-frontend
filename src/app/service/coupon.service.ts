import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from './../model/coupon';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  urlPrefix = UrlService.prefix;

  constructor(
    private http: HttpClient,
  ) { }

  getCoupons(uid: number, isUsed: boolean): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`/coupons?user=${uid}&isUsed=${isUsed}`)
  }
}
