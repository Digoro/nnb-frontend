import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BandComment, BandDetailResult, BandPost, BandPostDetail, BandResult } from '../model/band';
import { BandResultData } from './../model/band';

@Injectable({
  providedIn: 'root'
})
export class BandService {

  constructor(
    private http: HttpClient
  ) { }

  get(post_key: string): Observable<BandDetailResult<BandPostDetail>> {
    return this.http.get<BandDetailResult<BandPostDetail>>(`/band/post?post_key=${post_key}`).pipe(
      map(bandResult => {
        bandResult.result_data.post.photo = Object.keys(bandResult.result_data.post.photo).map(key => {
          return bandResult.result_data.post.photo[key]
        })
        return bandResult;
      })
    )
  }

  getList(): Observable<BandResultData<BandPost[]>> {
    return this.http.get<BandResult<BandPost[]>>('/band/posts-list').pipe(
      map(bandResult => {
        return bandResult.result_data
      })
    )
  }

  getComments(post_key: string): Observable<BandResultData<BandComment[]>> {
    return this.http.get<BandResult<BandComment[]>>(`/band/comments-list?post_key=${post_key}`).pipe(
      map(bandResult => {
        return bandResult.result_data
      })
    )
  }
}
