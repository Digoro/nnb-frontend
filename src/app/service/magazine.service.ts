import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from '../model/pagination';
import { Magazine } from './../model/magazine';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class MagazineService {
  urlPrefix = UrlService.prefix;
  constructor(
    private http: HttpClient,
  ) { }

  getList(page: number, limit: number = 10): Observable<Pagination<Magazine>> {
    if (!page) page = 1;
    return this.http.get<Pagination<Magazine>>(`${this.urlPrefix}/magazines?page=${page}&limit=${limit}`);
  }

  add(formData: FormData) {
    return this.http.post(`${this.urlPrefix}/magazines/`, formData)
  }

  edit(id: number, formData: FormData) {
    return this.http.put(`${this.urlPrefix}/magazines/${id}/`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.urlPrefix}/magazines/${id}/`);
  }

  get(id: number): Observable<Magazine> {
    return this.http.get<Magazine>(`${this.urlPrefix}/magazines/${id}/`);
  }
}
