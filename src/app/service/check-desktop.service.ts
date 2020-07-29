import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckDesktopService {
  private isDesktopSource = new BehaviorSubject<boolean>(true);
  isDesktop = this.isDesktopSource.asObservable();

  constructor() { }

  setIsDesktop(width) {
    if (width < 568) {
      this.isDesktopSource.next(false);
    } else {
      this.isDesktopSource.next(true);
    }
  }
}
