import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from './../model/comment';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  urlPrefix = UrlService.prefix;
  static DELETE_FLAG = '삭제 되었습니다'

  constructor(
    private http: HttpClient
  ) { }

  getCommentsByMeeting(mid: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/comments?mid=${mid}`);
  }

  getCommentsByUser(uid: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/comments?uid=${uid}`);
  }

  delete(isParent: boolean, comment: Comment): Observable<Comment[]> {
    if (isParent) {
      comment.comment = CommentService.DELETE_FLAG;
      comment.writer = comment.writer['uid'];
      return this.http.put<Comment[]>(`${this.urlPrefix}/comments/${comment.cid}/`, comment)
    }
    else return this.http.delete<Comment[]>(`${this.urlPrefix}/comments/${comment.cid}/`);
  }

  comment(comment: Comment) {
    return this.http.post(`${this.urlPrefix}/comments/`, comment);
  }
}
