import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Meeting } from './../model/meeting';
import { User } from './../model/user';
import { AuthService } from './auth.service';
import { MeetingService } from './meeting.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivateChild {

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRole(childRoute);
  }

  checkRole(childRoute: ActivatedRouteSnapshot) {
    const mid = childRoute.params.id;
    return forkJoin(
      this.authService.getCurrentNonunbubUser(),
      this.meetingService.getMeeting(mid)
    ).pipe(map(data => {
      const user: User = data[0];
      const meeting: Meeting = data[1];
      if (!!user && !!meeting) {
        return user.uid === meeting.host;
      } else {
        alert('권한이 없습니다!')
        return false;
      }
    }))
  }
}
