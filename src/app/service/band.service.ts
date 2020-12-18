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
        const imgRegex = /<band:attachment type="photo" id="(\d+)" \/>/g;
        const linkRegex = /https:\/\/nonunbub\.com\/tabs\/meeting-detail\/(\d+)/g;
        bandResult.result_data.post.content = bandResult.result_data.post.content
          .replace(imgRegex, (a, b) => `<br><img src="${bandResult.result_data.post.photo[b].url}"><br>`)
          .replace(linkRegex, (a, b) => `<a href="${a}">${a}</a><br>`)

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
