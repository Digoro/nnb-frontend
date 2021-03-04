import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductReview, ProductReviewCreateDto } from './../model/comment';
import { Pagination } from './../model/pagination';
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

  getCommentsByMeeting(id: number, page: number): Observable<Pagination<ProductReview>> {
    return this.http.get<Pagination<ProductReview>>(`${this.urlPrefix}/reviews/products?page=${page}&limit=${10}&product=${id}`);
  }

  getCommentsByUser(id: number, page: number): Observable<Pagination<ProductReview>> {
    return this.http.get<Pagination<ProductReview>>(`/api/reviews/products?page=${page}&limit=${10}&user=${id}`);
  }

  delete(comment: ProductReview): Observable<ProductReview[]> {
    return this.http.delete<ProductReview[]>(`${this.urlPrefix}/reviews/products/${comment.id}`);
  }

  comment(review: ProductReviewCreateDto) {
    return this.http.post(`${this.urlPrefix}/reviews/products`, review);
  }
}
