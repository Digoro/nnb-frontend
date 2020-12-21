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
        const youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=(\w+)/g;
        bandResult.result_data.post.content = (bandResult.result_data.post.content as string)
          .replace(imgRegex, (a, b) => `<br><img src="${bandResult.result_data.post.photo[b].url}"><br>`)
          .replace(linkRegex, (a, b) => `<a class="nnb-btn nnb-btn-primary" href="${a}">모임 보러 가기!</a><br>`)
          .replace(youtubeRegex, (a, b) => `<br><iframe width="560" height="315" src="${a}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>`)
        return bandResult;
      })
    )
  }

  getList(after?: string): Observable<BandResultData<BandPost[]>> {
    const url = after ? `/band/posts-list?after=${after}` : '/band/posts-list';
    return this.http.get<BandResult<BandPost[]>>(url).pipe(
      map(bandResult => {
        bandResult.result_data.items = bandResult.result_data.items.map(item => {
          const linkRegex = /https:\/\/nonunbub\.com\/tabs\/meeting-detail\/(\d+)/g;
          const youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=(\w+)/g;
          item.content = item.content
            .replace(linkRegex, (a, b) => `<a class="nnb-btn nnb-btn-primary" href="${a}">모임 보러 가기!</a><br>`)
            .replace(youtubeRegex, (a, b) => `<br><iframe width="560" height="315" src="${a}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>`)
          return item;
        }).map(item => {
          if (item.content === 'Uploaded photo.') {
            item.content = ''
          }
          return item
        }).filter(item => item.content !== 'Uploaded event.')
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
