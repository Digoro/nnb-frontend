import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRole(childRoute);
  }

  checkRole(childRoute: ActivatedRouteSnapshot) {
    return this.authService.getCurrentFromServer().pipe(
      map(user => {
        const isPermitted = !!childRoute.data.roles.find(role => role === user.role);
        if (!isPermitted) this.router.navigate(['/tabs/home']);
        return isPermitted;
      })
    )
  }
}
