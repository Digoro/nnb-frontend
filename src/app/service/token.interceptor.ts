import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getCurrentNonunbubUser();
        if (token) {
            const key = Object.keys(token).find(key => key === 'access_token');
            if (key) {
                const accessToken = token[key];
                request = request.clone({ setHeaders: { Authorization: accessToken } });
            }
        }
        return next.handle(request);
    }
}