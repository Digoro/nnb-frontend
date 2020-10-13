import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ErrorHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.log('클라이언트 사이드 에러 발생!!');
          console.log(`Error: ${error.error.message}`);
        }
        else {
          console.log('서버 사이드 에러 발생!!');
          console.log(`에러 코드: ${error.status},  메시지: ${error.message}`);
        }
        if (!!error.error) alert(error.error);
        else alert('알 수 없는 오류 발생')
        return throwError(error.message);
      })
    )
  }
}