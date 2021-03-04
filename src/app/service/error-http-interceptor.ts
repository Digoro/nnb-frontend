import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 500) {
          if (!!error.error) alert(error.error);
          else alert('알 수 없는 오류가 발생하였습니다. 문의 부탁드립니다.');
        }
        if (error.status === 401) {
          // alert('로그인이 필요합니다.');
          this.router.navigate(['/tabs/login'], { queryParams: { returnUrl: this.router.url } });
        }
        if (error.status === 403) {
          alert('권한이 없습니다.');
        }
        if (error.status === 400) {
          if (error.error.type === 'NNB_ERROR_TYPE') {
            alert(error.error.message)
          }
        }
        return throwError(error);
      })
    )
  }
}