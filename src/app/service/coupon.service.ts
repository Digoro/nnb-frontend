import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon, CouponSearchDto } from './../model/coupon';
import { Pagination } from './../model/pagination';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  urlPrefix = UrlService.prefix;

  constructor(
    private http: HttpClient,
  ) { }

  search(dto: CouponSearchDto): Observable<Pagination<Coupon>> {
    return this.http.get<Pagination<Coupon>>(
      `/api/coupons?page=${dto.page}&limit=${dto.limit}&userId=${dto.userId}&expireDuration=${dto.expireDuration}&isUsed=${dto.isUsed}`)
  }
}
