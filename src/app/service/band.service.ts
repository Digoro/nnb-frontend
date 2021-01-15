import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BandComment, BandDetailResult, BandPost, BandPostDetail, BandResult } from '../model/band';
import { BandResultData } from './../model/band';

@Injectable({
  providedIn: 'root'
})
export class BandService {
  imgRegex = /<band:attachment type="photo" id="(\d+)" \/>/g;
  linkRegex = /https:\/\/nonunbub\.com\/tabs\/meeting-detail\/(\d+)/g;
  youtubeRegex = /https:\/\/youtu\.be\/(\w+)/g;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  get(post_key: string): Observable<BandDetailResult<BandPostDetail>> {
    return this.http.get<BandDetailResult<BandPostDetail>>(`/band/post?post_key=${post_key}`).pipe(
      map(bandResult => {
        bandResult.result_data.post.content = (bandResult.result_data.post.content as string)
          .replace(this.imgRegex, (a, b) => `<br><img src="${bandResult.result_data.post.photo[b].url}"><br>`)
          .replace(this.linkRegex, (a, b) => `<a class="nnb-btn nnb-btn-primary" href="${a}">모임 보러 가기!</a><br>`)
          .replace(this.youtubeRegex, (a, b) => `<iframe style="width: 100%;min-height:350px;" src="https://www.youtube.com/embed/${b}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
        bandResult.result_data.post.content = this.sanitizer.bypassSecurityTrustHtml(bandResult.result_data.post.content.toString())
        return bandResult;
      })
    )
  }

  getList(after?: string): Observable<BandResultData<BandPost[]>> {
    const url = after ? `/band/posts-list?after=${after}` : '/band/posts-list';
    return this.http.get<BandResult<BandPost[]>>(url).pipe(
      map(bandResult => {
        bandResult.result_data.items = bandResult.result_data.items.map(item => {
          item.content = item.content
            .replace(this.linkRegex, (a, b) => `<a class="nnb-btn nnb-btn-primary" href="${a}">모임 보러 가기!</a><br>`)
            .replace(this.youtubeRegex, (a, b) => `<a href="${a}">${a}</a><br>`)
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
