import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MeetingService } from './meeting.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivateChild {

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | Observable<boolean> | Promise<boolean> {
    return this.checkRole(childRoute);
  }

  checkRole(childRoute: ActivatedRouteSnapshot) {
    const mid = childRoute.params.mid;
    return this.authService.getCurrentNonunbubUser().pipe(
      concatMap(user => {
        return this.meetingService.getPurchasedMeetings(user.uid)
      }),
      map(purchasedMeetings => {
        const isPurchased = purchasedMeetings.find(m => m.payment.mid === +mid);
        if (!!isPurchased) {
          alert('이미 결제한 모임입니다.');
          return false;
        } else return true;
      })
    )
  }
}
