import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Magazine } from './../model/magazine';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class MagazineService {
  urlPrefix = UrlService.prefix;
  magazines = [
    new Magazine(0, '소중한 직장인 취미', '회식과 야근으로부터 지키자!!', '/assets/user.png', '아날로그 감성을 사랑하는 직장인들', '2020-01-01T01:01:01Z'),
    new Magazine(1, '소중한 직장인 취미', '회식과 야근으로부터 지키자!!', '/assets/user.png', '아날로그 감성을 사랑하는 직장인들', '2020-01-01T01:01:01Z')
  ]
  constructor(
    private http: HttpClient,
  ) { }

  getList(): Observable<Magazine[]> {
    return this.http.get<Magazine[]>(`${this.urlPrefix}/magazines/`);
    // return of(this.magazines).pipe(delay(200))
  }

  add(formData: FormData) {
    return this.http.post(`${this.urlPrefix}/magazines/`, formData)
  }

  edit(mid: number, formData: FormData) {
    return this.http.put(`${this.urlPrefix}/magazines/${mid}/`, formData);
    // return of(this.magazines).pipe(delay(200))
  }

  delete(mid: number) {
    return this.http.delete(`${this.urlPrefix}/magazines/${mid}/`);
    // return of(this.magazines).pipe(delay(200))
  }

  get(mid: number): Observable<Magazine> {
    return this.http.get<Magazine>(`${this.urlPrefix}/magazines/${mid}/`);
    // return of(this.magazines[0]).pipe(delay(200))
  }
}
